# 找谁玩 — Project Progress

## Last Updated
2026-04-28 (scoring fix)

## Current Status

### ✅ Completed
- SPEC.md written and pushed
- README.md written
- GitHub repo created: znding04/who-to-play-with
- Vue 3 + Vite + Tailwind project scaffolded
- Demo seed data (4 friends, 7 hangouts)
- WeChat miniapp wrapper layer (wechat/ directory)
- WeChat build script (npm run build:wechat)
- Safe-area mobile polish
- All 5 pages built and verified: Home, Friends List, Friend Detail, Log Hangout, Stats
- ScatterPlot SVG component with color-coded gap dots
- InsightsPanel with 4 insight types
- Friends list now sorted by gap (most negative first) with gap indicators
- `npm run build` succeeds with no errors
- **2026-04-28 User Feedback v2 — All improvements implemented:**
  - ✅ 20 friends with realistic hangout histories replacing 4-friend demo
  - ✅ Z-score normalization: global mean at (50, 50) on scatter plot, stable as data grows
  - ✅ ScatterPlot: name labels next to dots + popup with friend info/tags/gap on click (no page navigation)
  - ✅ Enhanced friend model: phone, birthday, location, howWeMet, importantEvents[], values[]
  - ✅ FriendDetail page updated to show all new fields (basic info, TA的价值, 重要时刻)
  - ✅ LogHangout page shows friend tags next to names
- **2026-04-28 UX round 1 — post-deploy improvements:**
  - ✅ Fixed `+ 添加` button on Friends page (resetForm bug closed the form immediately)
  - ✅ Tunable balance threshold (`useGapThreshold` composable, default ±12, persisted to localStorage)
  - ✅ Hexagonal balanced band rendered on ScatterPlot (covers corners) + slider tuner
  - ✅ Custom hangout types when picking 其他 (`useCustomTypes` composable; persisted; rendered as picker chips)
  - ✅ Mobile-friendly Edit/Delete buttons in Friends list (proper touch targets and colors)
  - ✅ Edit/Delete buttons added to FriendDetail header (Edit deep-links to `/friends?edit=<id>`)
  - ✅ ScatterPlot popup friend name now a router-link to friend detail
  - ✅ FriendDetail's 记录聚会 button passes `?friend=<id>` to pre-select friend in LogHangout
- **2026-04-28 Scoring fix — type weight removed from quality:**
  - Bug: `quality = avg_rating × avg_type_weight × 20` penalized friends whose hangouts were mostly online (weight 0.3) regardless of how good they felt
  - Fix: `quality = avg_rating × 20`. Type weight no longer enters the quality axis
  - Effect on screenshots: 周杰 (4 online @ 3.75★) moves up on quality; gap goes from −62 toward neutral/positive; recommendation shifts away from him toward 陈思思 (positive-gap stale)

### 🚧 In Progress
- Mobile / WeChat in-app browser testing of the live deploy

### ⏳ Pending
- (deferred) Mini Program path: WeChat DevTools test with real appid, get WeChat account app ID

## Deployment

**Chosen route: A — H5 hosted publicly, shared via WeChat link / QR**

- Live URL: https://who-to-play-with.ljding94.workers.dev/
- Host: Cloudflare Pages (deployed via `ljding94` Cloudflare account; repo owned by `znding04`)
- Build: `npm run build` → `dist/` (auto-deploys on push to `main`)
- Distribution: paste link into WeChat chat, or generate a QR code

The `wechat/` Mini Program wrapper directory is **not used** for Route A. It is preserved for the deferred Mini Program path (Route B), which would require Tencent review, a 小程序 account, and a cross-compile (uni-app / Taro) or rewrite.

## Architecture
src/pages/        → Vue page components
src/composables/  → Shared logic (useSeedData, useFriends, useScoring)
src/components/   → ScatterPlot, InsightsPanel
dist/             → Production build output (deployed to Cloudflare)
wechat/           → (Unused for Route A) Mini Program wrapper, kept for future Route B
wechat/h5/        → (Unused for Route A) WebView asset target for Mini Program

## Scoring Model
- Quantity (raw): log(1 + Σ duration_mult) × 25 × (0.3 + 0.7 × exp(-days_since_last/60))
  - Duration multipliers: 30min 0.5, 1hr 1, 2hr 1.5, halfday 2, fullday 3, trip 4
- Quality (raw): average_rating × 20 (so 5 stars → 100, 1 star → 20)
  - Type weight is intentionally NOT applied here. It conflates "investment" with "how it felt" — a 4-star online call is still a 4-star experience.
- Both raw scores are z-score normalized so the population mean lands at (50, 50)
- Gap = normalized quality − normalized quantity
  - Within ±gapThreshold (user-tunable, default 12) → 平衡
  - > +threshold → 很值得 (great experience relative to time invested)
  - < −threshold → 不平衡 (lots of time, mediocre experience)

## Recommendation Logic
1. Negative gap + active in last 30 days → "reconnect meaningfully or pull back"
2. Positive gap but no contact in 14+ days → "these hangouts always feel great but you haven't seen them"
3. Lowest quantity overall → "check in, might be drifting"
