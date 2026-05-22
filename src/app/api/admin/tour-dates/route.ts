import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { tourDateInputSchema, formatZodError } from '@/lib/validation';

// GET — list every tour date (upcoming + past), soonest first.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data, error } = await adminSupabase
      .from('tour_dates')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching tour dates:', error);
      return NextResponse.json({ error: 'Failed to fetch tour dates' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/admin/tour-dates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — create a tour date.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = tourDateInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data, error } = await adminSupabase
      .from('tour_dates')
      .insert(validation.data)
      .select()
      .single();

    if (error) {
      console.error('Error creating tour date:', error);
      return NextResponse.json({ error: 'Failed to create tour date' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/tour-dates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
