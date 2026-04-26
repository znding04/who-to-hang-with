# 找谁玩 (Who To Play With) — Product Concept

## Core Insight

Every friendship lives on a scatter plot:

- **X-axis**: How often AND how long you hang out with a friend (quantity metric)
- **Y-axis**: How good you feel after hanging out with that friend (quality metric)

**The ideal line: Y = X** — the more you hang out with someone, the better you feel. Balance.

**The gap between a point and the Y=X line tells you something:**
- Point ABOVE the line → you're getting more joy than your effort suggests. Great friend.
- Point BELOW the line → you're putting in effort but not feeling it. One-sided relationship.
- Point FAR from the line in either direction → something worth investigating.

This app collects enough hangout data to plot that scatter plot, and uses it to make smart recommendations.

---

## The Scatter Plot

Each dot = one friend.

```
Feelings
 (Y)
  ↑
  │    • Alice (meets often, feels great)
  │  •
  │    • Bob (rare but amazing)
  │       •
  │            • Carol (meets a lot, feels meh — effort not worth it)
  │         •
  │      •
  │           • David (rare, feels bad — distant anyway)
  │        •
  └────────────────────────→ Frequency/Duration (X)
```

### How X is computed (Quantity Score)
```
quantity = log(1 + total_hangouts) × decay(days_since_last)
```
- More hangouts → higher score
- Longer ago last hangout → lower score (exponential decay, ~60 days)
- Score normalized 0–100

### How Y is computed (Quality Score)
```
quality = weighted_average(quality_rating × interaction_type_weight)
```
- Each logged hangout has a quality rating (1–5 stars)
- Different interaction types weight differently:
  - Trip (✈️): weight 2.0 — high impact
  - Activity (🏃): weight 1.2 — medium-high
  - Meal (🍜): weight 1.0 — baseline
  - Hangout (🎉): weight 1.0
  - Call (📞): weight 0.6 — lower weight
  - Online chat (💬): weight 0.3 — lowest
  - Other (📦): weight 0.5

### The Gap Metric
```
gap = quality_score - quantity_score
```
- `gap > 0`: you're enjoying this friendship more than your effort level — rewarding
- `gap < 0`: you're investing more than you're getting — unbalanced
- `gap ≈ 0`: effort and reward are aligned

---

## What the App Does

### 1. Log a Hangout
When you hang out with a friend, log it:
- Who (friend or friends if group hangout)
- When (date, defaults to today)
- How long (30 min / 1 hr / 2 hr / half-day / full-day / trip)
- What kind of interaction (meal / activity / call / trip / hangout / online / other)
- How you felt afterward (1–5 stars)
- Optional note

### 2. See Your Scatter Plot
The home screen shows the scatter plot of all friends:
- X = quantity score (how much you engage)
- Y = quality score (how good you feel)
- Each dot = one friend, color-coded
- Hover/tap to see the friend's name and scores

Color coding:
- Green dots: gap > 0 (rewarding friendship)
- Red dots: gap < 0 (unbalanced — you're putting in more than you get)
- Blue dots: gap ≈ 0 (balanced)

### 3. Get Recommendations
The app recommends who to hang out with next based on:
- Friends with NEGATIVE gap (unbalanced — you're not enjoying the effort)
  → Recommendation: "You should hang out with [X] — you've been putting in effort but not feeling it. Either reconnect meaningfully or it's OK to pull back."
- Friends with POSITIVE gap but low quantity (rewarding but rare)
  → Recommendation: "You should hang out with [X] — these hangouts always feel great but you haven't seen them in a while."
- Friends with low overall scores but not negative gap
  → Recommendation: "Check in with [X] — scores are low, might be drifting."

---

## Data Model

### Friend
```json
{
  "id": "uuid",
  "name": "Alice",
  "tags": ["college", "climbing"],
  "addedAt": 1745000000000
}
```

### Hangout Log
```json
{
  "id": "uuid",
  "friendIds": ["uuid-1", "uuid-2"],
  "type": "meal|activity|call|trip|hangout|online|other",
  "duration": "30min|1hr|2hr|halfday|fullday|trip",
  "quality": 1-5,
  "note": "Optional description",
  "date": "2026-04-25",
  "createdAt": 1745000000000
}
```

---

## Pages

1. **Home (Scatter Plot)** — `/`
   - Full scatter plot visualization (CSS/SVG, no chart library needed)
   - Recommendation card at top: "Hang out with X because..."
   - Quick stats: total friends, hangouts this week

2. **Friends List** — `/friends`
   - All friends sorted by gap (most negative at top = needs attention)
   - Each row: avatar, name, quantity bar, quality bar, gap indicator

3. **Friend Detail** — `/friends/:id`
   - Scatter plot focus on ONE friend (history of their dots over time)
   - Hangout history timeline with this friend
   - Log new hangout button

4. **Log Hangout** — `/log`
   - Friend selector (multi-select for group hangouts)
   - Type, duration, quality stars, date, note

5. **Stats** — `/stats`
   - Global scatter plot
   - Tier distribution
   - Most neglected / Most rewarding friends

---

## Tech Stack
- Vue 3 (Composition API) + Vite
- Tailwind CSS 3
- Vue Router 4 (hash mode)
- LocalStorage via composables
- No external chart library — scatter plot drawn with SVG or CSS grid
- Language: JavaScript (no TypeScript)
