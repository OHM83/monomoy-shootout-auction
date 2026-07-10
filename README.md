# Monomoy Shootout Silent Auction

A simple, mobile-first silent auction app built for the Monomoy Shootout charity fishing tournament. Guests scan a QR code at each item, view the current bid, and place a new bid from their phone. No app install, no account required.

## Features

- Public item pages with live current bid and bid history count
- Server-side bid validation (must beat the current bid by at least the item's increment; race-safe via a serializable DB transaction)
- Password-protected admin area to add/edit/delete items, and open/close bidding per item or site-wide
- Printable QR codes, one per item, linking straight to that item's bid page
- Winners report (highest bidder + contact info) for collecting payment after the event

There is no online payment processing in this version — winners are contacted and pay in person or by whatever method you normally use at checkout.

## Tech stack

Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL. Admin auth is a single shared password (set via env var) with a signed session cookie — there's no user database, since this only needs to support the handful of organizers running the event.

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Start a local Postgres database

```bash
docker compose up -d db
```

This starts Postgres on `localhost:5432` with user/password/db all set to `auction` (see `docker-compose.yml`). If you'd rather use an existing Postgres instance, skip this step.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — defaults to the Docker Compose database above.
- `ADMIN_PASSWORD` — the password organizers use to log in at `/admin`. Change this before the event.
- `SESSION_SECRET` — random string used to sign the admin session cookie. Generate one with `openssl rand -base64 32`.

### 4. Run migrations and (optionally) seed sample data

```bash
npx prisma migrate dev
npm run db:seed   # adds two example items, useful for trying the app out
```

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` for the public bidding pages and `http://localhost:3000/admin` to manage items.

## Running the auction

1. Before the event, log in to `/admin` and add each auction item (name, description, photo, starting bid, bid increment). Set status to **Open** when you're ready for guests to bid. The photo field lets you upload straight from your phone or computer (it's resized and compressed in the browser before saving — no separate image host needed), or you can paste an image URL instead.
2. Visit `/admin/qr`, print the page, and cut out one QR code per item to place next to it at the event.
3. Guests scan the QR code, see the item and current bid, and submit their own bid with name/email/phone.
4. To end the auction, either close bidding on individual items (edit item → status **Closed**) or flip the site-wide switch on `/admin`.
5. Visit `/admin/winners` for a list of the winning bidder and contact info for every item, to follow up on payment and pickup.

## Deploying

This app needs a Node.js hosting platform (for Server Actions) and a persistent Postgres database — it will **not** work on a static host.

Recommended: **Vercel** for hosting + **Neon** or **Supabase** for a free hosted Postgres database.

1. Create a Postgres database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com)) and copy its connection string.
2. Push this repo to GitHub and import it into [Vercel](https://vercel.com/new).
3. In the Vercel project settings, add environment variables:
   - `DATABASE_URL` — your hosted Postgres connection string
   - `ADMIN_PASSWORD` — your event admin password
   - `SESSION_SECRET` — a random secret (`openssl rand -base64 32`)
   - `NEXT_PUBLIC_APP_URL` — your production URL (e.g. `https://monomoy-shootout-auction.vercel.app`), used to build the QR code links
4. Deploy (or redeploy, if you already imported the project). The build command (`prisma migrate deploy && next build`) applies any pending database migrations automatically before building — you don't need to run migrations by hand, on this deploy or any future one.
5. Log in to `/admin` with your `ADMIN_PASSWORD` and add your items.

> If a deploy ever fails with a database connection error, double check `DATABASE_URL` is set correctly in the Vercel project's environment variables and that the database is reachable (e.g. Neon's free tier can auto-suspend an idle database, which wakes back up on the next connection attempt).

Any other Node.js host that supports Next.js (Railway, Render, Fly.io, etc.) works the same way — just make sure `DATABASE_URL` points at a real, persistent Postgres instance and that migrations have been applied.

## Project structure

- `src/app/` — pages and Server Actions (App Router)
  - `page.tsx`, `items/[slug]/page.tsx` — public bidding pages
  - `admin/` — password-protected admin pages
  - `actions/` — Server Actions for bids, items, settings, and auth
- `src/components/` — client components (bid form, item form, buttons)
- `src/lib/` — Prisma client, auth/session helpers, money/slug/bidding utilities
- `prisma/schema.prisma` — data model (Item, Bid, EventSettings)
