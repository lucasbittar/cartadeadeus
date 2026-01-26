-- Add moderation fields to letters table for content management
-- Migration: High-Traffic Readiness - Content Moderation

-- Add status column with enum-like constraint
ALTER TABLE letters ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add flagging fields
ALTER TABLE letters ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS flag_reason text;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS moderated_at timestamptz;
ALTER TABLE letters ADD COLUMN IF NOT EXISTS moderated_by text;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_letters_status ON letters(status);
CREATE INDEX IF NOT EXISTS idx_letters_flagged ON letters(flagged, status);
CREATE INDEX IF NOT EXISTS idx_letters_status_created ON letters(status, created_at DESC);

-- Migrate existing letters to approved status
UPDATE letters
SET status = 'approved', flagged = false
WHERE status IS NULL OR status = 'pending';

-- Add comment explaining the status values
COMMENT ON COLUMN letters.status IS 'pending: awaiting review, approved: visible to public, rejected: hidden';
COMMENT ON COLUMN letters.flagged IS 'true if auto-flagged for manual review';
COMMENT ON COLUMN letters.flag_reason IS 'reason for auto-flagging (e.g., suspicious content patterns)';
