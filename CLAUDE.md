# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build (validates types + compiles)
pnpm lint         # Run ESLint
```

Backend (Django):
```bash
cd backend
pip install -r requirements.txt
python manage.py runserver    # http://localhost:8000
python manage.py makemigrations && python manage.py migrate
```

No test framework is configured yet.

## Architecture

Ocaso is a luxury lighting e-commerce store with a **Next.js 16** frontend and **Django 5 + DRF** backend.

**Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript strict, pnpm
**Backend**: Django 5, Django REST Framework, SimpleJWT, PostgreSQL (port 5433), Cloudinary, Mercado Pago, Brevo

### Frontend — Screaming Architecture

`src/` is organized by domain:

- **`src/features/`** — Domain modules: `about-process`, `admin`, `auth`, `cart`, `checkout`, `hero`, `newsletter`, `products`, `reviews`, `search`. Each has `components/` and optionally `store/`, `types/`.
- **`src/shared/`** — Cross-cutting: `components/ui/` (shadcn primitives), `lib/` (api client, services, utils), `hooks/`.
- **`src/app/`** — Next.js pages. Thin containers composing feature components.

### Backend — Django Apps

Six apps under `backend/apps/`: `usuarios`, `inventario`, `pedidos`, `pagos`, `ventas`, `common`. All API endpoints under `/api/v1/`. Settings at `backend/settings/settings.py`.

### Key Conventions

- **Server components by default.** Only `"use client"` for interactivity.
- **Direct imports only.** Import from specific file paths (e.g., `@/features/cart/components/cart-sheet`), never barrel files.
- **Path alias:** `@/*` → `./src/*`.
- **shadcn/ui aliases** (`components.json`): `ui` → `@/shared/components/ui`, `lib` → `@/shared/lib`, `hooks` → `@/shared/hooks`.
- Product type uses `id: number` (from Django), fields in Spanish (`nombre`, `precio`, `slug`, etc.).
- Product routes use `[slug]` not `[id]`.
- Pages fetching from Django use `export const dynamic = "force-dynamic"`.

### Data Flow

- **API client**: `src/shared/lib/api.ts` — `apiFetch()`, `apiGet()`, `apiPost()`, `apiPatch()`, `apiPut()`, `apiDelete()` with JWT token injection.
- **Types**: `src/shared/types/api.ts` — All TypeScript interfaces aligned with Django serializers. Backend returns `{ success, message, data, errors }`.
- **Server services**: `src/shared/lib/services/products.ts` — use `React.cache()` for per-request dedup.
- **Client services**: `src/shared/lib/services/auth.ts`, `orders.ts`, `admin.ts` — called from client components.
- **SWR**: Used for client-side data fetching. Provider wraps app in root layout.
- `mock-data.ts` only contains reviews (no backend endpoint for reviews yet).

### Auth

- JWT via SimpleJWT (30min access, 7d refresh, rotate + blacklist).
- Auth context at `src/shared/lib/auth-context.tsx` — provides `user`, `login()`, `register()`, `logout()`, `isAuthenticated`, `isLoading`.
- Tokens stored in localStorage: `ocaso-access-token`, `ocaso-refresh-token`.
- `User` type includes `is_staff: boolean` for admin access control.

### Admin Panel

- Route: `/admin` with 7 sub-pages (dashboard, products, categories, orders, sales, contacts, newsletter).
- Protected by `AdminGuard` component — requires `is_staff` on user.
- Uses dark theme via `.admin-dark` CSS class scope (inverted monochromatic palette).
- Own layout at `src/app/admin/layout.tsx` (sidebar nav, no main Navbar/Footer).
- Admin components in `src/features/admin/components/` — reusable data table, toolbar, form dialogs, status badges.
- Admin services in `src/shared/lib/services/admin.ts` — all CRUD operations against `/api/v1/*/admin/` endpoints.
- Sales charts use `lightweight-charts` library.

### State Management

- **Zustand** with `persist` middleware for cart. Store at `src/features/cart/store/use-cart-store.ts`, persisted to localStorage under `"ocaso-cart"`.
- **React Context** for auth (`AuthProvider`).
- Use `useMounted()` hook from `src/shared/hooks/use-mounted.ts` to guard hydration-sensitive UI.

### Design System

- **Monochromatic palette** — black, white, grays. No hues except destructive red and semantic status colors (admin badges).
- **Tailwind v4** — `@theme inline` in `globals.css`, no `tailwind.config.ts`.
- `.admin-dark` scope in `globals.css` inverts the palette for admin pages.
- Typography: Geist Sans (primary), Geist Mono (code).
- UI primitives: shadcn/ui "new-york" style with CVA variants.
- Style utility: `cn()` from `src/shared/lib/utils.ts`.

### Layout

- Root layout wraps pages with `SWRProvider` → `AuthProvider` → `Navbar` + `Footer`.
- Admin layout is separate — sidebar + content area, no store Navbar/Footer.
