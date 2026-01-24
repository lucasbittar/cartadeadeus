# Carta de Adeus

Interactive hotsite for Fresno's album **"Carta de Adeus"** where fans can write goodbye letters that are visualized on a 3D globe.

![Fresno - Carta de Adeus](public/fresno-bg.jpg)

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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
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
- `GOOGLE_MAPS_API_KEY` - Google Maps API key with Geocoding API enabled

### Database Setup

Run the SQL schema in your Supabase project:

```sql
-- See supabase/schema.sql for the complete schema
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
| `/api/letters` | GET | Fetch all letters |
| `/api/letters` | POST | Create a new letter |
| `/api/cities?q=` | GET | Search cities by name |
| `/api/cities?lat=&lng=` | GET | Reverse geocode coordinates |
| `/api/share-image` | POST | Generate share image |

## Social

- **Hashtag**: #CartaDeAdeus
- **Band**: [@fresnorock](https://twitter.com/fresnorock)
- **Lucas Silveira**: [@lucasfresno](https://twitter.com/lucasfresno)

## License

All rights reserved. This project was created for Fresno's "Carta de Adeus" album promotion.

---

Built with love by [Lucas Bittar](https://github.com/lucasbittar) and [Claude](https://claude.ai)
