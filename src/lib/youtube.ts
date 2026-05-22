/**
 * YouTube helpers — all key-less (no API quota).
 * Thumbnails come from img.youtube.com; titles from the public oEmbed endpoint.
 */

/**
 * Extracts the 11-character YouTube video ID from a URL.
 * Supports watch?v=, youtu.be/, shorts/ and embed/ forms.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** High-quality thumbnail URL for a video ID (always exists, 480x360). */
export function youTubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/** Privacy-friendly embed URL for a video ID. */
export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Canonical watch URL for a video ID. */
export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Fetches a video's title via the key-less oEmbed endpoint.
 * Returns null on any failure (network, region-locked, unlisted, etc.).
 */
export async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.title === 'string' ? data.title : null;
  } catch {
    return null;
  }
}
