import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminAuthBypassed } from '@/lib/admin-bypass';

/**
 * Returns true if the current Supabase session belongs to a whitelisted
 * admin email (ADMIN_EMAILS env var, comma-separated).
 *
 * In local dev with ADMIN_BYPASS_AUTH=true this always returns true — see
 * `admin-bypass.ts`.
 */
export async function verifyAdmin(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>
): Promise<boolean> {
  if (isAdminAuthBypassed()) return true;

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
