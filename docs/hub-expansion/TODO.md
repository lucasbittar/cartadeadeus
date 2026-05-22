# Hub Expansion — TODO

Turn the Carta de Adeus hotsite into a **band hub**: tour dates, latest YouTube
videos, a live X (Twitter) feed, and a store link. Three of the four are
dashboard-managed; the X feed is a live embed.

## Decisions (confirmed with Lucas — 2026-05-22)

- **Tweets**: Live X timeline embed from `@fresnorock`. Build it, preview it,
  keep the data source swappable in case the embed clashes with the dark theme
  (fallback path: admin-curated tweet URLs + `react-tweet`).
- **Layout**: All new sections live on the homepage as scrolling sections.
- **Store**: Both — a dedicated banner CTA section *and* a footer link.
- Store URL: https://www.instagram.com/1999fresno/

## Homepage section order (current)

1. Hero
2. **Tour Dates**
3. Globe
4. Letters Marquee
5. **Latest News** (curated tweets — see round-2 pivot in DONE.md)
6. **Latest Videos**
7. Album Release
8. **Store Banner**
9. Footer (+ store link)

---

## Phase 1 — Database & Types

- [ ] Migration `supabase/migrations/20260522_add_tour_dates_and_videos.sql`
  - [ ] `tour_dates`: `id uuid pk`, `event_date timestamptz`, `venue varchar(255)`,
        `city varchar(255)`, `address text`, `ticket_url text`,
        `status text default 'on_sale'` (on_sale | sold_out | cancelled),
        `created_at timestamptz`
  - [ ] `videos`: `id uuid pk`, `youtube_url text`, `youtube_id text`,
        `title varchar(255)`, `sort_order int default 0`, `created_at timestamptz`
  - [ ] RLS: public `SELECT` on both; no public `INSERT/UPDATE/DELETE`
        (admin writes go through the service-role client, same as letters)
  - [ ] Index `tour_dates(event_date)` and `videos(sort_order)`
- [ ] `src/types/index.ts`: add `TourDate`, `TourDateInput`, `Video`, `VideoInput`
- [ ] Document new env/config: X handle + store URL (constants, not env)

## Phase 2 — Constants & Copy

- [ ] `src/constants/copy.ts`: add `tour`, `videos`, `social`, `store` sections
      (headlines, labels, empty states, button text — all PT-BR)
- [ ] `src/constants/copy.ts` (or a config const): X handle `fresnorock`,
      store URL — single source of truth
- [ ] `src/constants/copy.ts`: add `admin.nav.tourDates` + `admin.nav.videos`

## Phase 3 — Public API routes

- [ ] `GET /api/tour-dates` — upcoming dates ordered by `event_date`,
      HTTP cache headers (s-maxage ~60s) matching existing routes
- [ ] `GET /api/videos` — videos ordered by `sort_order`, cached

## Phase 4 — Admin API routes (reuse letters auth pattern)

- [ ] `GET|POST /api/admin/tour-dates` — list + create
- [ ] `PATCH|DELETE /api/admin/tour-dates/[id]` — edit + remove
- [ ] `GET|POST /api/admin/videos` — list + create
      - On `POST`, server fetches YouTube **oEmbed** (no API key) to auto-fill
        `title` and derive `youtube_id` from the pasted URL
- [ ] `PATCH|DELETE /api/admin/videos/[id]` — edit `sort_order`/title + remove
- [ ] All admin routes verify admin session (copy the check used by
      `/api/admin/letters`)

## Phase 5 — Admin dashboard pages

- [ ] `src/app/admin/tour-dates/page.tsx` — table of dates + add/edit form
      (date picker, venue, city, address, ticket URL, status)
- [ ] `src/app/admin/videos/page.tsx` — list + "paste YouTube URL" form,
      thumbnail preview, reorder/delete
- [ ] `src/app/admin/layout.tsx` — add both to `navItems`
- [ ] `src/app/admin/page.tsx` — add count cards / quick links for the new entities

## Phase 6 — Frontend sections (frontend-design skill — extend existing styleguide)

Aesthetic: existing **editorial luxury / dark** theme — bg `#0D0D0F`,
`#F0ECE8` foreground, burgundy `#8B1538` accent, Playfair Display headings,
JetBrains Mono labels, scroll-triggered Framer Motion reveals (reuse the
album-release section's `useInView` + staggered easing `[0.22,1,0.36,1]`).

- [ ] `src/components/tour/tour-section.tsx`
  - Editorial date list: large day/month numerals, venue in Playfair,
    city + address in mono, burgundy "Comprar ingressos" button
  - `sold_out` → muted "Esgotado" state; `cancelled` → strikethrough/muted
  - Empty state when no dates; mobile = stacked rows
- [ ] `src/components/videos/videos-section.tsx`
  - Horizontal scroll-snap carousel (consistent with marquee patterns,
    no new carousel dependency), YouTube thumbnails via `img.youtube.com`
  - Click → lightbox modal with `<iframe>` player (reuse `ui/modal.tsx`)
  - Lazy-loaded; iframes only mount on play
- [ ] `src/components/social/social-section.tsx`
  - Loads `platform.twitter.com/widgets.js`, renders dark-theme timeline for
    `@fresnorock`; framed in an editorial container with section heading
  - **Swappable data source** — isolate the embed so a curated-tweets
    fallback can replace it without touching the section shell
- [ ] `src/components/store/store-banner.tsx`
  - Slim full-width CTA band — "Visite a loja oficial" → Instagram store,
    `rel="noopener noreferrer"`
- [ ] Footer: add store link beside existing social handles
- [ ] `src/app/page.tsx`: insert the four new sections at the confirmed
      positions (Tour Dates after Hero; Videos / What People / Store after
      Album Release) — no existing section moved; `dynamic()`-import the
      video + X sections to protect initial load
- [ ] Frontend data fetching: TanStack Query hooks for `/api/tour-dates`
      and `/api/videos` (mirror the letters query setup, ~30–60s)

## Phase 7 — Verification

- [ ] `npm run build` + `npm run lint` clean
- [ ] Run migration on Supabase; confirm RLS (public read, no public write)
- [ ] Admin: create/edit/delete a tour date and a video end-to-end
- [ ] Homepage: all four sections render, responsive (mobile + desktop)
- [ ] Empty states verified (no tour dates / no videos)
- [ ] X embed: preview with Lucas — decide keep vs. swap to curated
- [ ] Accessibility: focus states, `prefers-reduced-motion`, alt text
- [ ] Record outcome in `DONE.md`

## Open questions / risks

- X live embed renders in an X-controlled iframe — limited styling, may look
  off against the dark editorial theme. Mitigation: swappable data source.
- YouTube oEmbed title fetch could fail for unlisted/region-locked videos —
  admin form should allow a manual title override.
- Section order confirmed 2026-05-22 — see above.
