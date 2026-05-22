/**
 * Extracts a tweet (status) ID from an X / Twitter URL.
 * Supports x.com and twitter.com, /status/ and /statuses/ variants.
 * Returns null if no ID is found.
 */
export function extractTweetId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:x|twitter)\.com\/[^/]+\/(?:status|statuses)\/(\d{1,25})/i
  );
  return match ? match[1] : null;
}

// Shape we touch when normalising the syndication response.
type EntityArrays = {
  hashtags?: unknown[] | null;
  urls?: unknown[] | null;
  user_mentions?: unknown[] | null;
  symbols?: unknown[] | null;
};
type TweetLike = {
  entities?: EntityArrays | null;
  quoted_tweet?: TweetLike | null;
  parent?: TweetLike | null;
};

/**
 * Normalises a tweet object from the public syndication endpoint so
 * `react-tweet`'s `EmbeddedTweet` doesn't crash on tweets where one of the
 * entity arrays (`hashtags` / `urls` / `user_mentions` / `symbols`) is missing,
 * null, or some other non-iterable value — its internal `addEntities`
 * iterates them without a guard.
 *
 * `Array.isArray` is stricter than a nullish check on purpose: it also catches
 * the (rare) cases where the syndication API returns an object or a boolean
 * where an array is expected.
 *
 * Recurses into quoted tweets and parent tweets which can have the same gap.
 */
export function sanitizeTweet<T>(tweet: T): T {
  if (!tweet || typeof tweet !== 'object') return tweet;
  const node = tweet as unknown as TweetLike & {
    entities?: EntityArrays & { media?: unknown };
  };
  if (!node.entities || typeof node.entities !== 'object') node.entities = {};
  const e = node.entities as Record<string, unknown>;
  if (!Array.isArray(e.hashtags)) e.hashtags = [];
  if (!Array.isArray(e.urls)) e.urls = [];
  if (!Array.isArray(e.user_mentions)) e.user_mentions = [];
  if (!Array.isArray(e.symbols)) e.symbols = [];
  // `media` is read conditionally in getEntities; if present it must be iterable.
  if (e.media != null && !Array.isArray(e.media)) e.media = [];
  if (node.quoted_tweet) sanitizeTweet(node.quoted_tweet);
  if (node.parent) sanitizeTweet(node.parent);
  return tweet;
}
