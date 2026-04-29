import { ref, watch } from 'vue'
import { api } from '../utils/api.js'
import { useAuth } from './useAuth.js'

const KEY = 'wtpw_custom_hangout_types'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const customTypes = ref(load())
const _cloudSynced = ref(false)
const _cloudLoading = ref(false)

watch(customTypes, (v) => {
  localStorage.setItem(KEY, JSON.stringify(v))
}, { deep: true })

// Split a leading emoji off the input so users can type "🎲 桌游" to set
// both the icon and the label in one field.
function splitEmoji(input) {
  const trimmed = input.trim()
  const match = trimmed.match(/^(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic})*\uFE0F?)\s*(.*)$/u)
  if (match && match[2]) {
    return { icon: match[1], label: match[2].trim() }
  }
  return { icon: '📦', label: trimmed }
}

async function syncFromCloud() {
  if (_cloudLoading.value) return
  _cloudLoading.value = true
  try {
    // Push any local-only items first so we don't lose them when we replace
    // local state with the cloud snapshot below.
    const cloudData = await api.getCustomTypes()
    const cloudValues = new Set((cloudData.customTypes || []).map((t) => t.value))
    const localOnly = customTypes.value.filter((t) => !cloudValues.has(t.value))
    for (const t of localOnly) {
      try {
        await api.createCustomType(t)
      } catch (e) {
        console.error('Failed to push custom type:', e)
      }
    }
    // Re-fetch the merged set.
    const merged = await api.getCustomTypes()
    customTypes.value = merged.customTypes || []
    _cloudSynced.value = true
  } catch (err) {
    console.error('Custom types sync failed:', err)
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

export function useCustomTypes() {
  function addCustomType(rawLabel) {
    const raw = (rawLabel || '').trim()
    if (!raw) return null
    const { icon, label } = splitEmoji(raw)
    if (!label) return null
    const existing = customTypes.value.find((t) => t.label === label)
    if (existing) return existing
    const value = `c_${crypto.randomUUID().slice(0, 8)}`
    const created = { value, label, icon }
    customTypes.value.push(created)

    if (_isLoggedInRef.value) {
      api.createCustomType(created).catch((err) => console.error('Failed to sync custom type:', err))
    }
    return created
  }

  function removeCustomType(value) {
    const idx = customTypes.value.findIndex((t) => t.value === value)
    if (idx >= 0) customTypes.value.splice(idx, 1)

    if (_isLoggedInRef.value) {
      api.deleteCustomType(value).catch((err) => console.error('Failed to sync custom type delete:', err))
    }
  }

  return { customTypes, addCustomType, removeCustomType }
}
