/**
 * Dev-only escape hatch for admin authentication.
 *
 * Returns true ONLY when running the local dev server (`next dev`) AND
 * `ADMIN_BYPASS_AUTH=true` is set in `.env.local`.
 *
 * It is double-gated on purpose: `NODE_ENV` is `'production'` on every Vercel
 * deployment (both preview and production), so even if `ADMIN_BYPASS_AUTH`
 * were ever set on a deployment, the bypass stays off. There is no way for
 * this to weaken auth on a live site.
 *
 * This module has zero imports so it is safe to use from middleware.
 */
export function isAdminAuthBypassed(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.ADMIN_BYPASS_AUTH === 'true'
  );
}
