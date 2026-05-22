-- Hub expansion: tour dates + YouTube videos
-- Both tables are publicly readable; writes happen only through the
-- service-role client (admin endpoints), so no public write policies exist.

-- ───────────────────────── tour_dates ─────────────────────────
CREATE TABLE IF NOT EXISTS tour_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  ticket_url TEXT,
  status TEXT NOT NULL DEFAULT 'on_sale'
    CHECK (status IN ('on_sale', 'sold_out', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tour_dates_event_date ON tour_dates(event_date);

ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tour dates"
  ON tour_dates
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies: admin writes use the service-role client.

-- ─────────────────────────── videos ───────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  title VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_sort_order ON videos(sort_order);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read videos"
  ON videos
  FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies: admin writes use the service-role client.
