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
