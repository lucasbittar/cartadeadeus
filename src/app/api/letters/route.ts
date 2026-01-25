import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit, isRateLimitEnabled } from '@/lib/rate-limit';
import { letterInputSchema, formatZodError } from '@/lib/validation';
import { moderateContent } from '@/lib/moderation';

// Body size limit enforced via Zod validation (content max 280 chars, city max 255)
// For platform-level limits, configure in vercel.json or next.config.js

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching letters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letters' },
        { status: 500 }
      );
    }

    // Return with cache headers for Vercel edge caching
    // 30-second cache with stale-while-revalidate for up to 60 seconds
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

    // Content moderation
    const moderation = moderateContent(validatedData.content);

    if (moderation.isBlocked) {
      return NextResponse.json(
        { error: moderation.reason },
        { status: 400 }
      );
    }

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
