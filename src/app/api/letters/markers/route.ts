import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('letters')
      .select('id, lat, lng')
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching letter markers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letter markers' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/letters/markers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
