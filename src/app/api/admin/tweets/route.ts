import { NextRequest, NextResponse } from 'next/server';
import { getTweet } from 'react-tweet/api';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { tweetInputSchema, formatZodError } from '@/lib/validation';
import { extractTweetId } from '@/lib/twitter';

// GET — list every curated tweet, in display order, enriched with the
// tweet text + author so the admin list is scannable. react-tweet's
// getTweet has its own in-memory cache, so repeat loads are cheap.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data, error } = await adminSupabase
      .from('tweets')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tweets:', error);
      return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
    }

    const enriched = await Promise.all(
      (data || []).map(async (row) => {
        try {
          const tweet = await getTweet(row.tweet_id);
          if (!tweet) return { ...row, text: null, author: null, avatar: null };
          return {
            ...row,
            text: tweet.text ?? null,
            author: tweet.user
              ? { name: tweet.user.name, screen_name: tweet.user.screen_name }
              : null,
            avatar: tweet.user?.profile_image_url_https ?? null,
          };
        } catch {
          return { ...row, text: null, author: null, avatar: null };
        }
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error in GET /api/admin/tweets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — add a tweet from a pasted X / Twitter URL.
// The status ID is parsed from the URL, then we hit the public syndication
// endpoint to confirm the tweet actually exists before storing it.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = tweetInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const { tweet_url } = validation.data;
    const tweetId = extractTweetId(tweet_url);
    if (!tweetId) {
      return NextResponse.json(
        { error: 'Não foi possível identificar o tweet nesse link.' },
        { status: 400 }
      );
    }

    // Verify the tweet exists / is publicly visible.
    try {
      const data = await getTweet(tweetId);
      if (!data) {
        return NextResponse.json(
          { error: 'Tweet não encontrado ou indisponível publicamente.' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Não foi possível carregar esse tweet agora.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminSupabaseClient();

    // Place new tweets at the end of the list.
    const { data: last } = await adminSupabase
      .from('tweets')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (last?.sort_order ?? -1) + 1;

    const { data, error } = await adminSupabase
      .from('tweets')
      .insert({
        tweet_url,
        tweet_id: tweetId,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tweet:', error);
      return NextResponse.json({ error: 'Failed to create tweet' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/tweets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
