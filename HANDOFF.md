# Dove Glitters — Deployment Handoff

The website is **finished and working**. The only thing left is finishing the
Vercel deployment. This note explains exactly what to do.

## What this project is

A single-page Next.js 16 site for **Dove Glitters** — a nail artist, dance
academy (Wonderland Dance Academy), and influencer based in Ogbomosho, Nigeria.

- Framework: Next.js 16.2.6 (App Router)
- Database: Supabase (the `bookings` table stores booking submissions)
- Bookings notify the owner via a pre-filled WhatsApp message (no email)
- Code is on GitHub: https://github.com/eniolaoyedele957-oss/dove-glitters (branch `main`)

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:3000

> Note: the `dev` and `build` scripts are pinned to `--webpack` on purpose.
> Turbopack runs out of memory on the original dev machine. Leave them as-is.

Production build check: `npm run build`

## The one remaining deploy bug

A Vercel project named `dove-glitters` already exists and builds successfully,
but **the site 404s on every page** while static files (e.g. `/dove-hero.mp4`)
load fine.

**Cause:** the project's **Framework Preset is set to "Other"**, so Vercel
serves the raw `public/` folder and ignores the Next.js app entirely.

**Fix:**
1. Vercel → `dove-glitters` project → **Settings** → **Build and Deployment**
2. Set **Framework Preset** to **Next.js**
3. Make sure **Output Directory** is NOT overridden (Next.js handles it)
4. Save, then **Redeploy** (Deployments tab → latest → ⋯ → Redeploy)

After that the site loads normally.

## Environment variables (required on Vercel)

Add these in Vercel → Settings → Environment Variables (all environments).
They are also in the local `.env.local` file.

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://sgmshdryccbmpdyorfhx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbXNoZHJ5Y2NibXBkeW9yZmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzc3NTAsImV4cCI6MjA5NDI1Mzc1MH0.On0MVnCcvRNJEnhCuLXGYHmOf6-1LzoZRRwDUkv7rnA` |

(There is also a `RESEND_API_KEY` in `.env.local` — it is unused and can be ignored.)

## If visitors see a 401 "Authentication Required" page

That is Vercel **Deployment Protection**. Turn it off so the public can view
the site: Vercel → project → Settings → Deployment Protection → set
**Vercel Authentication** to Off.

## Known issues worth fixing later

- **Supabase security:** the `bookings` table can currently be read and deleted
  with the public anon key — customer names/phone numbers are exposed. In the
  Supabase dashboard, set Row Level Security on `bookings` to allow only
  `INSERT` for the anon role (block `SELECT`/`UPDATE`/`DELETE`).
- The `bookings` table has 3 old test rows ("Eniola Oyedele") from an earlier
  version — safe to delete from the Supabase dashboard.
- `public/nail-pedicure.jpg` and `public/nail-training.jpg` are unused — harmless.

## How bookings work

The booking form saves the submission to the Supabase `bookings` table and then
opens a pre-filled WhatsApp message to **08103452135** so the owner is notified.
The Supabase row is a backup record; WhatsApp is the primary notification.
