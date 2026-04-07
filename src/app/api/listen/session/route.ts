import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_SECRET = process.env.LISTEN_SESSION_SECRET || 'dev-secret-change-in-production';
const COOKIE_NAME = 'listen_session';

function verifySession(token: string): { email: string; expiresAt: number } | null {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return null;

    const payload = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) return null;

    const [email, expiresAtStr] = payload.split(':');
    const expiresAt = parseInt(expiresAtStr, 10);

    if (!email || isNaN(expiresAt) || Date.now() > expiresAt) return null;

    return { email, expiresAt };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifySession(token);

  if (!session) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    email: session.email,
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
