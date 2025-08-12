## FormCraft AI

AI‑assisted form builder built with Next.js. Generate forms from natural language, customize with a drag‑and‑drop builder, publish multi‑page forms, collect submissions, and manage billing.


![FormCraft AI banner](https://formcraftai.avikmukherjee.me/og-image.png)



Production URL: `https://formcraftai.avikmukherjee.me`

### Features
- **AI form generation**: Uses Google Gemini to generate a form schema from a prompt (`/api/form/ai`).
- **Drag‑and‑drop builder**: Reorder fields and pages via `@dnd-kit` with live previews.
- **Multi‑page forms**: Create and navigate multiple pages per form.
- **Conditional logic**: Show/hide fields based on other field values.
- **Validation**: Required and custom validators per field type.
- **Theming and styles**: Dark theme, font picker (Google Fonts), custom colors.
- **Submissions + export**: Store responses and export CSV in dashboard.
- **Templates**: Seed demo templates for quick starts.
- **Auth & access control**: Protected routes via Clerk and middleware.
- **Billing**: Paid plan via Polar (`/checkout`, customer portal, webhooks).

### Tech Stack
- App: Next.js 15 (App Router), React 19, TypeScript
- UI: Tailwind CSS v4, Radix UI, Lucide
- State/Data: Zustand, React Hook Form, TanStack Query
- Charts: Recharts
- DB: MongoDB with Mongoose
- Auth: Clerk
- AI: Google Generative AI (Gemini)
- Billing: Polar

---

## Quick Start

### Prerequisites
- Node.js 20+ (LTS recommended)
- MongoDB (local or hosted)
- Accounts/keys for: Clerk, Google AI Studio (Gemini), Polar

### 1) Clone and install
```bash
git clone https://github.com/Avik-creator/formcraftAI.git
cd formcraftai
bun i   # or: pnpm i | yarn | bun install
```

### 2) Environment variables
Create a `.env.local` in the project root:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/vi-forms

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Google Generative AI (Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Google Fonts (optional; falls back to curated list when absent)
GOOGLE_FONTS_API_KEY=your_fonts_api_key

# Polar (billing)
POLAR_ACCESS_TOKEN=pol_...
POLAR_WEBHOOK_SECRET=whsec_...
POLAR_SUCCESS_URL=http://localhost:3000/success
NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID=prod_...
```

Notes:
- `DB_URL` defaults to `mongodb://localhost:27017/vi-forms` if missing.
- `NEXT_PUBLIC_APP_URL` is used for client links and should be your deployed URL in production.
- `POLAR_SUCCESS_URL` should point to the app’s success page (`/success`).

### 3) Run the app
```bash
bun run dev
# or: pnpm dev | yarn dev | bun dev
```
Open `http://localhost:3000`.

Login/Signup pages are public. Authenticated users are redirected to `'/dashboard'` by middleware.

---

## Project Structure (high‑level)

```text
src/
  app/                 # App Router routes (pages, API, middleware)
    api/
      form/ai/         # AI generation endpoint
      templates/seed/  # seed demo templates (auth‑protected)
      webhook/polar/   # Polar billing webhooks
    dashboard/         # authenticated dashboard (overview, forms, templates)
    builder/           # form builder page
    form/[formid]/     # public, published form rendering
    checkout/          # Polar checkout handler route
  backend/             # server actions, models, db connection
  components/          # UI and feature components (builder, form, dashboard, ui)
  data-fetching/       # TanStack Query hooks and server/client fetchers
  hooks/               # custom hooks
  lib/                 # core form helpers (create/transform), utils
  providers/           # React Query provider
  types/               # Type definitions for forms and app
  zustand/             # app state stores
```

Key files:
- `src/backend/db/connection.ts` – Mongoose connection using `DB_URL`.
- `src/app/api/form/ai/route.ts` – Gemini‑powered AI schema generation (auth required).
- `src/app/checkout/route.ts` – Polar Checkout handler.
- `src/app/api/portal/route.ts` – Polar Customer Portal (maps Clerk user → Polar customer).
- `src/app/api/webhook/polar/route.ts` – Polar webhooks to sync plan state.
- `src/middleware.ts` – Route protection and redirects via Clerk.

---

## Development Guide

### Seeding templates
Authenticated GET to seed starter templates:
```
GET /api/templates/seed
```
This clears existing templates and recreates from `src/utils/data.ts` using `createNewForm` defaults.

### AI form generation
```
POST /api/form/ai
{
  "prompt": "Create a job application form with name, email, resume upload and availability date"
}
```
Requires a signed‑in user. The endpoint returns a form config with `createdBy` set to the current user.

### Billing
- Checkout: `GET /checkout` (server route configured with `POLAR_ACCESS_TOKEN` and `POLAR_SUCCESS_URL`).
- Customer portal: `GET /api/portal` returns a signed portal URL for the current user.
- Webhooks: `POST /api/webhook/polar` updates `UserBillingProfile` on subscription/order events. Configure the same URL in your Polar dashboard and set `POLAR_WEBHOOK_SECRET`.

### Auth and routing
- Public: `'/'`, `'/sign-in'`, `'/sign-up'`, `'/form/[formid]'`
- Protected: everything else (redirects unauthenticated users to `'/sign-in'`).
- Signed‑in users visiting `'/'` or auth pages are redirected to `'/dashboard'`.

---

## Scripts
```bash
bun run dev     # Start dev server (Turbopack)
bun run build   # Production build
bun run start   # Start production server
bun run lint    # Lint
```

---

## Deployment
- Recommended: Vercel.
- Set all environment variables in your hosting provider.
- Add Clerk callback URLs and allowed origins for your domain.
- Set `NEXT_PUBLIC_APP_URL` to your production URL.
- Configure Polar webhook to `https://<your-domain>/api/webhook/polar` and success URL to `https://<your-domain>/success`.

---

## Troubleshooting
- "Unauthorized" from API routes: ensure Clerk keys are set and you’re signed in.
- Mongo connection errors: verify `DB_URL` and network/firewall settings.
- Fonts list empty: set `GOOGLE_FONTS_API_KEY` or rely on built‑in fallback.
- Billing not updating: double‑check Polar webhook secret and that the webhook URL is reachable.

---

## Acknowledgements
- Next.js, Clerk, Polar, Google Generative AI, Radix UI, TanStack Query, Zustand, Recharts, Tailwind CSS.

