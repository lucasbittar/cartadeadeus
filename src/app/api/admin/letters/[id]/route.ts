import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, favorited } = body;

    // Must have at least one valid field to update
    const hasStatus = status && ['pending', 'approved', 'rejected'].includes(status);
    const hasFavorited = typeof favorited === 'boolean';

    if (!hasStatus && !hasFavorited) {
      return NextResponse.json(
        { error: 'Invalid update fields' },
        { status: 400 }
      );
    }

    // Get current user email for audit
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Use admin client to bypass RLS for the update
    const adminSupabase = createAdminSupabaseClient();

    const updateData: Record<string, unknown> = {};
    if (hasStatus) {
      updateData.status = status;
      updateData.moderated_at = new Date().toISOString();
      updateData.moderated_by = user?.email || null;
    }
    if (hasFavorited) {
      updateData.favorited = favorited;
    }

    const { data, error } = await adminSupabase
      .from('letters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating letter:', error);
      return NextResponse.json(
        { error: 'Failed to update letter' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PATCH /api/admin/letters/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
