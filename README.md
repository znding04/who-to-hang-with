# 找谁玩 (Who To Hang With)

> 量化管理你的朋友圈

**Live app: https://tohangwith.ljding94.workers.dev/#**

A social relationship tracker (找谁玩) that helps you be intentional about friendships. Built as a WeChat Mini App compatible web app.

## What It Does

- **Track friends** and tag them by context (college, work, climbing buddies, etc.)
- **Log hangouts** — meals, trips, calls, activities — with quality ratings
- **Relationship scores** that decay over time without contact, so you can see which friendships need attention
- **Smart recommendations** on who to hang out with next, based on recency, score, and historical quality
- **Cloud sync** — sign in to access your data from any device

## Tech Stack

- Vue 3 (Composition API) + Vite
- Tailwind CSS 4
- Vue Router 4 (hash mode)
- Cloudflare Workers (backend API)
- Cloudflare D1 (SQLite database)
- Cloudflare KV (JWT secret storage)
- JWT-based session authentication
- LocalStorage for offline/guest mode

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser (or load via WeChat webview).

## Project Structure

```
src/
  pages/           # Page components (Home, Friends, Log, Calendar, Login)
  composables/     # useFriends(), useAuth(), useScoring(), useRelationshipScore()
  components/      # Shared UI components
  utils/           # API client
  router/          # Vue Router config
  App.vue          # Root layout + bottom nav
  main.js          # Entry point
schema.sql         # D1 database schema
wrangler.toml      # Cloudflare Worker configuration
src/worker.js      # Cloudflare Worker (API backend)
```

---

## Cloud Backend Setup

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Create D1 Database

```bash
wrangler d1 create who-to-hang-with-db
```

This will output a `database_id`. Add it to `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "who-to-hang-with-db"
database_id = "YOUR_ACTUAL_DATABASE_ID"
```

### 3. Run Database Migrations

```bash
wrangler d1 execute who-to-hang-with-db --file=./schema.sql --remote
```

Or for local development:

```bash
wrangler d1 execute who-to-hang-with-db --file=./schema.sql --local
```

### 4. Create KV Namespace for JWT Secrets

```bash
wrangler kv:namespace create "JWT_KV"
```

Add to `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_NAMESPACE_ID"
```

### 5. Set OAuth Secrets

For each OAuth provider, you need to create an application and set the credentials:

**Google OAuth2:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. APIs & Services → Credentials → Create OAuth Client ID
4. Application type: Web application
5. Authorized redirect URI: `https://tohangwith.ljding94.workers.dev/api/auth/callback/google`
6. Set secrets:
```bash
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

**GitHub OAuth2:**
1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `https://tohangwith.ljding94.workers.dev`
3. Callback URL: `https://tohangwith.ljding94.workers.dev/api/auth/callback/github`
3. Set secrets:
```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

**Apple Sign In:**
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Certificates, Identifiers & Profiles → Identifiers → App IDs
3. Enable "Sign in with Apple" for your App ID
4. Create a Services ID and configure the return URL
5. Create a key for Apple Sign In (JSON Web Key)
6. Set secrets:
```bash
wrangler secret put APPLE_CLIENT_ID
wrangler secret put APPLE_TEAM_ID
wrangler secret put APPLE_KEY_ID
wrangler secret put APPLE_PRIVATE_KEY
```

**JWT & App Base:**
```bash
wrangler secret put JWT_SECRET
# Generate with: openssl rand -base64 32
wrangler secret put APP_BASE_URL
# Set to: https://tohangwith.ljding94.workers.dev
```

### 6. Deploy the Worker

```bash
wrangler deploy
```

This deploys to `tohangwith.ljding94.workers.dev`.

---

## API Reference

All endpoints require a valid session cookie (`wtpw_session`) unless marked as public.

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/google` | Initiate Google OAuth |
| POST | `/api/auth/github` | Initiate GitHub OAuth |
| POST | `/api/auth/apple` | Initiate Apple Sign In |
| POST | `/api/auth/magic` | Send magic link to email |
| GET | `/api/auth/callback/google` | Google OAuth callback |
| GET | `/api/auth/callback/github` | GitHub OAuth callback |
| GET | `/api/auth/callback/apple` | Apple Sign In callback |
| POST | `/api/auth/callback/magic` | Magic link verification |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Data Endpoints (require auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/friends` | List all friends |
| POST | `/api/friends` | Create a friend |
| PUT | `/api/friends/:id` | Update a friend |
| DELETE | `/api/friends/:id` | Delete a friend |
| GET | `/api/hangouts` | List all hangouts |
| POST | `/api/hangouts` | Create a hangout |
| PUT | `/api/hangouts/:id` | Update a hangout |
| DELETE | `/api/hangouts/:id` | Delete a hangout |
| POST | `/api/data/migrate` | Migrate localStorage data |

### Response Format

```json
{
  "success": true,
  "friends": [...],
  "user": { "id": "...", "email": "...", "name": "...", "avatarUrl": "..." }
}
```

Error responses:
```json
{
  "error": "Error message",
  "success": false
}
```

---

## Data Model

### Users
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | UUID primary key |
| email | TEXT | Unique email |
| name | TEXT | Display name |
| avatar_url | TEXT | Profile picture URL |
| auth_provider | TEXT | google/github/apple/magic |
| provider_user_id | TEXT | ID from OAuth provider |
| created_at | INTEGER | Unix timestamp |

### Friends
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | UUID primary key |
| user_id | TEXT | FK to users |
| name | TEXT | Friend's name |
| tags | TEXT | JSON array of tags |
| phone | TEXT | Phone number |
| birthday | TEXT | Birthday (YYYY-MM-DD) |
| location | TEXT | Location |
| how_we_met | TEXT | How you met |
| important_events | TEXT | JSON array |
| values | TEXT | JSON array |
| created_at | INTEGER | Unix timestamp |
| updated_at | INTEGER | Unix timestamp |

### Hangouts
| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | UUID primary key |
| user_id | TEXT | FK to users |
| type | TEXT | Activity type |
| quality | INTEGER | 1-10 quality rating |
| duration | TEXT | Duration description |
| date | TEXT | Date (YYYY-MM-DD) |
| notes | TEXT | Notes |
| created_at | INTEGER | Unix timestamp |

### Hangout_Friends (junction)
| Field | Type | Description |
|-------|------|-------------|
| hangout_id | TEXT | FK to hangouts |
| friend_id | TEXT | FK to friends |

---

## How Scoring Works

Every friend lands on a **Quality × Frequency** scatter plot, both axes scaled 0–100. The diagonal is "balanced" — points above it (positive **gap**) are friends you enjoy more than you see; points below are the inverse.

```
gap = quality − frequency
gap >  threshold  →  "worth it" (hang with more)
gap < −threshold  →  "not worth it" (hang with less)
```

### Quality (Y axis)

A pure average of your hangout quality ratings (1–10), rescaled to 10–100:

```
rawQuality = (Σ quality) / count × 10
```

Activity type intentionally has no weight here — an 8/10 phone call is still 8/10. Type belongs in the *investment* side (frequency), not how the time felt.

### Frequency (X axis) — two modes, toggle by clicking the axis label

**Lifetime frequency** (default) — log-scaled cumulative investment with recency decay:

```
total   = Σ DURATION_MULT[hangout.duration]
decay   = exp(−daysSinceLastHangout / 60)
rawFreq = ln(1 + total) × 25 × (0.3 + 0.7 × decay)
```

`DURATION_MULT` is intentionally compressed (not real hours) so a full day with someone doesn't dwarf five regular meals:

| duration | multiplier |
| --- | --- |
| 30min | 0.5 |
| 1hr | 1 |
| 2hr | 1.5 |
| halfday | 2 |
| fullday | 3 |
| trip | 4 |

The `0.3 + 0.7 × decay` factor means an old friendship never falls below 30% of its peak weight — there's a floor for shared history — but recent contact dominates.

**Hours / month** — actual time spent per month since your first logged hangout:

```
totalHours      = Σ DURATION_HOURS[hangout.duration]
months          = max(0.5, daysSinceFirstHangout / 30)
hoursPerMonth   = totalHours / months
rawFreq         = ln(1 + hoursPerMonth) × 25
```

`DURATION_HOURS` uses real wall-clock hours (`30min=0.5, 1hr=1, 2hr=2, halfday=4, fullday=8, trip=24`). The half-month floor on `months` stops a brand-new friend with one big hangout from skyrocketing to the top of the axis. Recency decay is dropped here — the rate already accounts for time.

### Normalization

Raw scores are mapped to the 0–100 axis in one of two ways (toggle: View · Normalized / Absolute):

- **Normalized** (default) — z-score relative to the population, with the mean pinned at 50:
  ```
  score = clamp((raw − μ) / σ × 20 + 50, 0, 100)
  ```
  About 68% of friends land in [30, 70]. Stable as the dataset grows; useful for ranking *within your circle*.
- **Absolute** — raw scores clamped to [0, 100]. Useful if you want to compare against an objective bar instead of your own population.

### Recommendations

The "who to hang out with next" suggestion ranks friends by `gap` (highest = most under-invested in relative to enjoyment), filters out anyone marked unavailable today, and surfaces the top match.

See [SPEC.md](./SPEC.md) for the full app specification, edge-case rules, and the gap-threshold tuner.
