# OnRent — Equipment Rental Marketplace

OnRent is a full-stack equipment rental platform where customers can discover
and book equipment, owners can list their machines, and admins can manage the
marketplace.

This repository is the **Next.js frontend**. The Express + MongoDB API lives in
the separate `OnRent-ServerSIde` repository.

## Features

### Public
- Premium responsive landing page (hero, categories, featured equipment)
- Browse, search, filter, sort and paginate equipment
- Category cards and counts loaded from the database
- Equipment details with owner information
- About and How It Works pages
- Custom 404, loading and error pages

### Customers
- Email/password sign up and sign in (better-auth)
- Google sign-in button (UI ready, OAuth keys pending)
- Profile editing (name, photo, phone, address)
- Favorites
- Booking requests with date range, quantity and delivery details
- My Rentals dashboard with live status and pending cancellation

### Owners
- Owner dashboard with real listing and request counts
- Add, edit and delete equipment
- Upload-free image URL support
- Approve, reject or complete rental requests
- Stock quantity reserved on approval and restored on completion

### Admins
- Admin overview with live marketplace stats
- Equipment approvals (approve / reject)
- All users with listing and booking counts
- All rentals with status filters and search
- Category management (create, rename, delete)

## Tech stack

| Part | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI extras | lucide-react, framer-motion, sonner |
| Auth | better-auth + MongoDB adapter + JWT |
| Images | next/image |
| API | Express + MongoDB (`OnRent-ServerSIde`) |

## Getting started

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
| `BETTER_AUTH_SECRET` | Random secret used to sign sessions and JWTs |
| `BETTER_AUTH_URL` | Frontend URL (`http://localhost:3000` in development) |
| `MONGODB_URI` | MongoDB Atlas connection string (database name: `OnRent`) |
| `NEXT_PUBLIC_API_URL` | Express API URL (`http://localhost:5000` in development) |

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

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier |

## Project structure

```text
app/
  dashboard/          Protected customer, owner and admin pages
  equipment/          Public listing and private details pages
  signin, signup/     Authentication pages
  about, how-it-works/
components/
  dashboard/          Dashboard widgets and management screens
  equipment/          Equipment cards, filters and booking form
  home/               Landing page sections
  shared/             Navbar, footer and logo
lib/
  auth.ts             better-auth server configuration
  auth-client.ts      better-auth client + JWT helper
  api.ts              Fetch wrapper for the Express API
  data/               Shared types and helpers
public/Image/         Brand assets
```

## Roles

| Role | Access |
| --- | --- |
| `customer` | Browse, favorite and book equipment |
| `owner` | Everything a customer can do + manage listings and requests |
| `admin` | Marketplace moderation, users, rentals and categories |

New sign-ups are customers. An admin can promote an account with the server
script:

```bash
cd ../OnRent-ServerSIde
npm run set-role -- user@example.com admin
```

Sign out and sign in again after changing a role so the JWT is refreshed.

## Roadmap

- Stripe checkout and payment status
- Real Google OAuth credentials
- Production deployment (Vercel + Render)
