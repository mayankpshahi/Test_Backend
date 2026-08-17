# Backend Take-Home Task: Marketplace Watchlist API

**Time expectation:** 1–2 hours. This is intentionally scoped small — we're evaluating how you think and structure server-side code, not how much you can ship.

## Context

RWAHub is a marketplace for tokenized real-world assets. The frontend (React/Vite) is fully built already, including a "Favorites" feature — a heart toggle on asset cards, a favorites-only filter on the Marketplace page, and a count badge in the header. **You should not need to touch any frontend code.**

The catch: the frontend is calling a backend API that doesn't exist yet. Your job is to implement it so the two sides work together correctly when both are running.

Frontend code you can look at (but shouldn't need to change) if you want to see exactly what's expected:
- `src/services/api/watchlistApi.ts` — the API client and exact request shapes
- `src/store/watchlistStore.ts` — how responses are consumed (note it expects `GET .../watchlist` to return full asset objects, not just IDs)
- `src/components/AssetCard.tsx`, `src/pages/MarketplacePage.tsx`, `src/components/layout/Header.tsx` — where it's wired into the UI

## The Task

Implement the watchlist API described below, and verify end-to-end (both servers running) that favoriting an asset in the UI actually works — toggle persists across a page reload, the Marketplace "Favorites" filter shows the right assets, and the header badge count is correct.

### API contract (already assumed by the frontend)

- `GET /api/users/:userId/watchlist` → `200`, JSON array of full `Asset` objects the user has favorited
- `POST /api/users/:userId/watchlist/:assetId` → `200`/`201` on success
- `DELETE /api/users/:userId/watchlist/:assetId` → `200`/`204` on success

The demo user id the frontend uses is `user1` (the mock user already seeded in `src/server/routes/auth.js`).

### Implementation

1. **Route** — Add a `src/server/routes/watchlist.js` router and mount it in `src/server/server.js` (see how `assets`, `validators`, etc. are already mounted at the top of that file).
2. **Storage** — Extend the mock DB (`src/server/models/database.js`) to store watchlist entries per user, following the existing patterns for `assets`, `users`, etc.
3. **Validation & error handling** — Sensible status codes for the obvious edge cases: asset doesn't exist (404), user doesn't exist (404), already-favorited (your call whether that's a 409 or an idempotent 200 — just be consistent and be ready to explain the choice). Follow the conventions already in `src/server/routes/` and `src/server/middleware/validation.js`.
4. **Tests** — Add a few tests covering the main paths and at least one edge case. See `tests/assets.test.js` and `tests/auth.test.js` for the existing Jest + Supertest style.

### Out of scope

- No frontend changes needed or expected.
- No real database — the in-memory `MockDatabase` class is fine to build on as-is.
- No real auth — the mock user (`user1`) is sufficient; don't implement auth from scratch.
- No rate limiting or other hardening beyond what's already set up (helmet, express-rate-limit are already wired in `server.js`).

## Getting Started

```bash
npm install
npm run dev
```

This starts both the frontend (`http://localhost:5173`) and backend (`http://localhost:3001`) concurrently. 


## What We're Looking At

- **API design**: routes, status codes, and response shapes that actually match what the frontend expects
- **Code quality**: readability, consistency with existing conventions (route structure, error handling, validation middleware)
- **Data modeling**: how you represent the watchlist relationship in the mock DB
- **Integration correctness**: does the feature actually work end-to-end when you click around the UI, not just in isolation
- **Test quality**: tests that verify real behavior, not just "doesn't throw"

We are **not** grading on:
- A real database or migrations — the mock in-memory DB is deliberate
- Full auth implementation — reuse what's there
- Frontend code — you shouldn't need to write any, though reading it to understand the contract is expected

## Submission

Please share:
1. A link to your own GitHub repository containing your solution
2. A couple of sentences on any trade-offs you made or what you'd do next with more time (e.g. how this would change with a real database)

If anything about the contract is ambiguous, make a reasonable assumption, note it in your submission, and move on — we're more interested in your decision-making than in you guessing our exact intent.

## Questions

If you get stuck on something environmental (install issues, etc.) rather than the task itself, reach out — we'd rather unblock you than have that eat into your time.
