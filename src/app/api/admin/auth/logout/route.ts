import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  const origin = request.headers.get('origin') || new URL(request.url).origin;
  return NextResponse.redirect(new URL('/admin/login', origin));
}
