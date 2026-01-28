import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

// Verify admin session helper
async function verifyAdmin(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(user.email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const status = searchParams.get('status');
    const flagged = searchParams.get('flagged');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Use admin client to bypass RLS and see all letters
    const adminSupabase = createAdminSupabaseClient();

    // Build query
    let query = adminSupabase
      .from('letters')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (flagged === 'true') {
      query = query.eq('flagged', true);
    }

    if (search) {
      query = query.or(`content.ilike.%${search}%,author.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching letters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letters' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      letters: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: count ? offset + limit < count : false,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/letters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
