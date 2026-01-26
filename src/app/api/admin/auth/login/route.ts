import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Allowed admin emails (comma-separated in env var)
function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || '';
  return emails.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, redirect = '/admin' } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email obrigatório' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email is in the admin list
    const adminEmails = getAdminEmails();
    if (!adminEmails.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email não autorizado' },
        { status: 403 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Hard-coded production URL for magic link redirect
    const redirectTo = `https://www.cartadeadeus.cc/admin/auth/callback?redirect=${encodeURIComponent(redirect)}`;

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error('Error sending magic link:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar email. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
