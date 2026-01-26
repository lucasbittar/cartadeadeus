import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids, status } = body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !status ||
      !['pending', 'approved', 'rejected'].includes(status)
    ) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Limit bulk operations to 100 items
    if (ids.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 items per bulk operation' },
        { status: 400 }
      );
    }

    // Get current user email for audit
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('letters')
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: user?.email || null,
      })
      .in('id', ids)
      .select();

    if (error) {
      console.error('Error bulk updating letters:', error);
      return NextResponse.json(
        { error: 'Failed to update letters' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      updated: data?.length || 0,
      letters: data,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/letters/bulk:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
