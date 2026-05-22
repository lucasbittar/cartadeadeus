-- Curated tweets that power the "O que estão dizendo" section.
-- Public-read; writes happen only through the service-role admin client.

CREATE TABLE IF NOT EXISTS tweets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tweet_url TEXT NOT NULL,
  tweet_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tweets_sort_order ON tweets(sort_order);

ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tweets"
  ON tweets
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies: admin writes use the service-role client.
