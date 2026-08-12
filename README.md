# Rafael Salazar Portfolio

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`.
3. Start with `npm run dev` and visit `http://localhost:3000`.

## Vercel

Import the repository, configure `NEXT_PUBLIC_SITE_URL` with the deployed domain, then deploy. The portfolio does not require Supabase or Stripe environment variables until the product demos are implemented.

## Product-demo security baseline

- Keep Stripe secret and webhook keys server-only.
- Enforce Supabase RLS on all user-owned tables and Storage buckets.
- Verify Stripe webhook signatures; store event IDs and ignore an event already processed.
- Do not expose employer data or production credentials in case studies.
