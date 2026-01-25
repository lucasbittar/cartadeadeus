import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Create a rate limiter instance
// Uses Upstash Redis for persistent rate limiting across serverless functions
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '',
});

// Configure rate limiter: 5 requests per hour per IP
export const letterRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'ratelimit:letters',
});

// Get client IP from request headers (works with Vercel's edge network)
export function getClientIP(request: NextRequest): string {
  // Vercel provides the real IP in x-forwarded-for
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, first one is the client
    return forwarded.split(',')[0].trim();
  }

  // Fallback to x-real-ip
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Last resort fallback
  return 'anonymous';
}

// Check if rate limiting is enabled (Redis is configured)
export function isRateLimitEnabled(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Rate limit check that gracefully degrades if Redis is not configured
export async function checkRateLimit(request: NextRequest): Promise<RateLimitResult> {
  if (!isRateLimitEnabled()) {
    // If Redis is not configured, allow all requests (development mode)
    return { success: true, limit: 5, remaining: 5, reset: Date.now() };
  }

  const ip = getClientIP(request);
  const { success, limit, remaining, reset } = await letterRateLimiter.limit(ip);

  return { success, limit, remaining, reset };
}
