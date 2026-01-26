import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/admin';
  const origin = request.headers.get('origin') || new URL(request.url).origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(
        new URL('/admin/login?error=auth_failed', origin)
      );
    }

    // Successful login - redirect to admin or specified path
    return NextResponse.redirect(new URL(redirect, origin));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/admin/login', origin));
}
