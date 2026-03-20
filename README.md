# FlowFill

**Studio utilization, booking, and incentive attribution** — a Next.js prototype for boutique fitness operators. The product narrative: improve off-peak fill rates with time-tiered credits and give operators transparent economics (credit liability, attributed revenue, slot mix) without generic discounting.

## Scope (academic / MVP)

- **Consumer:** schedule browsing, checkout (`/yoga/booking`), calendar with week grid + booking list (`/yoga/my-calendar`, `/yoga/my-calendar?view=list`).
- **Operator:** network / studio dashboards (`/dashboard`, `/credits`), live **incentive attribution** panel on `/yoga/schedule` keyed by `?studio=`.
- **Model:** deterministic rules in `lib/incentive-earnings-model.ts`; reservations hydrate from `localStorage` via `YogaBookingsProvider` (single-session consistency).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Data:** With no env var, the app serves a **built-in** yoga API under `app/api/v1/*` (studios, classes, users, bookings, credits) so directory, schedule (`?studio=prana` or numeric id), login, booking, and `/dashboard` work out of the box. Set `NEXT_PUBLIC_YOGA_BACKEND_URL` only if you run the separate FastAPI service instead.

**Credit metrics (research):** See [`docs/CREDIT_DATA_AND_METRICS.md`](docs/CREDIT_DATA_AND_METRICS.md) for KPIs and minimum data. The desk credits table at [`/dashboard/credits`](/dashboard/credits) is a static demo grid for layout and copy.

## Stack

Next.js (App Router), React, Tailwind CSS, shadcn-style UI primitives, TypeScript.

## UI system

Semantic utilities in `app/globals.css` (`.ff-eyebrow`, `.ff-page-title`, `.ff-panel`, …). Studio (consumer) screens compose `components/ds/studio.tsx`; operator KPIs use `components/ds/operator-stat.tsx`. Marketing copy blocks live in `components/landing/`.

**Demo content:** `lib/mock-consumer-content.ts` drives wallet transactions, settings blurbs, and other consumer stubs. Member wallet UI is `/yoga/credits`; operator ledger is `/dashboard/credits` (alias `/credits`). Retired member paths (`/yoga/store`, `/yoga/search`, etc.) redirect in `next.config.ts`.

**Studio | Operator:** One product, two shells—`components/FlowFillAppBridge.tsx` links the member app (`/yoga/*`, directory at `/menu`) with the operator console (`/dashboard`, `/credits`). The switcher appears in the marketing header, yoga layout (top bar + sidebar), operator `Nav`, mobile menu, and login.

**Prototype path:** `lib/flowfill-journey.ts` lists the happy-path beats (story → directory → studio → schedule → calendar → operator → credits). `components/FlowFillJourney.tsx` renders the homepage walkthrough grid, horizontal strips (directory + operator footer + booking), and the global `not-found` recovery links.
