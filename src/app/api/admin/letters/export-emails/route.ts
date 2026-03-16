import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all letters with non-null email
    const adminSupabase = createAdminSupabaseClient();

    const { data, error } = await adminSupabase
      .from('letters')
      .select('email')
      .not('email', 'is', null)
      .neq('email', '');

    if (error) {
      console.error('Error fetching emails:', error);
      return NextResponse.json(
        { error: 'Failed to fetch emails' },
        { status: 500 }
      );
    }

    // Deduplicate emails
    const emailSet = new Set<string>();
    for (const row of data || []) {
      const email = row.email?.toLowerCase().trim();
      if (email) emailSet.add(email);
    }
    const uniqueEmails = Array.from(emailSet);

    // Build CSV
    const csv = ['email', ...uniqueEmails].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="emails.csv"',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/letters/export-emails:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
