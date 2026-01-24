export interface Letter {
  id: string;
  content: string;
  author: string | null;
  is_anonymous: boolean;
  lat: number;
  lng: number;
  city: string;
  created_at: string;
}

export interface LetterInput {
  content: string;
  author?: string;
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

export interface GlobePoint {
  lat: number;
  lng: number;
  letter: Letter;
}
