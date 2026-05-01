# Time Calculation & Quantitative Model Report

## 1. Executive Summary

The app uses a **dual-axis scoring model** (Quantity vs Quality) to rank friends on a scatter plot. Time/duration is a key input to the **Quantity axis**. Built-in durations (`30min`, `1hr`, `2hr`, `halfday`, `fullday`, `trip`) are mapped to compressed multipliers via lookup tables. **Custom durations** (like "1.5 hr") are stored as free-text labels with opaque IDs (`c_xxxxxxxx`) — they have **no numeric value** and fall back to a default multiplier of `1` in all scoring formulas. This means a custom "1.5 hr" duration is treated identically to "1hr" in the quantitative model. This is a significant gap: custom durations are cosmetic labels, not quantitative inputs.

---

## 2. Custom Time Input Flow

### Where the user inputs duration
**File:** `src/pages/LogHangout.vue` (lines 285–326)

The duration picker renders pill-shaped buttons for each option:
```html
<button v-for="d in visibleDurations" :key="d.value"
  @click="duration = d.value" ...>
  {{ d.label }}
</button>
```

A "+ Add New" button reveals a free-text input field:
```html
<input v-model="newDurationLabel" placeholder="e.g. 1.5 hr"
  @keyup.enter="handleAddDuration" />
```

### How it's captured
- **Variable:** `duration` (Vue `ref`, type `string`)
- **Default value:** `'1hr'` (line 22)
- **Custom durations** are merged with built-ins via computed property (lines 33–36):
  ```javascript
  const visibleDurations = computed(() => [
    ...DURATION_OPTIONS.map(d => ({ ...d, label: displayLabel(d, t) })),
    ...customDurations.value,
  ])
  ```

### How custom durations are created
**File:** `src/composables/useCustomDurations.js` (lines 63–76)

```javascript
function addCustomDuration(rawLabel) {
  const label = (rawLabel || '').trim()
  if (!label) return null
  const existing = customDurations.value.find(d => d.label === label)
  if (existing) return existing
  const value = `c_${crypto.randomUUID().slice(0, 8)}`   // e.g. "c_d45ce483"
  const created = { value, label }                        // { value: "c_d45ce483", label: "1.5 hr" }
  customDurations.value.push(created)
  // ... sync to cloud
  return created
}
```

### Validation
- **Only validation:** label must be non-empty after `.trim()` (line 64)
- **No numeric parsing** — the label "1.5 hr" is stored as-is with no conversion to a number
- **No min/max, no decimal handling, no unit detection**

---

## 3. Time Factor Calculation

### The Scoring Lookup Tables
**File:** `src/composables/useScoring.js` (lines 7–10)

```javascript
// Compressed multipliers for lifetime scoring (NOT real hours)
const DURATION_MULT = {
  '30min': 0.5, '1hr': 1, '2hr': 1.5,
  'halfday': 2, 'fullday': 3, 'trip': 4
}

// Real hours for per-month rate scoring
const DURATION_HOURS = {
  '30min': 0.5, '1hr': 1, '2hr': 2,
  'halfday': 4, 'fullday': 8, 'trip': 24
}
```

### How duration becomes a "time factor"

#### Lifetime Mode (default)
**Function:** `computeRawLifetimeScore()` — `src/composables/useScoring.js:15–23`

```javascript
function computeRawLifetimeScore(friendId, hangouts) {
  const friendHangouts = hangouts.filter(h => h.friendIds.includes(friendId))
  if (friendHangouts.length === 0) return 0
  const total = friendHangouts.reduce(
    (sum, h) => sum + (DURATION_MULT[h.duration] || 1), 0   // ← fallback = 1
  )
  const lastDate = friendHangouts.map(h => new Date(h.date))
    .reduce((max, d) => d > max ? d : max, new Date(0))
  const daysSince = (Date.now() - lastDate) / MS_PER_DAY
  const decay = Math.exp(-daysSince / 60)
  return Math.log(1 + total) * 25 * (0.3 + 0.7 * decay)
}
```

**Formula breakdown:**

```
rawScore = ln(1 + Σ durationMultiplier_i) × 25 × (0.3 + 0.7 × e^(-daysSince / 60))
           ├─────── quantity component ──────┤   ├────── recency decay ───────────────┤
```

- **Quantity component:** Logarithmic compression of summed multipliers × 25 scaling
- **Recency decay:** Exponential decay with 60-day time constant, floored at 0.3 (never fully forgets)

#### Per-Month Mode
**Function:** `computeRawPerMonthScore()` — `src/composables/useScoring.js:25–35`

```javascript
function computeRawPerMonthScore(friendId, hangouts) {
  const friendHangouts = hangouts.filter(h => h.friendIds.includes(friendId))
  if (friendHangouts.length === 0) return 0
  const totalHours = friendHangouts.reduce(
    (sum, h) => sum + (DURATION_HOURS[h.duration] || 1), 0   // ← fallback = 1
  )
  const firstDate = friendHangouts.map(h => new Date(h.date))
    .reduce((min, d) => d < min ? d : min, new Date())
  const daysSinceFirst = Math.max(0, (Date.now() - firstDate) / MS_PER_DAY)
  const months = Math.max(0.5, daysSinceFirst / 30)
  const hoursPerMonth = totalHours / months
  return Math.log(1 + hoursPerMonth) * 25
}
```

**Formula:**

```
rawScore = ln(1 + totalHours / max(0.5, monthsSinceFirst)) × 25
```

### Output range
- Raw scores are theoretically 0–~100 (log compression keeps them bounded)
- After Z-score normalization: centered at 50, with ~68% of friends between 30–70
- Clamped to [0, 100]

---

## 4. Quantitative Model Overview

The app plots friends on a **scatter plot** with two axes:

| Axis | Metric | What it measures |
|------|--------|-----------------|
| **X (Quantity)** | `computeRawQuantityScore()` | How much time you invest (frequency × duration × recency) |
| **Y (Quality)** | `computeRawQualityScore()` | Average enjoyment rating (1–10 scaled to 10–100) |

### Quality scoring
**File:** `src/composables/useScoring.js:43–51`

```javascript
function computeRawQualityScore(friendId, hangouts) {
  const friendHangouts = hangouts.filter(h => h.friendIds.includes(friendId))
  if (friendHangouts.length === 0) return 0
  const avgQuality = friendHangouts.reduce((sum, h) => sum + h.quality, 0)
    / friendHangouts.length
  return avgQuality * 10   // 1-10 rating → 10-100 score
}
```

### Normalization
**File:** `src/composables/useScoring.js:65–85`

Z-score normalization places the mean at 50:
```
normalizedScore = ((rawScore - mean) / stdDev) × 20 + 50
```
Clamped to [0, 100]. Only non-zero scores contribute to mean/stdDev.

### The "Gap" — the recommendation signal
```
gap = quality - quantity
```
- **Positive gap** → high quality but low frequency: "you should hang out with this person more"
- **Negative gap** → high frequency but low quality: "you're over-investing in this person"
- Friends are sorted by gap ascending (line 105)

### Gap threshold
**File:** `src/composables/useGapThreshold.js` — default = 12, range [2, 100]

---

## 5. Code Trace: 1.5 Hours Example

### Scenario: User types "1.5 hr" as a custom duration

```
Step 1 — UI Input
  User clicks "+ Add New" in duration picker
  Types "1.5 hr" into text input
  Presses Enter or clicks "Add"
  → LogHangout.vue:104-111 calls handleAddDuration()

Step 2 — Custom Duration Created
  → useCustomDurations.js:63-76
  label = "1.5 hr"
  value = "c_a3f7e921"  (random UUID prefix)
  Stored as: { value: "c_a3f7e921", label: "1.5 hr" }
  No numeric parsing occurs — "1.5 hr" is just a display label

Step 3 — Duration Selected
  → duration.value = "c_a3f7e921"

Step 4 — Hangout Submitted
  → LogHangout.vue:148 sends { duration: "c_a3f7e921", ... } to addHangout()
  → useFriends.js:200-221 stores hangout in local state
  → api.createHangout() sends POST /api/hangouts with body:
    { "duration": "c_a3f7e921", "friendIds": [...], ... }

Step 5 — Backend Storage
  → worker.js:844-870 receives the request
  → INSERT INTO hangouts (..., duration, ...) VALUES (..., 'c_a3f7e921', ...)
  → Database column type: TEXT (schema.sql line 38)
  → Stored value: "c_a3f7e921" (the opaque ID, not "1.5 hr")

Step 6 — Scoring (THE CRITICAL PART)
  → useScoring.js:18
    DURATION_MULT["c_a3f7e921"]  →  undefined  →  fallback = 1
  → useScoring.js:28
    DURATION_HOURS["c_a3f7e921"]  →  undefined  →  fallback = 1

  In lifetime mode:
    total += 1  (same as a "1hr" hangout)

  In per-month mode:
    totalHours += 1  (treated as 1 hour)

Step 7 — Result
  ⚠️ Custom "1.5 hr" is scored IDENTICALLY to built-in "1hr"
  The "1.5" has no quantitative meaning in the model — it's a UI label only
```

---

## 6. Potential Issues / Bugs

### Critical: Custom durations have no quantitative value
Custom durations (`c_xxxxxxxx`) are not in the `DURATION_MULT` or `DURATION_HOURS` lookup tables. The fallback `|| 1` on lines 18 and 28 of `useScoring.js` means **all custom durations are scored as 1.0**, regardless of what the user intended.

| User inputs | User expects | Actual multiplier | Actual hours |
|------------|-------------|-------------------|-------------|
| "1.5 hr" | 1.5 | **1** (fallback) | **1** (fallback) |
| "3 hr" | 3.0 | **1** (fallback) | **1** (fallback) |
| "15 min" | 0.25 | **1** (fallback) | **1** (fallback) |
| "5 hr" | 5.0 | **1** (fallback) | **1** (fallback) |

### Other issues

1. **No numeric input for custom durations** — Users type a free-text label (e.g., "1.5 hr", "coffee break", "quick chat"). There's no structured numeric input for hours/minutes.

2. **No validation on custom duration labels** — Any non-empty string is accepted. "asdf" is a valid duration.

3. **No way to assign quantitative weight to custom durations** — The system has no mechanism for users to specify "this custom duration = X hours."

4. **Fallback value is arguably wrong** — A fallback of `1` (equivalent to "1hr") may overcount short custom durations ("15 min") and undercount long ones ("3 hr").

5. **Type definition is stale** — `src/types/index.js:20` defines duration as `'30min'|'1hr'|'2hr'|'halfday'|'fullday'|'trip'` — doesn't mention custom durations are possible.

---

## 7. Recommendations

### Short-term fix: Parse custom duration labels
When a custom duration `c_xxxxxxxx` is encountered in scoring, look up its label and attempt to parse a numeric hour value:
```javascript
function getDurationValue(duration, customDurations, lookupTable) {
  if (lookupTable[duration] !== undefined) return lookupTable[duration]
  const custom = customDurations.find(d => d.value === duration)
  if (custom) {
    const match = custom.label.match(/(\d+\.?\d*)\s*(hr|hour|min|minute)/i)
    if (match) {
      const num = parseFloat(match[1])
      return match[2].startsWith('min') ? num / 60 : num
    }
  }
  return 1 // fallback
}
```

### Medium-term: Add numeric field to custom durations
Extend the custom duration data model to include `hours`:
```javascript
{ value: "c_a3f7e921", label: "1.5 hr", hours: 1.5 }
```
Then use `hours` directly in `DURATION_HOURS` lookups and derive the compressed multiplier with a formula (e.g., `Math.log2(1 + hours)`).

### Long-term: Replace buckets with continuous input
Instead of preset duration buckets, let users input exact hours/minutes. Store as a numeric `duration_minutes` column. This eliminates the bucket/multiplier indirection entirely.
