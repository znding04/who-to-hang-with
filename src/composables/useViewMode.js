import { ref, watch } from 'vue'

const KEY = 'wtpw_view_mode'
const VALID = ['normalized', 'absolute']

function load() {
  const raw = localStorage.getItem(KEY)
  return VALID.includes(raw) ? raw : 'normalized'
}

const mode = ref(load())

watch(mode, (v) => {
  localStorage.setItem(KEY, v)
})

export function useViewMode() {
  return { mode }
}
