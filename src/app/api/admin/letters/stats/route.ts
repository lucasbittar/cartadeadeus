import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS and get accurate counts
    const adminSupabase = createAdminSupabaseClient();

    // Get counts by status
    const [totalResult, pendingResult, flaggedResult, approvedResult, rejectedResult] =
      await Promise.all([
        adminSupabase.from('letters').select('*', { count: 'exact', head: true }),
        adminSupabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
        adminSupabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('flagged', true)
          .eq('status', 'pending'),
        adminSupabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved'),
        adminSupabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected'),
      ]);

    return NextResponse.json({
      total: totalResult.count || 0,
      pending: pendingResult.count || 0,
      flagged: flaggedResult.count || 0,
      approved: approvedResult.count || 0,
      rejected: rejectedResult.count || 0,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/letters/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
