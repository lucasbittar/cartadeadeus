import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';

// Allowed admin emails (comma-separated in env var)
function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || '';
  return emails.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

// Security headers to add to all responses
const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  // DNS prefetch control
  'X-DNS-Prefetch-Control': 'on',
  // Permissions policy (disable unnecessary features)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

// Content Security Policy
// Configured to allow:
// - Self-hosted resources
// - Google Fonts and Gstatic (fonts)
// - Supabase (API)
// - Inline styles (required for Tailwind)
// - Blob URLs (for Three.js)
// - Data URLs (for images)
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval needed for Three.js
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.supabase.co https://maps.googleapis.com wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route (except login and auth callback)
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isAuthCallback = pathname === '/admin/auth/callback';

  if (isAdminRoute && !isAdminLoginRoute && !isAuthCallback) {
    // Verify admin session
    const { supabase, response: supabaseResponse } =
      await createMiddlewareSupabaseClient(request);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if user is authenticated and is an admin
    const adminEmails = getAdminEmails();
    const isAdmin =
      user?.email && adminEmails.includes(user.email.toLowerCase());

    if (!user || !isAdmin) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated admin - add security headers to response
    for (const [key, value] of Object.entries(securityHeaders)) {
      supabaseResponse.headers.set(key, value);
    }
    supabaseResponse.headers.set(
      'Content-Security-Policy',
      cspDirectives.join('; ')
    );

    return supabaseResponse;
  }

  // Get the response for non-admin routes
  const response = NextResponse.next();

  // Add security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Add Content-Security-Policy
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3|mp4|webm|ogg|wav|ttf|woff|woff2|eot|otf)).*)',
  ],
};
