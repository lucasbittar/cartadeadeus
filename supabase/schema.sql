-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create letters table
CREATE TABLE IF NOT EXISTS letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL CHECK (char_length(content) <= 280),
  author VARCHAR(100),
  is_anonymous BOOLEAN DEFAULT true,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  city VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_letters_created_at ON letters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_letters_location ON letters(lat, lng);

-- Enable Row Level Security
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read letters
CREATE POLICY "Anyone can read letters"
  ON letters
  FOR SELECT
  USING (true);

-- Allow anyone to insert letters
CREATE POLICY "Anyone can insert letters"
  ON letters
  FOR INSERT
  WITH CHECK (true);

-- Prevent updates and deletes
-- (No policies for UPDATE or DELETE means they're not allowed)
