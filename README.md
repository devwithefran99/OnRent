# OnRent — Equipment Rental Marketplace

OnRent is a full-stack equipment rental platform where customers discover and
book equipment, owners list their machines, and admins manage the marketplace.

This repository is the **Next.js frontend**. The Express + MongoDB REST API
lives in the separate `OnRent-ServerSIde` repository and must be running for
listings, bookings, payments and dashboards to work.

## Features

### Public

- Premium responsive landing page with hero slider, categories, featured and
  popular equipment, why-us, how-it-works and customer reviews
- Auto-scrolling review marquee (pauses on hover, one card per row on mobile,
  respects reduced-motion settings)
- Browse, search, filter, sort and paginate equipment
- Category cards and counts loaded from the database
- Equipment details with owner information, rental terms and a booking modal
- About and How It Works pages
- Custom 404, loading and error pages
- Dark mode and a mobile-friendly navigation drawer

### Customers

- Email/password sign up and sign in (better-auth)
- Google sign-in and sign-up (Google accounts are created as customers)
- Profile editing (name, photo, phone, address)
- Favorites
- Booking modal with date range, quantity, contact and delivery details
- My Rentals table with booking date, total amount, payment status and pending
  cancellation
- Stripe checkout for approved bookings, with success, processing and
  cancellation states
- Personal dashboard: spend, monthly bookings and booking status charts

### Owners

- Owner dashboard with real listing and request counts
- Add, edit and delete equipment
- Upload-free image URL support
- My Equipment table with category, price, available quantity and status
- Approve, reject or complete rental requests
- Rental table with customer, duration, quantity, amount and payment status
- Stock quantity reserved on approval and restored on completion
- Revenue analytics and top-performing equipment

### Admins

- Admin overview with live marketplace stats
- Equipment approvals (approve / reject), full edit and delete
- All users table with search, role filters and inline role changes
- All rentals table with status filters, search and payment status
- Platform settings (support details, currency, default terms, auto-approve)
- Category management (create, rename, delete)
- Platform-wide revenue, bookings and status charts

## Tech stack

| Part | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS 4, `tw-animate-css`, next-themes |
| UI extras | lucide-react, `motion`, sonner |
| Auth | better-auth + MongoDB adapter + JWT plugin |
| Database client | MongoDB driver (also used by better-auth) |
| Payments | Stripe Checkout (hosted), driven by the Express API |
| Charts | Hand-rolled SVG components (no chart library) |
| Images | `next/image` with remote image URLs |
| API | Express + MongoDB (`OnRent-ServerSIde`) |

## Getting started

### Prerequisites

- Node.js 20+ and npm
- A MongoDB database named `OnRent` (Atlas or local) shared with the API
- The Express API from `OnRent-ServerSIde` running locally
- Google OAuth credentials if you want Google sign-in

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Fill in the values:

| Variable | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Random secret used to sign session cookies and JWTs |
| `BETTER_AUTH_URL` | Frontend URL (`http://localhost:3000` in development) |
| `MONGODB_URI` | MongoDB connection string; the app uses the `OnRent` database |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_API_URL` | Express API URL (`http://localhost:5000` in development) |

The Google authorized redirect URI must be
`http://localhost:3000/api/auth/callback/google` in development (replace the
origin with the deployed URL in production).

Stripe keys are **not** configured here — they belong to the Express API. This
frontend only calls the API's `/api/payments/*` endpoints.

### 3. Start the API

Follow the setup steps in the `OnRent-ServerSIde` README, then run:

```bash
cd ../OnRent-ServerSIde
npm run dev
```

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Use `localhost`, not `127.0.0.1` — the API CORS allowlist expects the
> configured `CLIENT_ORIGIN`.

## Architecture

### Authentication and roles

- `lib/auth.ts` configures better-auth with a MongoDB adapter pointing at the
  same `OnRent` database the Express API uses.
- Sign-ups can create `customer` or `owner` accounts. Passwords need at least
  six characters with upper- and lowercase letters, and `admin` cannot be
  created through the signup form. Admins are promoted server-side with the
  API repo's `set-role` script.
- The JWT plugin adds `id`, `name`, `email` and `role` claims. The browser
  requests a token from `GET /api/auth/token`, caches it in `sessionStorage`
  (`lib/access-token.ts`), and `apiFetch` attaches it as a Bearer token to API
  calls from the browser.
- `proxy.ts` is an optimistic cookie guard for `/dashboard/*` (Next.js 16
  renamed Middleware to Proxy). The authoritative session check happens in
  `app/dashboard/layout.tsx` with `auth.api.getSession()`.
- After a role change, sign out and sign in again so the JWT is refreshed.

### Data and analytics

- UI screens talk to the Express API through `lib/api.ts` (`apiFetch`), which
  adds the JWT in the browser and uses `cache: "no-store"`.
- `lib/data/` holds shared types and pure helpers. `lib/data/analytics.ts`
  turns booking lists into KPIs and six-month series; the charts under
  `components/dashboard/charts/` render them as plain SVG.
- `lib/data/equipment.ts` also retains sample listings and client-side filter
  helpers from the prototype; live screens read from the API instead.
- Dashboard analytics use the existing booking endpoints
  (`/api/bookings/my`, `/api/owner/bookings`, `/api/admin/bookings`). If one of
  them fails, the dashboard shows a warning instead of breaking.

### Payments

The `/payment` page handles Stripe Checkout for approved, unpaid rentals:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/payments/config` | Currency, BDT→USD conversion rate and whether payments are configured |
| `POST /api/payments/checkout` | Starts a session with `{ bookingId }`; returns a checkout `url` (or a completed `sessionId`) |
| `GET /api/payments/session/:sessionId` | Verifies the session after redirect and returns the updated booking |

Amounts are shown in BDT with the converted Stripe charge noted underneath.
When Stripe is not configured on the API, the **Pay now** button is disabled.
For Stripe test mode, use card `4242 4242 4242 4242` with any future expiry and
CVC.

### Next.js 16 note

This project uses Next.js 16 conventions, including `proxy.ts` in place of the
old `middleware.ts`. When changing framework-level code, consult the bundled
guides in `node_modules/next/dist/docs/` — APIs and file conventions in this
version differ from older Next.js releases.

## Project structure

```text
app/
  api/auth/[...all]/     better-auth request handler (session + JWT token)
  dashboard/             Protected customer, owner and admin pages
    admin/               Approvals, users, rentals, categories, settings
    equipment/           Owner listing, new/edit forms
    favorites, profile, rentals/
  equipment/             Public listing and details pages
  payment/               Stripe checkout, verification and result pages
  signin, signup/        Authentication pages
  about, how-it-works/   Content pages
components/
  auth/                  Sign-out button
  dashboard/             Role-specific tables, forms, stats and analytics
    charts/              SVG revenue, bookings and status charts
  equipment/             Cards, filters/explorer, booking form, favorites
  home/                  Landing page sections
  shared/                Navbar, footer, logo, theme toggle
  ui/                    Small shadcn-style primitives
hooks/                   Shared React hooks
lib/
  auth.ts                better-auth server configuration
  auth-client.ts         better-auth client + JWT helper
  access-token.ts        Client-side token cache
  api.ts                 Fetch wrapper for the Express API
  data/                  Shared types and pure helpers
  validation.ts          Form validation helpers
public/Image/            Brand assets
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier (TS/TSX) |

## Roles

| Role | Access |
| --- | --- |
| `customer` | Browse, favorite and book equipment; pay for rentals |
| `owner` | Everything a customer can do + manage listings and requests |
| `admin` | Marketplace moderation, users, rentals and categories |

New sign-ups are customers unless they choose the owner role. An admin can
promote an account from the API repo:

```bash
cd ../OnRent-ServerSIde
npm run set-role -- user@example.com admin
```

Sign out and sign in again after changing a role so the JWT is refreshed.

## Troubleshooting

- **API requests fail with CORS errors:** open the app at `localhost:3000` (not
  `127.0.0.1`) and confirm the API's `CLIENT_ORIGIN` matches.
- **"Online payments are not configured yet":** Stripe keys are missing on the
  Express API. Configure them there and reload `/api/payments/config`.
- **Payment stuck on "processing":** Stripe has not confirmed the session yet;
  use **Check again** on the payment page to re-verify the session.
- **Role-based UI looks stale:** sign out and sign in again to get a fresh JWT.
- **Analytics warning on the dashboard:** one of the booking endpoints is
  unavailable; the rest of the dashboard remains usable.

## Roadmap

- Production deployment (Vercel for the frontend, Render for the API)
- Payment receipts/notifications and an expanded analytics date range
