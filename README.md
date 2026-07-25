# LeadDesk Mini

A full-stack lead-capture application built for the Digital Heroes internship qualification task. Public visitors submit project inquiries through a validated form; an authenticated admin reviews, searches, and manages those leads through a protected dashboard.

**Live site:** https://leaddesk-mini-pearl.vercel.app
**Repository:** https://github.com/kritikukreja6-create/leaddesk-mini

---

## Features

- **Public lead form** — name, email, budget range, and message, with real-time client-side validation and a matching server-side validation layer
- **Admin dashboard** (`/admin`) — lists all submitted leads, newest first
- **Search** — instant client-side filtering by name or email
- **Status management** — toggle each lead between New, Contacted, and Closed
- **Authentication** — JWT-based sessions in HTTP-only cookies; no hardcoded credentials
- **Route protection** — middleware blocks unauthenticated access to the admin page and to the leads-management API routes
- **Rate limiting** — login attempts are throttled per IP to slow brute-force guessing

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Form handling | React Hook Form |
| Validation | Zod (shared schemas, client + server) |
| Auth | Hand-rolled JWT (`jose`) + bcrypt password hashing |
| Deployment | Vercel |

---

## Architecture

**Server Components by default.** Both the landing page and the admin dashboard fetch their initial data directly on the server — no client-side loading spinner for the first render. Interactivity (the lead form, the leads table's search/status controls) is isolated into small Client Components, keeping the amount of JavaScript shipped to the browser as small as possible.

**One shared Zod schema per form.** `leadSchema` and `loginSchema` each validate their form on the client (via `@hookform/resolvers/zod`) and are imported unchanged into the corresponding API route. This guarantees the client and server can never disagree about what counts as valid input.

**Two-layer defense in depth.** Zod validates *requests*; Mongoose schema constraints (`required`, `enum`) validate *documents*. A request that somehow bypassed the API layer would still be rejected at the database layer.

**Authentication is JWT-in-a-cookie, not a session store.** There is exactly one admin user, created once via a seed script — no signup flow, no password reset flow. A signed JWT (7-day expiry) is issued on login and stored as an `httpOnly`, `sameSite=lax` cookie, verified on every request to a protected route.

**Middleware protects both the page and the API.** `/admin` and the leads-management API routes (`GET`/`PATCH` on `/api/leads*`) require a valid session; `POST /api/leads` remains public, since anyone must be able to submit a lead.

---

## Folder Structure

```text
src/
├── app/
│   ├── page.tsx            # Public landing page (Server Component)
│   ├── admin/
│   │   ├── page.tsx        # Admin dashboard (Server Component)
│   │   └── loading.tsx     # Automatic loading state
│   ├── login/
│   │   └── page.tsx        # Admin login page (Client Component)
│   ├── not-found.tsx       # Custom 404
│   └── api/
│       ├── leads/
│       │   ├── route.ts    # POST (public), GET (admin) /api/leads
│       │   └── [id]/route.ts # PATCH /api/leads/:id (status update)
│       └── auth/
│           ├── login/route.ts # POST /api/auth/login
│           └── logout/route.ts # POST /api/auth/logout
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── lead-form.tsx       # Public lead form
│   └── admin/
│       ├── leads-table.tsx # Table + search + local state
│       ├── status-select.tsx # Per-lead status dropdown
│       └── logout-button.tsx
├── lib/
│   ├── db.ts               # Mongoose connection singleton
│   ├── auth.ts             # JWT sign/verify helpers
│   ├── rate-limit.ts       # In-memory login rate limiter
│   └── validations/
│       ├── lead.ts         # Shared lead Zod schema
│       └── login.ts        # Shared login Zod schema
├── models/
│   ├── Lead.ts
│   └── User.ts
├── middleware.ts           # Route protection
└── types/
    └── global.d.ts
scripts/
└── seed-admin.ts           # One-time admin user creation
```
---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string, including database name |
| `JWT_SECRET` | Random secret used to sign/verify session JWTs |
| `ADMIN_EMAIL` | Used only by the seed script, to create the admin user |
| `ADMIN_PASSWORD` | Used only by the seed script; never stored, only its bcrypt hash is |

See `.env.example` for the expected format. None of these are committed — `.env.local` is gitignored.

---

## Setup Instructions

```bash
git clone https://github.com/kritikukreja6-create/leaddesk-mini.git
cd leaddesk-mini
npm install
```

Create `.env.local` with `MONGODB_URI` and a generated `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the admin user (add `ADMIN_EMAIL` and `ADMIN_PASSWORD` to `.env.local` first, temporarily):

```bash
npx tsx scripts/seed-admin.ts
```

Then remove `ADMIN_PASSWORD` from `.env.local` — it's no longer needed once the hash is in the database.

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` for the public form, and `http://localhost:3000/admin` for the dashboard (redirects to `/login` if not authenticated).

---

## Database Schema

**Lead**
```typescript
{
  name: string,
  email: string,
  budgetRange: string,
  message: string,
  status: "New" | "Contacted" | "Closed",  // default: "New"
  createdAt: Date,
  updatedAt: Date
}
```

**User**
```typescript
{
  email: string,     // unique
  password: string,  // bcrypt hash, select: false by default
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication Flow

1. Admin visits `/login` and submits email + password.
2. `POST /api/auth/login` looks up the user, compares the password against the stored bcrypt hash.
3. On success, a JWT (`{ userId, email }`, 7-day expiry) is signed and set as an `httpOnly`, `secure` (in production), `sameSite=lax` cookie named `session`.
4. Every request to `/admin` or to `GET`/`PATCH` on `/api/leads*` passes through `middleware.ts`, which verifies the cookie's JWT before allowing the request through.
5. An invalid or missing token redirects page requests to `/login` and returns `401` for API requests.
6. Logout clears the cookie by setting `maxAge: 0` with matching flags.

Login attempts are rate-limited (5 per 15 minutes per IP) to slow brute-force attempts. Failed logins return an identical error message regardless of whether the email exists, preventing user enumeration.

---

## Deployment

Deployed on Vercel, connected to this GitHub repository's `main` branch. `MONGODB_URI` and `JWT_SECRET` are configured as Vercel environment variables (Production, Preview, and Development). MongoDB Atlas's Network Access list is set to allow connections from anywhere (`0.0.0.0/0`), appropriate for a small, single-admin project without a fixed egress IP.

---

## Screenshots

*(Add screenshots here: public form, admin dashboard, login page)*

---

## Future Improvements

- Move rate limiting to a shared store (e.g., Redis) to work correctly across multiple serverless instances
- Add a visible error toast for failed status updates, rather than a silent revert
- Support full-text/indexed search server-side once lead volume grows beyond what client-side filtering handles comfortably
- Add automated tests for the validation schemas and API routes

---

## AI Usage Disclosure

This project was built with Claude (Anthropic) acting as a technical mentor throughout development — explaining architectural decisions, writing code incrementally with rationale at each step, and helping debug issues encountered during local development and deployment. All code was reviewed, tested, and understood before being committed; no code was accepted without being able to explain what it does and why.
