# CLAUDE.md - Technical Reference

This file contains technical context for AI assistants working on this codebase.

## Project Overview

**Carta de Adeus** is a Next.js 14 hotsite for Fresno's album where fans submit 280-character goodbye letters displayed on a 3D globe.

## Architecture

### Frontend Stack
- **Next.js 14** with App Router (all components are client-side with `'use client'`)
- **React Three Fiber** for 3D globe visualization
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Zustand** for global state management
- **TanStack Query** for data fetching

### Backend Stack
- **Next.js API Routes** (Route Handlers in `src/app/api/`)
- **Supabase** for PostgreSQL database
- **Google Geocoding API** for city search
- **Satori + Sharp** for image generation

## Key Files

### API Routes
- `src/app/api/letters/route.ts` - GET/POST letters to Supabase
- `src/app/api/cities/route.ts` - City search using Google Geocoding API
- `src/app/api/share-image/route.tsx` - Generate PNG images with Satori

### Core Components
- `src/components/globe/globe-scene.tsx` - Three.js globe with letter markers
- `src/components/letter/letter-form.tsx` - Main letter submission form
- `src/components/letter/city-search.tsx` - City autocomplete with GPS support
- `src/components/effects/falling-papers.tsx` - CSS-based falling papers animation
- `src/components/effects/hero-background.tsx` - Parallax background with scroll effect

### State Management
- `src/store/letter-store.ts` - Zustand store managing:
  - `formData` - Current form state
  - `submittedLetter` - Last submitted letter
  - `isFormModalOpen` / `isShareModalOpen` - Modal states

### Database
- Schema in `supabase/schema.sql`
- Table: `letters` with columns: id, content, author, is_anonymous, lat, lng, city, created_at

## Common Tasks

### Adding a new API endpoint
1. Create route file in `src/app/api/[endpoint]/route.ts`
2. Export async functions: `GET`, `POST`, `PUT`, `DELETE`
3. Use `NextRequest` and `NextResponse` from `next/server`

### Modifying the globe
- Globe component: `src/components/globe/globe-scene.tsx`
- Uses `@react-three/fiber` and `@react-three/drei`
- Letter points are rendered as `<Points>` with custom shaders
- Colors defined in `src/constants/colors.ts` (use `threeColors` for Three.js)

### Changing copy/text
- All Portuguese text is in `src/constants/copy.ts`
- Keep text in Portuguese (PT-BR)

### Image generation templates
- Story (1080x1920): `src/lib/satori/templates/story-template.tsx`
- OG (1200x630): `src/lib/satori/templates/og-template.tsx`
- Uses React components with inline styles (Satori requirement)
- Fonts loaded from Google Fonts CDN (TTF format required)

## Known Issues & Solutions

### Google Fonts in Satori
Font URLs change over time. If image generation fails with "Unsupported OpenType signature", update font URLs in `src/app/api/share-image/route.tsx`:
```bash
# Get current font URL
curl -sA "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
```

### Supabase cookies() async
Next.js 14 requires `await cookies()`. The server client in `src/lib/supabase/server.ts` handles this.

### Three.js peer dependencies
Install with `--legacy-peer-deps` if dependency conflicts occur.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=      # (optional) For admin operations
GOOGLE_MAPS_API_KEY=            # Requires Geocoding API enabled
```

## API Details

### Cities API (`/api/cities`)
Uses Google Geocoding API (not Places API) for city search:
- `?q=São Paulo` - Forward geocoding (search by name)
- `?lat=-23.55&lng=-46.63` - Reverse geocoding (coordinates to city)

Returns:
```typescript
{
  name: string;      // City name
  country: string;   // Country name
  fullName: string;  // Full formatted address
  lat: number;
  lng: number;
}
```

### Letters API (`/api/letters`)
- GET: Returns all letters ordered by `created_at DESC`
- POST: Creates letter, expects `LetterInput` body

### Share Image API (`/api/share-image`)
- POST with `{ letter: Letter, format: 'story' | 'og' }`
- Returns PNG image as binary response

## Type Definitions

```typescript
// src/types/index.ts
interface Letter {
  id: string;
  content: string;
  author: string | null;
  is_anonymous: boolean;
  lat: number;
  lng: number;
  city: string;
  created_at: string;
}

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  fullName: string;
}
```

## Design System

### Colors
- **Background**: `#FFFFFF` (white)
- **Foreground**: `#1A1A1A` (near black)
- **Burgundy**: `#8B1538` (primary accent)
- **Cream**: `#FDF8F5` (secondary background)

### Fonts
- **Playfair Display**: Headings, titles
- **JetBrains Mono**: Letter content, monospace
- **Inter**: Body text, UI elements

### Key Tailwind Classes
- `text-burgundy` - Primary accent color
- `bg-cream` - Secondary background
- `font-playfair` - Heading font
- `font-jetbrains` - Monospace font

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment Notes

- Vercel recommended for Next.js deployment
- Set all environment variables in Vercel dashboard
- Supabase connection uses pooler for serverless compatibility
