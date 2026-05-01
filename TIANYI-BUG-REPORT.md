# Tianyi Scoring Bug Report

## 1. Root Cause

**Range normalization maps the lowest-scoring friend to 0, making them indistinguishable from friends with NO hangouts.**

In `src/composables/useScoring.js`, the `normalizeScores()` function (line 83) applies range normalization:

```
normalized = (log(1 + raw) - min) / (max - min) * 100
```

When a friend has the **minimum** non-zero raw score on either axis, `log(1 + raw) = min`, so:

```
normalized = (min - min) / range * 100 = 0
```

Tianyi has one 30min hangout with 3/10 quality. If Tianyi has the lowest frequency AND lowest quality among all friends with hangouts, **both axes normalize to exactly 0** -- the same as friends with zero hangouts.

**Location**: `src/composables/useScoring.js:101-102` (before fix)

## 2. Data Snapshot

- **Tianyi's friend**: Name: Tianyi (田翼/Tianyi Bao), Phone: 7472199399
- **Tianyi's hangout**: 1 hangout, duration: 30min, quality: 3/10
- **Expected raw scores**:
  - rawQ (lifetime) = ln(1 + 0.5) * 25 * (0.3 + 0.7 * decay) ~ 10.1 (recent hangout)
  - rawY = 3 * 10 = 30
- **What normalization did**:
  - logQ = ln(1 + 10.1) ~ 2.41 (minimum among non-zero friends)
  - logY = ln(1 + 30) ~ 3.43 (minimum among non-zero friends)
  - quantity = round((2.41 - 2.41) / rangeQ * 100) = **0**
  - quality = round((3.43 - 3.43) / rangeY * 100) = **0**

## 3. Code Trace

```
Hangout created (30min, 3 stars) → API receives → DB stores → API returns friendIds ✓
  → Scoring reads hangouts ✓ → computeRawQuantityScore returns ~10 ✓
  → computeRawQualityScore returns 30 ✓
  → normalizeScores() maps min-scorer to 0 ← BUG HERE
  → ScatterPlot renders Tianyi at (0, 0)
```

The raw scoring logic is correct. The data flow from hangout creation through API to D1 and back is correct. The bug is solely in the normalization step.

### Why both axes are 0

Tianyi likely has:
- The fewest/shortest hangouts (only one 30min session) → lowest frequency
- The lowest average quality rating (3/10) → lowest quality

Among all friends with at least one hangout, Tianyi sits at the minimum of both distributions. Range normalization maps `min → 0`, so both display as 0.

## 4. Fix Applied

**File**: `src/composables/useScoring.js`, line 101-102

**Before**:
```javascript
const quantity = lq > 0 ? (rangeQ > 0 ? Math.round(((lq - minQ) / rangeQ) * 100) : 50) : 0
const quality = ly > 0 ? (rangeY > 0 ? Math.round(((ly - minY) / rangeY) * 100) : 50) : 0
```

**After**:
```javascript
const quantity = lq > 0 ? (rangeQ > 0 ? Math.max(1, Math.round(((lq - minQ) / rangeQ) * 100)) : 50) : 0
const quality = ly > 0 ? (rangeY > 0 ? Math.max(1, Math.round(((ly - minY) / rangeY) * 100)) : 50) : 0
```

**What changed**: Added `Math.max(1, ...)` so that any friend with at least one hangout gets a minimum normalized score of 1 (out of 100). Score 0 is now exclusively reserved for friends with **no hangouts at all**.

### How to verify

1. Open the app at https://hangwith.ljding.app/
2. Find Tianyi on the scatter plot
3. Tianyi should now appear at approximately (1, 1) instead of (0, 0)
4. Friends with NO hangouts should still appear at (0, 0) or not appear
5. Toggle to "Absolute" mode -- Tianyi should show raw scores (~10, 30), unaffected by this change

## 5. Prevention

- **Semantic zero**: The normalization should preserve the semantic meaning of 0 = "no data". This fix ensures that distinction is maintained.
- **Affects all friends**: Any friend who happened to be the min-scorer on an axis was incorrectly shown as 0. This wasn't Tianyi-specific -- it affected whichever friend had the lowest scores.
- **Edge case**: With only 2 friends with hangouts, the lower-scoring one would always show at 0 on each axis. The fix resolves this for any number of friends.
