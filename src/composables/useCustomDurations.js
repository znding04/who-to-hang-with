import { ref, watch } from 'vue'
import { api } from '../utils/api.js'
import { useAuth } from './useAuth.js'

const KEY = 'wtpw_custom_durations'

/** Parse hours and days from a custom duration label string. */
function parseDurationLabel(label) {
  let hours = 0
  let days = 0
  const lo = (label || '').toLowerCase()

  if (lo.includes('half day') || lo.includes('half-day')) {
    hours = 4
  } else if (/day|d\b/.test(lo)) {
    const m = label.match(/(\d+\.?\d*)\s*(?:day|d\b)/i)
    if (m) days = parseFloat(m[1])
  } else if (/hr|hour|min/.test(lo)) {
    const m = label.match(/(\d+\.?\d*)\s*(hr|hour|min|minute)/i)
    if (m) {
      hours = parseFloat(m[1])
      if (m[2].toLowerCase().startsWith('min')) hours = hours / 60
    }
  } else {
    const m = label.match(/(\d+\.?\d*)/)
    if (m) hours = parseFloat(m[1])
  }
  return { hours, days }
}

/** Ensure a duration object has hours/days fields (migrate if needed). */
function ensureHoursDays(d) {
  if (d.hours !== undefined || d.days !== undefined) return d
  const { hours, days } = parseDurationLabel(d.label)
  return { ...d, hours, days }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const arr = Array.isArray(parsed) ? parsed : []
    return arr.map(ensureHoursDays)
  } catch {
    return []
  }
}

const customDurations = ref(load())
const _cloudSynced = ref(false)
const _cloudLoading = ref(false)

watch(customDurations, (v) => {
  localStorage.setItem(KEY, JSON.stringify(v))
}, { deep: true })

async function syncFromCloud() {
  if (_cloudLoading.value) return
  _cloudLoading.value = true
  try {
    const cloudData = await api.getCustomDurations()
    const cloudValues = new Set((cloudData.customDurations || []).map((d) => d.value))
    const localOnly = customDurations.value.filter((d) => !cloudValues.has(d.value))
    for (const d of localOnly) {
      try {
        await api.createCustomDuration(d)
      } catch (e) {
        console.error('Failed to push custom duration:', e)
      }
    }
    const merged = await api.getCustomDurations()
    customDurations.value = (merged.customDurations || []).map(ensureHoursDays)
    _cloudSynced.value = true
  } catch (err) {
    console.error('Custom durations sync failed:', err)
  } finally {
    _cloudLoading.value = false
  }
}

const { isLoggedIn: _isLoggedInRef } = useAuth()
watch(
  _isLoggedInRef,
  (loggedIn) => {
    if (loggedIn) {
      if (!_cloudSynced.value && !_cloudLoading.value) syncFromCloud()
    } else {
      _cloudSynced.value = false
    }
  },
  { immediate: true }
)

export function useCustomDurations() {
  function addCustomDuration(rawLabel) {
    const label = (rawLabel || '').trim()
    if (!label) return null
    const existing = customDurations.value.find((d) => d.label === label)
    if (existing) return existing
    const value = `c_${crypto.randomUUID().slice(0, 8)}`
    const { hours, days } = parseDurationLabel(label)
    const created = { value, label, hours, days }
    customDurations.value.push(created)

    if (_isLoggedInRef.value) {
      api.createCustomDuration(created).catch((err) => console.error('Failed to sync custom duration:', err))
    }
    return created
  }

  function removeCustomDuration(value) {
    const idx = customDurations.value.findIndex((d) => d.value === value)
    if (idx >= 0) customDurations.value.splice(idx, 1)

    if (_isLoggedInRef.value) {
      api.deleteCustomDuration(value).catch((err) => console.error('Failed to sync custom duration delete:', err))
    }
  }

  return { customDurations, addCustomDuration, removeCustomDuration }
}
