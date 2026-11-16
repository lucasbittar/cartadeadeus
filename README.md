# Carta de Adeus

Interactive hotsite for Fresno's album **"Carta de Adeus"** where fans can write goodbye letters that are visualized on a 3D globe.

![Fresno - Carta de Adeus](public/screenshot-1.jpg)

## About

"Carta de Adeus" (Goodbye Letter) is an immersive web experience that invites fans to share their own goodbye letters, inspired by Fresno's album. Each letter appears as a glowing point on a 3D globe, creating a worldwide tapestry of shared emotions.

> *"Pra cada vez que eu precisei de palavras e não as pude encontrar, eu fiz uma carta. Todas elas são de adeus."*

## Features

- **Write Letters**: Share your goodbye letter (280 characters max)
- **City Search**: Autocomplete city search powered by Google Geocoding API
- **GPS Location**: Use your current location with one click
- **3D Globe**: Watch letters appear as glowing markers around the world
- **Social Sharing**: Download beautifully designed images for Instagram Stories or Feed
- **Falling Papers**: Atmospheric animation inspired by the album artwork
- **Listen** (`/ouvir`): album player with synced lyrics
- **Mural** (`/mural`): wall of the latest 100 letters
- **Admin**: moderation queue, bulk actions, stats, tour dates, videos and tweets for the band hub

## How it works

Live at **[cartadeadeus.cc](https://cartadeadeus.cc)**, where it has served about 22,000 visitors.

```
Browser ──► Vercel CDN (s-maxage + stale-while-revalidate)
              │
              ├─► /api/letters/markers   id, lat, lng only ─► Supabase (Postgres)
              ├─► /api/letters/[id]      one letter, on click
              ├─► /api/letters?page=     paginated feed (20 by default, 100 max)
              ├─► /api/letters  POST     Zod validation ─► Upstash Redis rate limit ─► Supabase
              ├─► /api/cities            Google Geocoding ─► in-memory LRU cache
              └─► /api/share-image       Satori + Sharp, cached as immutable
```

## Key decisions and tradeoffs

**Split the letters API into three endpoints.** The first version sent every letter, content included, in one response, which would not survive launch traffic. The globe only needs coordinates, and the modal only needs one letter at a time. So the globe loads [`/api/letters/markers`](src/app/api/letters/markers/route.ts) (id, lat, lng), a click loads [`/api/letters/[id]`](src/app/api/letters/[id]/route.ts), and the feed pages through [`/api/letters`](src/app/api/letters/route.ts). The original brief is in [`prompt/letters-scalability.md`](prompt/letters-scalability.md).

**Let the CDN absorb the traffic.** Every read route sets `Cache-Control: public, s-maxage, stale-while-revalidate` (30 s to 5 min depending on how fresh the data must be), so spikes are served from Vercel's edge cache instead of the database. Generated share images are cached as `immutable`.

**Rate-limit writes with Upstash Redis.** Serverless functions can't share memory, so limits live in Redis with sliding windows: 5 letters per hour, 20 share images and 30 city searches per minute per IP ([`src/lib/rate-limit.ts`](src/lib/rate-limit.ts)).

**Store only city-level location (LGPD).** Coordinates are rounded to 2 decimal places, about 1.1 km, before they're validated and stored ([`roundCoordinate`](src/lib/utils.ts), [`src/lib/validation.ts`](src/lib/validation.ts)). The globe still looks right, and no letter can be traced to a street address. Before this change, coordinates were stored at full GPS precision.

**Cache geocoding in memory.** City search and reverse geocoding go through an LRU cache keyed on rounded coordinates ([`src/lib/geocode-cache.ts`](src/lib/geocode-cache.ts)) to cut Google API cost during spikes. It resets on cold starts, which is an acceptable tradeoff for zero extra infrastructure.

**Performance work that was reverted.** A compressed earth texture (1.2 MB to 229 KB) broke globe loading and was rolled back (`b8fd587`), and an instanced-mesh marker rewrite made markers flash, so per-marker rendering came back (`401dbf8`). The mobile hero image cut (895 KB to 309 KB) stayed. Next step: a texture format the globe loads reliably, such as KTX2.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Rate limiting**: Upstash Redis (`@upstash/ratelimit`)
- **Validation**: Zod
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Image Generation**: Satori + Sharp
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud account (for Geocoding API)

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side Supabase key (admin routes)
- `GOOGLE_MAPS_API_KEY` - Google Maps API key with Geocoding API enabled
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` - Upstash Redis for rate limiting (optional locally)
- `ADMIN_EMAILS` - Comma-separated emails allowed into `/admin`

### Database Setup

Run the SQL schema in your Supabase project:

```sql
-- supabase/schema.sql, then the files in supabase/migrations/ in date order
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── cities/        # City search & geocoding
│   │   ├── letters/       # Letter CRUD
│   │   └── share-image/   # Image generation
│   └── page.tsx           # Main page
├── components/
│   ├── effects/           # Visual effects (papers, background)
│   ├── globe/             # 3D globe components
│   ├── hero/              # Hero section
│   ├── letter/            # Letter form & modals
│   ├── share/             # Share modal
│   └── ui/                # Reusable UI components
├── constants/             # Colors, copy text
├── hooks/                 # Custom React hooks
├── lib/
│   ├── satori/            # Image templates
│   └── supabase/          # Database clients
├── store/                 # Zustand store
└── types/                 # TypeScript types
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/letters/markers` | GET | All approved letter locations (id, lat, lng) for the globe |
| `/api/letters/[id]` | GET | One letter, loaded when a marker is clicked |
| `/api/letters?page=&limit=` | GET | Paginated feed (20 by default, 100 max) |
| `/api/letters` | POST | Create a letter (validated, rate-limited) |
| `/api/letters/count` | GET | Total approved letters |
| `/api/cities?q=` | GET | Search cities by name |
| `/api/cities?lat=&lng=` | GET | Reverse geocode coordinates |
| `/api/share-image` | POST | Generate a share image |
| `/api/tour-dates`, `/api/videos`, `/api/tweets` | GET | Band hub content |

## Social

- **Hashtag**: #CartaDeAdeus
- **Band**: [@fresnorock](https://twitter.com/fresnorock)

## License

The source code is [MIT](LICENSE). Fresno's lyrics, artwork, audio, photos, names and logos are not covered; see [NOTICE](NOTICE). This is a fan tribute to Fresno's "Carta de Adeus" album.

---

Built with love by [Lucas Bittar](https://github.com/lucasbittar) and [Claude](https://claude.ai)
