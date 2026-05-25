# Regret Simulator

Model your major life decisions before you make them. Simulate 3 diverging 5-year trajectories powered by Claude.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **LLM**: Anthropic Claude (`claude-sonnet-4-20250514`) via Vercel AI SDK streaming
- **State**: Zustand (with localStorage persistence)
- **DB**: Supabase (Postgres)
- **Rate limiting**: Upstash Redis (in-memory fallback)
- **Deployment**: Vercel

---

## Local Setup

### 1. Clone and install

```bash
git clone <repo>
cd regret-simulator
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (secret) |
| `UPSTASH_REDIS_REST_URL` | [upstash.com](https://upstash.com) (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash console (optional) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` locally |

### 3. Set up Supabase

Run `schema.sql` in your Supabase SQL editor:

```sql
-- paste contents of schema.sql
```

Or via the Supabase CLI:

```bash
supabase db push --file schema.sql
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## App Flow

```
/ (form)
  └─ POST /api/simulate  →  { id, shareToken }
       └─ navigate to /simulate/:id
            └─ POST /api/simulate/:id/stream  →  SSE stream (Vercel AI SDK)
                 └─ partial-json parser renders trajectories progressively
                      └─ on stream end: DB updated, share button enabled

/s/:shareToken  →  static ISR share page (read-only)
```

## Key Design Decisions

- **Two-phase simulation**: form POST creates the DB record immediately; the results page opens the stream. This means navigation is instant and the stream state is owned by the results page.
- **Partial JSON rendering**: [`partial-json`](https://www.npmjs.com/package/partial-json) parses incomplete JSON as it streams so trajectory cards appear one by one.
- **Loading animation**: pure CSS `@keyframes` — no React timers, no spinners.
- **Rate limiting**: Upstash Redis sliding window (5 req/hr per IP). Falls back to an in-memory `Map` if Upstash env vars are absent.
- **Supabase write failure isolation**: DB writes happen in the stream's `onFinish` callback, fire-and-forget. A write failure never blocks or breaks the user-facing stream.
- **Share pages**: `revalidate: false` + `dynamic: "force-static"` — cached at the edge once built.

## Deployment (Vercel)

1. Import the repo in Vercel
2. Set all env vars in Vercel dashboard → Project → Settings → Environment Variables
3. Deploy — the `maxDuration = 60` on the stream route requires Vercel Pro or higher for the 60s function timeout

## Type Checking

```bash
npm run type-check
```
