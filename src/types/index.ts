export type LetterStatus = 'pending' | 'approved' | 'rejected';

export interface Letter {
  id: string;
  content: string;
  author?: string | null;
  email?: string | null;
  is_anonymous?: boolean;
  lat: number;
  lng: number;
  city: string;
  created_at: string;
  // Moderation fields (present in admin responses)
  status: LetterStatus;
  flagged: boolean;
  flag_reason: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  favorited: boolean;
}

export interface LetterInput {
  content: string;
  author?: string;
  email?: string;
  is_anonymous: boolean;
  lat: number;
  lng: number;
  city: string;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  fullName: string;
  placeId?: string;
}

export interface LetterMarker {
  id: string;
  lat: number;
  lng: number;
}

// ─────────────────────────── Tour dates ───────────────────────────

export type TourDateStatus = 'on_sale' | 'sold_out' | 'cancelled' | 'free';

export interface TourDate {
  id: string;
  event_date: string;
  venue: string;
  city: string;
  ticket_url: string | null;
  status: TourDateStatus;
  created_at: string;
}

export interface TourDateInput {
  event_date: string;
  venue: string;
  city: string;
  ticket_url?: string | null;
  status: TourDateStatus;
}

// ───────────────────────────── Videos ─────────────────────────────

export interface Video {
  id: string;
  youtube_url: string;
  youtube_id: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export interface VideoInput {
  youtube_url: string;
}

// ───────────────────────────── Tweets ─────────────────────────────

export interface Tweet {
  id: string;
  tweet_url: string;
  tweet_id: string;
  sort_order: number;
  created_at: string;
}

export interface TweetInput {
  tweet_url: string;
}
