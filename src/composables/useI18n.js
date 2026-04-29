import { ref } from 'vue'
import { messages } from '../i18n/index.js'

const STORAGE_KEY = 'locale'

function detectLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {}
  const browser = (typeof navigator !== 'undefined' && navigator.language) || 'en'
  return browser.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const locale = ref(detectLocale())

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
}

function interpolate(str, params) {
  if (!params) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? String(params[k]) : ''))
}

export function useI18n() {
  function t(key, params) {
    const dict = messages[locale.value] || messages.zh
    const fallback = messages.zh
    let value = get(dict, key)
    if (value == null) value = get(fallback, key)
    if (value == null) return key
    if (typeof value === 'string') return interpolate(value, params)
    return value
  }

  function setLocale(loc) {
    if (loc !== 'en' && loc !== 'zh') return
    locale.value = loc
    try {
      localStorage.setItem(STORAGE_KEY, loc)
    } catch {}
  }

  return { t, locale, setLocale }
}
