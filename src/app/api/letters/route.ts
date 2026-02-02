import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit, isRateLimitEnabled } from '@/lib/rate-limit';
import { letterInputSchema, formatZodError } from '@/lib/validation';
import { moderateContent, checkForFlagging } from '@/lib/moderation';

// Body size limit enforced via Zod validation (content max 280 chars, city max 255)
// For platform-level limits, configure in vercel.json or next.config.js

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20));
    const offset = (page - 1) * limit;

    const supabase = await createServerSupabaseClient();

    // Only return approved letters with public fields
    const { data, error } = await supabase
      .from('letters')
      .select('id, content, author, is_anonymous, lat, lng, city, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching letters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letters' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitResult = await checkRateLimit(request);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Você atingiu o limite de cartas. Tente novamente mais tarde.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validation = letterInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodError(validation.error) },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Content moderation - hard block for obvious violations
    const moderation = moderateContent(validatedData.content);

    if (moderation.isBlocked) {
      return NextResponse.json(
        { error: moderation.reason },
        { status: 400 }
      );
    }

    // Check for suspicious content that should be flagged for review
    const flagging = checkForFlagging(validatedData.content);

    // Determine status: flagged content goes to pending, clean content is auto-approved
    const status = flagging.shouldFlag ? 'pending' : 'approved';

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('letters')
      .insert({
        content: validatedData.content,
        author: validatedData.is_anonymous ? null : validatedData.author,
        is_anonymous: validatedData.is_anonymous,
        lat: validatedData.lat,
        lng: validatedData.lng,
        city: validatedData.city,
        status,
        flagged: flagging.shouldFlag,
        flag_reason: flagging.flagReason,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating letter:', error);
      return NextResponse.json(
        { error: 'Failed to create letter' },
        { status: 500 }
      );
    }

    // Include rate limit info in success response
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(rateLimitResult.limit),
      'X-RateLimit-Remaining': String(rateLimitResult.remaining),
    };

    // Only add reset header if rate limiting is enabled
    if (isRateLimitEnabled()) {
      headers['X-RateLimit-Reset'] = String(rateLimitResult.reset);
    }

    return NextResponse.json(data, {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error('Error in POST /api/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
