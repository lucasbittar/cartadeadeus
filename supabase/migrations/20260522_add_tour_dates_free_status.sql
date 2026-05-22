-- Add a "free entry" (entrada franca) status for shows with no ticket sale.
-- Run after 20260522_add_tour_dates_and_videos.sql.

ALTER TABLE tour_dates DROP CONSTRAINT IF EXISTS tour_dates_status_check;

ALTER TABLE tour_dates ADD CONSTRAINT tour_dates_status_check
  CHECK (status IN ('on_sale', 'sold_out', 'cancelled', 'free'));
