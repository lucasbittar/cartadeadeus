import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { videoInputSchema, formatZodError } from '@/lib/validation';
import { extractYouTubeId, fetchYouTubeTitle } from '@/lib/youtube';

// GET — list every video, in display order.
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    if (!(await verifyAdmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data, error } = await adminSupabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/admin/videos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — add a video from a pasted YouTube URL.
// The video ID is parsed from the URL and the title is auto-fetched via oEmbed.
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

    const validation = videoInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: formatZodError(validation.error) }, { status: 400 });
    }

    const { youtube_url } = validation.data;
    const youtubeId = extractYouTubeId(youtube_url);
    if (!youtubeId) {
      return NextResponse.json(
        { error: 'Não foi possível identificar o vídeo do YouTube nesse link.' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminSupabaseClient();

    // Place new videos at the end of the list.
    const { data: last } = await adminSupabase
      .from('videos')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (last?.sort_order ?? -1) + 1;

    // Title is best-effort — region-locked/unlisted videos may not resolve.
    const title = await fetchYouTubeTitle(youtube_url);

    const { data, error } = await adminSupabase
      .from('videos')
      .insert({
        youtube_url,
        youtube_id: youtubeId,
        title,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating video:', error);
      return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/videos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
