import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { LetterInput } from '@/types';

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

    return NextResponse.json(data || []);
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
    const body: LetterInput = await request.json();

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (body.content.length > 280) {
      return NextResponse.json(
        { error: 'Content must be 280 characters or less' },
        { status: 400 }
      );
    }

    if (typeof body.lat !== 'number' || typeof body.lng !== 'number') {
      return NextResponse.json(
        { error: 'Valid coordinates are required' },
        { status: 400 }
      );
    }

    if (!body.city || body.city.trim().length === 0) {
      return NextResponse.json(
        { error: 'City is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('letters')
      .insert({
        content: body.content.trim(),
        author: body.is_anonymous ? null : body.author?.trim() || null,
        is_anonymous: body.is_anonymous,
        lat: body.lat,
        lng: body.lng,
        city: body.city.trim(),
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
