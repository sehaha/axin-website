# AXIN International Group — Website V5 Production

Production-oriented Next.js implementation of the AXIN one-page corporate flagship.

## Stack

- Next.js App Router
- React + TypeScript
- Native Canvas particle/depth field
- CSS scroll/reveal and cinematic motion
- Server route for contact routing
- Metadata, sitemap, robots and security headers
- Responsive and `prefers-reduced-motion` support

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Contact form

The form deliberately does **not** silently discard leads. Configure a CRM/webhook endpoint:

```bash
cp .env.example .env.local
# then set CONTACT_WEBHOOK_URL=https://...
```

`POST /api/contact` validates the submission and forwards JSON to that endpoint. Until configured it returns HTTP 503 with a visible form message.

Suggested production endpoints: HubSpot workflow/webhook, Zapier/Make, a CRM ingestion endpoint, or an owned server endpoint.

## Deploy on Vercel

1. Push this folder to GitHub (recommended), or import the project into Vercel.
2. Add `CONTACT_WEBHOOK_URL` as a production environment variable.
3. Deploy.
4. Point `www.axin.group` / `axin.group` to the Vercel project after preview approval.

## V5 scope

The flagship remains English-only and one-page by design. The project structure is ready to add `/news`, `/cn`, product pages and additional routes without rebuilding the homepage.

## Important content note

No invented revenue, employee counts, awards, customers or public-company claims are included. FF is intentionally not a primary homepage/navigation element; partner developments can be added later under News / Developments.
