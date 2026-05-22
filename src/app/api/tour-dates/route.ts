import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Public: upcoming tour dates, soonest first.
// Shows from the last 24h are still included so a same-day concert stays visible.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('tour_dates')
      .select('id, event_date, venue, city, ticket_url, status')
      .gte('event_date', cutoff)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching tour dates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tour dates' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/tour-dates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
