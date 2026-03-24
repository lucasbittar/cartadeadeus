import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { mockAllowedEmails } from '@/data/mock-listen';

const SESSION_SECRET = process.env.LISTEN_SESSION_SECRET || 'dev-secret-change-in-production';
const COOKIE_NAME = 'listen_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function signSession(email: string, expiresAt: number): string {
  const payload = `${email}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'rate_limited' },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'invalid_body' },
        { status: 400 }
      );
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'invalid_email' },
        { status: 400 }
      );
    }

    // Check against allowlist (mock data for prototype)
    const isAllowed = mockAllowedEmails.includes(email);

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'not_allowed' },
        { status: 403 }
      );
    }

    // Create signed session cookie
    const expiresAt = Date.now() + SESSION_DURATION;
    const token = signSession(email, expiresAt);

    const response = NextResponse.json({ success: true, email });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION / 1000,
    });

    return response;
  } catch (error) {
    console.error('Error in POST /api/listen/verify:', error);
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    );
  }
}
