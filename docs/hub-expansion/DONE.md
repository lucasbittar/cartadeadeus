# Hub Expansion — DONE

## Completed (branch: feature/band-hub-sections)

### Phase 1 — Database & types
- `supabase/migrations/20260522_add_tour_dates_and_videos.sql` — `tour_dates`
  + `videos` tables, public-read RLS, indexes. **Not yet applied** (see below).
- `src/types/index.ts` — `TourDate`, `TourDateInput`, `TourDateStatus`,
  `Video`, `VideoInput`.

### Phase 2 — Constants & copy
- `src/constants/config.ts` — NEW. `xHandle` (`fresnorock`) + `storeUrl`.
- `src/constants/copy.ts` — `tour`, `videos`, `community`, `store` sections;
  `admin.nav.tourDates/videos`; `admin.tourDates` + `admin.videos` copy.
- `src/lib/youtube.ts` — NEW. ID extraction, thumbnail/embed URLs, oEmbed title.

### Phase 3 — Public API
- `GET /api/tour-dates` — upcoming shows, cached.
- `GET /api/videos` — videos in display order, cached.

### Phase 4 — Admin API
- `src/lib/admin-auth.ts` — NEW shared `verifyAdmin()` helper.
- `GET|POST /api/admin/tour-dates`, `PATCH|DELETE /api/admin/tour-dates/[id]`.
- `GET|POST /api/admin/videos`, `PATCH|DELETE /api/admin/videos/[id]`.
- Video POST auto-derives `youtube_id` + fetches title via key-less oEmbed.
- `src/lib/validation.ts` — `tourDateInputSchema`, `videoInputSchema`,
  `videoUpdateSchema`.

### Phase 5 — Admin pages
- `src/app/admin/tour-dates/page.tsx` — list + create/edit/delete form.
- `src/app/admin/videos/page.tsx` — paste-URL add, thumbnail list,
  inline title edit, reorder, delete.
- `src/app/admin/layout.tsx` — nav extended; `src/app/admin/page.tsx` — shortcuts.

### Phase 6 — Frontend sections
- `src/components/tour/` — editorial date list.
- `src/components/videos/` — scroll-snap carousel + lightbox player.
- `src/components/social/` — live X timeline embed (`XTimeline` is the isolated,
  swappable data source).
- `src/components/store/` — store CTA banner.
- `src/app/page.tsx` — sections wired (Tour after Hero; Videos/Social/Store
  after Album Release); footer store link added.
- `src/middleware.ts` — CSP extended for YouTube + X embeds.
- `next.config.js` — `img.youtube.com` / `i.ytimg.com` image hosts.

## Review

- `npm run lint` — clean.
- `npm run build` — clean; all 8 new routes compiled; homepage 168 kB First Load JS.
- Dev smoke test — homepage returns 200; StoreBanner present in SSR HTML;
  dynamic sections (Tour/Videos/Social) hydrate client-side as designed.
- `/api/tour-dates` + `/api/videos` return a graceful 500 **only because the
  tables do not exist yet** — routes themselves are correct.
- Empty-state behaviour: Tour and Videos sections render `null` when they have
  no data, so the homepage stays clean until content is added.

## Outstanding — needs Lucas / a browser

1. **Apply the migration** — run `supabase/migrations/20260522_add_tour_dates_and_videos.sql`
   in the Supabase SQL editor (same way prior migrations were applied).
   Until then the two public endpoints 500 and the sections stay hidden.
2. **Admin CRUD end-to-end** — after the migration, log into `/admin`, add a
   tour date + a video, confirm they appear on the homepage.
3. **X embed visual check** — confirm the live `@fresnorock` timeline looks
   right against the dark theme. If it clashes, swap `XTimeline` in
   `src/components/social/social-section.tsx` for curated tweets (`react-tweet`)
   — the section shell stays untouched.

## Lessons / corrections

- Tour dates: dropped the `address` field mid-build at Lucas's request — a
  show needs only date, city, venue, ticket link. Keep entity fields minimal;
  confirm the shape before generating forms/schemas.
- Show times: HTML source had only dates, so events are stored at midnight
  and the section + admin label both hide `00:00`. Edit in dashboard to set
  real times.
- Free entry: added a `'free'` status (separate migration) with a neutral
  burgundy-dot pill — distinct from the "Comprar ingressos" CTA.
- Admin bypass: dev-only escape hatch (`ADMIN_BYPASS_AUTH` + `NODE_ENV`
  double-gate) — safe to set on `.env.local`, impossible to activate on
  Vercel. Refactored all 5 letters admin routes to use the shared
  `verifyAdmin` helper as part of the same change.

## Hub expansion — round 2 (X embed pivot)

X's embedded profile timelines now show empty to logged-out viewers
(April 2025 change), so the live `@fresnorock` widget was useless for fans.
The section was architected with a swappable data source — Plan B activated.

- **Out**: `widgets.js` profile timeline embed.
- **In**: dashboard-curated tweets via Vercel's `react-tweet`, server-rendered
  from the public syndication endpoint. Works for every visitor, no API key.
- New `tweets` table + `/admin/tweets` page (paste tweet URL, the server
  parses the ID, verifies the tweet exists, stores it).
- Section relabelled **"Últimas notícias"** with subtitle *"Direto da banda"*
  — fits curated press posts better than "what people are saying."
- Masonry-style CSS columns grid; react-tweet theme variables overridden to
  our dark editorial palette (blue/red/green interaction colours → burgundy).
- CSP cleaned up: dropped all `*.twitter.com` allowances now that nothing
  loads from the browser.
- **Hardening**: server-side `sanitizeTweet` defends against react-tweet's
  known crash on tweets with missing/null entity arrays (`addEntities`
  iterates without a guard); per-tweet `TweetErrorBoundary` is the safety net
  that drops one bad tweet to a fallback card instead of crashing the page.
- **Cache fix**: `/api/tweets` now sends `max-age=0, s-maxage=300, swr=600`
  — browsers were holding the pre-sanitize payload between dev iterations.
- Admin tweets list enriched with text + author + avatar (via `getTweet`)
  so the rows are scannable instead of being just IDs.

## Lessons / corrections — round 2

- "What people are saying" / curated tweets framing was wrong: Lucas
  reframed mid-pivot to "Últimas notícias" since these will mostly be press
  pieces — the new label fits the curated reality much better.
- Always send `max-age=0` on dynamic endpoints whose payload shape may
  change between deploys, or browsers will serve pre-fix bodies through any
  refresh that isn't a hard reload.
- Third-party render libraries need an error boundary by default — even
  with server-side sanitization, never trust an external package not to
  throw on edge cases.
