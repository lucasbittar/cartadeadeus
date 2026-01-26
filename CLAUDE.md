# CLAUDE.md - Technical Reference

This file is the source of truth for AI assistants working on this codebase. It contains technical context, design philosophy, architectural decisions, and best practices.

---

## Project Overview

**Carta de Adeus** is a Next.js 14 hotsite for Fresno's album where fans submit 280-character goodbye letters displayed on a 3D globe. The site features a countdown to a live concert event on April 18, 2026.

**Core Features:**
- Letter submission with city geolocation
- Interactive 3D globe showing letter locations
- Letters marquee with typewriter effect
- Countdown timer to live event
- Social sharing (native mobile + X/Twitter)
- Share image generation for Instagram Stories

---

## Design Philosophy

### Visual Aesthetic: Editorial Luxury
The design follows a refined, premium editorial aesthetic inspired by luxury magazines and concert announcements:

- **Typography-first**: Large, dramatic type creates visual hierarchy
- **Restraint over excess**: Generous whitespace, minimal decoration
- **Serif + Monospace pairing**: Playfair Display for elegance, JetBrains Mono for authenticity
- **Burgundy as signature**: Used sparingly as accent, never overwhelming
- **Cream warmth**: Soft backgrounds avoid harsh white

### Design Principles
1. **Content is king**: Letters and countdown are heroes, UI is invisible
2. **Mobile-first**: Every feature designed for touch/mobile before desktop
3. **Performance as UX**: Animations should feel smooth, never janky
4. **Emotional resonance**: Design should evoke nostalgia, anticipation, intimacy

### Color Palette
```
Background:     #FFFFFF (white)
Foreground:     #1A1A1A (near black)
Burgundy:       #8B1538 (primary accent)
Burgundy Light: #D8758D (soft accent for separators)
Cream:          #FDF8F5 (secondary background)
Muted:          #666666, #999999, #AAAAAA (text hierarchy)
```

### Typography Scale
- **Hero numbers**: 280-364px (countdown days)
- **Display**: 72-80px (major headings)
- **Title**: 48-62px (section titles)
- **Body large**: 26-36px (quotes, featured text)
- **Body**: 14-16px (regular content)
- **Caption**: 12-14px (metadata, labels)

### Spacing Philosophy
- Use generous padding (80-140px on desktop, 40-80px on mobile)
- Letter-spacing on uppercase labels: 0.25-0.4em
- Tight letter-spacing on large numbers: -0.02 to -0.03em
- Consistent gaps in flex containers: 6 (24px) base unit

---

## Architecture

### Frontend Stack
- **Next.js 14** with App Router (all components are client-side with `'use client'`)
- **React Three Fiber** for 3D globe visualization
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Zustand** for global state management
- **TanStack Query** for data fetching with 30s refetch interval

### Backend Stack
- **Next.js API Routes** (Route Handlers in `src/app/api/`)
- **Supabase** for PostgreSQL database
- **Google Geocoding API** for city search
- **Satori + Sharp** for image generation

### File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── letters/route.ts      # Letter CRUD
│   │   ├── cities/route.ts       # Geocoding
│   │   └── share-image/route.tsx # Image generation
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── countdown/                # Countdown timer & share
│   ├── effects/                  # Visual effects (falling papers, parallax)
│   ├── globe/                    # 3D globe visualization
│   ├── letter/                   # Letter form, preview, modals
│   ├── letters/                  # Marquee, letter cards
│   ├── share/                    # Share modal, backgrounds
│   └── ui/                       # Reusable UI components
├── constants/
│   ├── colors.ts                 # Color definitions
│   └── copy.ts                   # All Portuguese text
├── lib/
│   ├── satori/templates/         # Share image templates
│   ├── supabase/                 # Database clients
│   └── utils.ts                  # Utility functions
├── store/
│   └── letter-store.ts           # Zustand global state
└── types/
    └── index.ts                  # TypeScript interfaces
```

---

## Key Components

### Globe (`src/components/globe/globe-scene.tsx`)
- Uses `@react-three/fiber` and `@react-three/drei`
- Letter points rendered as `<Points>` with custom shaders
- Click markers to open letter preview modal
- Colors in `src/constants/colors.ts` (use `threeColors` for Three.js)

### Letters Marquee (`src/components/letters/`)
- `letters-marquee.tsx`: Fetches letters, splits into rows
- `marquee-row.tsx`: Auto-scrolling with drag/swipe support
- `letter-card.tsx`: Individual card with typewriter effect
- **Mobile**: Single row, cards have dynamic height based on content
- **Desktop**: Two rows scrolling in opposite directions
- Uses `items-start` in flex container for variable card heights

### Countdown (`src/components/countdown/`)
- Target date: April 18, 2026
- Displays days, hours, minutes, seconds
- Share button: Mobile uses native share, desktop uses X/Twitter

### Share System
- `share-modal.tsx`: Post-submission share options
- `letter-preview.tsx`: View letters from map (no share button - users only share their own letters)
- Mobile: Native Web Share API with file sharing
- Desktop: Download button + X/Twitter intent

### Author Name Linking (`src/components/ui/author-name.tsx`)
- Automatically detects `@username` patterns in author names
- Converts to clickable Instagram profile links
- Used in letter preview modal and letter cards

---

## Share Image System

### Architecture
Images are generated server-side using Satori (SVG) + Sharp (PNG conversion).

**Flow:**
1. Client requests image via POST to `/api/share-image`
2. Server loads static background image from `/public/`
3. Satori renders text overlay as SVG (transparent background)
4. Sharp composites text overlay onto background
5. Returns PNG binary response

### Formats
| Format | Dimensions | Use Case |
|--------|------------|----------|
| `story` | 1080x1920 | Instagram Stories, letter sharing |
| `og` | 1200x630 | Open Graph, Twitter cards |
| `countdown` | 1080x1920 | Countdown sharing (uses story background) |

### Templates (`src/lib/satori/templates/`)
- `text-overlay-story.tsx`: Letter content for Stories
- `text-overlay-og.tsx`: Letter content for OG images
- `countdown-overlay-story.tsx`: Countdown display

### Countdown Image Design
Premium editorial aesthetic with:
- Giant day number (364px) as hero element
- "FALTAM" pre-headline in burgundy with wide letter-spacing
- Hours:minutes in bordered container
- Italic "para Fresno ao vivo" tagline
- "A contagem começou" footer

### Satori Limitations
- **No CSS gradients in text**
- **Inline styles only** (no Tailwind classes)
- **TTF fonts required** (not WOFF/WOFF2)
- **Limited flexbox support**

### Font Loading
Fonts loaded from Google Fonts static URLs. If image generation fails with "Unsupported OpenType signature":
```bash
# Get current font URL
curl -sA "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
```

---

## Mobile Considerations

### Native Share (Web Share API)
- **Requires HTTPS** - won't work on `http://` local network
- Use ngrok for testing: `ngrok http 3000`
- Fallback to download if `navigator.canShare` returns false
- File sharing: `navigator.share({ files: [file] })`

### Responsive Patterns
- Mobile share button: `md:hidden`
- Desktop buttons: `hidden md:flex` or `hidden md:block`
- Single marquee row on mobile, two on desktop
- Touch events: `onTouchStart`, `onTouchMove`, `onTouchEnd`

### Mobile-Specific Features
- Native share sheet for countdown and letter images
- Drag/swipe support on marquee
- Dynamic card heights (no min-height constraint)

---

## State Management

### Zustand Store (`src/store/letter-store.ts`)
```typescript
{
  formData: FormData;           // Current form state
  submittedLetter: Letter;      // Last submitted letter (for sharing)
  selectedLetter: Letter;       // Letter selected from map marker
  isFormModalOpen: boolean;
  isShareModalOpen: boolean;
}
```

### Data Fetching (TanStack Query)
- Letters refetch every 30 seconds
- Query key: `['letters']`
- Optimistic updates not implemented (simple POST + refetch)

---

## API Reference

### Letters API (`/api/letters`)
```typescript
// GET - Fetch all letters
Response: Letter[]

// POST - Create letter
Body: { content, author?, is_anonymous, lat, lng, city }
Response: Letter
```

### Cities API (`/api/cities`)
```typescript
// Forward geocoding
GET /api/cities?q=São Paulo
Response: City[]

// Reverse geocoding
GET /api/cities?lat=-23.55&lng=-46.63
Response: City[]
```

### Share Image API (`/api/share-image`)
```typescript
// Letter image
POST { letter: Letter, format: 'story' | 'og' }

// Countdown image
POST { format: 'countdown', countdown: { days, hours, minutes } }

Response: image/png binary
```

---

## Type Definitions

```typescript
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

type ShareFormat = 'story' | 'og' | 'countdown';
```

---

## Security Measures

### Input Validation
- Letter content capped at 280 characters (client + server)
- Author name sanitized
- Coordinates validated as valid lat/lng ranges

### API Security
- Supabase RLS (Row Level Security) for database access
- No sensitive data exposed in client-side code
- Environment variables for all secrets

### Content Security
- User-generated content displayed with proper escaping
- No `dangerouslySetInnerHTML` usage
- External links use `rel="noopener noreferrer"`

### Share Privacy
- Users can only share their own letters (share button removed from map preview)
- Anonymous letters show "Anônimo" instead of null

---

## Performance Optimizations

### Image Generation
- Static backgrounds loaded once per request
- Sharp for efficient PNG encoding
- Images cached with `Cache-Control: public, max-age=31536000, immutable`

### 3D Globe
- Points rendered with instancing (single draw call)
- Custom shaders for performance
- Lazy loading of Three.js dependencies

### Animations
- Framer Motion with `will-change` optimization
- CSS animations for simple effects (falling papers)
- `requestAnimationFrame` for marquee auto-scroll
- Reduced motion support: `prefers-reduced-motion` query

### Data Fetching
- TanStack Query for caching and deduplication
- 30-second refetch interval (not real-time)
- Optimistic rendering where possible

---

## Scalability Strategies

### Database
- Supabase pooler for serverless compatibility
- Indexed `created_at` for efficient ordering
- No complex queries (simple CRUD)

### CDN & Caching
- Vercel Edge Network for static assets
- Generated images have long cache TTL
- API routes are serverless (auto-scaling)

### Future Considerations
- Pagination for letters API if volume grows
- WebSocket for real-time letter updates
- Image CDN for generated share images

---

## Code Practices

### Component Patterns
- All components use `'use client'` (no RSC complexity)
- Props interfaces defined above component
- Destructure props with defaults
- Use `cn()` utility for conditional classes

### Styling
- Tailwind CSS exclusively (no CSS modules)
- Custom colors in `tailwind.config.ts`
- Responsive: mobile-first with `md:` and `lg:` breakpoints

### TypeScript
- Strict mode enabled
- Interfaces for all data shapes
- Avoid `any` - use `unknown` with type guards

### Naming Conventions
- Components: PascalCase (`LetterCard.tsx`)
- Utilities: camelCase (`formatDate`)
- Constants: camelCase or SCREAMING_SNAKE_CASE
- CSS classes: kebab-case (Tailwind)

### File Organization
- One component per file
- Related components in same directory
- Shared utilities in `src/lib/`
- Types co-located or in `src/types/`

---

## Copy & Localization

All user-facing text is in `src/constants/copy.ts`:
- **Language**: Portuguese (PT-BR)
- **Structure**: Nested object by feature area
- **Usage**: Import `copy` and access via dot notation

When adding new text:
1. Add to appropriate section in `copy.ts`
2. Use descriptive keys
3. Never hardcode Portuguese strings in components

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=      # Server-only, admin operations
GOOGLE_MAPS_API_KEY=            # Requires Geocoding API enabled
```

---

## Commands

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

### Platform: Vercel
- Recommended for Next.js
- Automatic deployments from `main` branch
- Preview deployments for PRs

### Setup
1. Connect GitHub repository to Vercel
2. Set environment variables in dashboard
3. Deploy

### Monitoring
- Vercel Analytics for performance
- Supabase dashboard for database metrics
- Error tracking via Vercel logs

---

## Known Issues & Solutions

### Google Fonts in Satori
Font URLs change periodically. Update URLs in `src/app/api/share-image/route.tsx` if image generation fails.

### Supabase cookies() async
Next.js 14 requires `await cookies()`. Handled in `src/lib/supabase/server.ts`.

### Three.js peer dependencies
Install with `--legacy-peer-deps` if conflicts occur.

### Web Share API on HTTP
Native file sharing requires HTTPS. Use ngrok for mobile testing.

---

## Recent Changes Log

### Instagram Handle Linking
- `AuthorName` component auto-links `@username` to Instagram profiles
- Applied to letter preview modal and letter cards

### Dynamic Letter Card Heights
- Cards size to content (removed `min-h-[80px]`)
- Flex container uses `items-start` instead of stretch

### Mobile Native Share
- Countdown and letter sharing use Web Share API on mobile
- Falls back to download if unsupported
- Desktop retains X/Twitter + download buttons

### Countdown Share Image
- Premium editorial design with dramatic typography
- 364px day number, refined spacing, burgundy accents
- Uses existing story background

### Share Button Privacy
- Removed share from letter preview modal (map markers)
- Users only share their own submitted letters

---

## Planning New Features

When planning new features, consider:

1. **Mobile-first**: How does it work on touch devices?
2. **Performance**: Does it add significant bundle size?
3. **Consistency**: Does it match the editorial luxury aesthetic?
4. **Simplicity**: Can it be simpler? Less is more.
5. **Copy**: Add all text to `copy.ts` first
6. **Types**: Define interfaces before implementation

### Feature Checklist
- [ ] Mobile design/behavior defined
- [ ] Desktop design/behavior defined
- [ ] Copy added to constants
- [ ] Types defined
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Accessibility considered
- [ ] Performance impact assessed
