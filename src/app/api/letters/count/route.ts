import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { count, error } = await supabase
      .from('letters')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching letter count:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letter count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count ?? 0 }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/letters/count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
