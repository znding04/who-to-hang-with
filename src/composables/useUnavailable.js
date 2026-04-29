import { ref, computed, watch } from 'vue'

const KEY = 'wtpw_unavailable_today'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { date: todayKey(), ids: [] }
    const parsed = JSON.parse(raw)
    if (parsed?.date !== todayKey() || !Array.isArray(parsed.ids)) {
      return { date: todayKey(), ids: [] }
    }
    return parsed
  } catch {
    return { date: todayKey(), ids: [] }
  }
}

const state = ref(load())

watch(state, (v) => {
  localStorage.setItem(KEY, JSON.stringify(v))
}, { deep: true })

export function useUnavailable() {
  // The stored list is normalized to today on module load (via load()).
  // If the user keeps the app open past midnight the list won't auto-reset
  // until they reload — acceptable since this is per-session UX.

  const count = computed(() => state.value.ids.length)

  function isUnavailable(id) {
    return state.value.ids.includes(id)
  }

  function markUnavailable(id) {
    if (state.value.ids.includes(id)) return
    state.value = { ...state.value, ids: [...state.value.ids, id] }
  }

  function resetToday() {
    state.value = { ...state.value, ids: [] }
  }

  return { isUnavailable, markUnavailable, resetToday, count }
}
