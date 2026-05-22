import { NextResponse } from 'next/server';
import { getTweet } from 'react-tweet/api';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { sanitizeTweet } from '@/lib/twitter';

// Public: curated tweets with their fully-resolved data, in display order.
// Tweet data is fetched server-side from X's public syndication endpoint so
// the homepage never makes a third-party request from the browser.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: rows, error } = await supabase
      .from('tweets')
      .select('id, tweet_id, tweet_url, sort_order')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tweets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tweets' },
        { status: 500 }
      );
    }

    // Resolve each tweet in parallel; a deleted/private tweet just renders null.
    const resolved = await Promise.all(
      (rows || []).map(async (row) => {
        try {
          const data = await getTweet(row.tweet_id);
          return {
            id: row.id,
            tweet_id: row.tweet_id,
            tweet_url: row.tweet_url,
            data: data ? sanitizeTweet(data) : null,
          };
        } catch {
          return {
            id: row.id,
            tweet_id: row.tweet_id,
            tweet_url: row.tweet_url,
            data: null,
          };
        }
      })
    );

    return NextResponse.json(resolved, {
      headers: {
        // Browser never caches (max-age=0); the CDN holds a 5-min copy with
        // background revalidation. Browser-side caching here is what made
        // pre-sanitize tweet payloads persist after we shipped the fix.
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/tweets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
