/**
 * @typedef {Object} Friend
 * @property {string} id
 * @property {string} name
 * @property {string[]} tags
 * @property {number} addedAt - timestamp
 * @property {string} [phone]
 * @property {string} [birthday] - YYYY-MM-DD
 * @property {string} [location]
 * @property {string} [howWeMet]
 * @property {string[]} [importantEvents]
 * @property {string[]} [values]
 */

/**
 * @typedef {Object} Hangout
 * @property {string} id
 * @property {string[]} friendIds
 * @property {'meal'|'activity'|'call'|'trip'|'hangout'|'online'|'other'} type
 * @property {'30min'|'1hr'|'2hr'|'halfday'|'fullday'|'trip'} duration
 * @property {1|2|3|4|5|6|7|8|9|10} quality
 * @property {string} note
 * @property {string} date - YYYY-MM-DD
 * @property {number} createdAt - timestamp
 */

export const HANGOUT_TYPES = [
  { value: 'meal', icon: '🍜', labelKey: 'types.meal' },
  { value: 'activity', icon: '🏃', labelKey: 'types.activity' },
  { value: 'call', icon: '📞', labelKey: 'types.call' },
  { value: 'trip', icon: '✈️', labelKey: 'types.trip' },
  { value: 'hangout', icon: '🎉', labelKey: 'types.hangout' },
  { value: 'online', icon: '💬', labelKey: 'types.online' },
  { value: 'other', icon: '📦', labelKey: 'types.other' },
]

export const DURATION_OPTIONS = [
  { value: '30min', labelKey: 'durations.30min' },
  { value: '1hr', labelKey: 'durations.1hr' },
  { value: '2hr', labelKey: 'durations.2hr' },
  { value: 'halfday', labelKey: 'durations.halfday' },
  { value: 'fullday', labelKey: 'durations.fullday' },
  { value: 'trip', labelKey: 'durations.trip' },
]

// Resolve display label: built-ins use labelKey via i18n, custom items use label directly.
// Returns a fallback for deleted/unknown types instead of raw c_XXXXXXXX values.
export function displayLabel(item, t) {
  if (!item) return t('types.unknown') || 'Unknown'
  if (item.labelKey) return t(item.labelKey)
  if (item.label) return item.label
  // item is a raw string value (e.g. orphaned 'c_d45ce483')
  if (typeof item === 'string') {
    if (/^c_[0-9a-f]+$/i.test(item)) return t('types.unknown') || 'Unknown'
    return item
  }
  return t('types.unknown') || 'Unknown'
}

// Backwards-compat reader: hangouts stored before multi-type support only have `type`.
// When validTypes is provided, filters out types not in the set.
export function getHangoutTypes(h, validTypes) {
  let types = []
  if (Array.isArray(h?.types) && h.types.length > 0) {
    types = h.types
  } else if (h?.type) {
    types = [h.type]
  }
  if (validTypes) {
    return types.filter(tp => validTypes.has(tp))
  }
  return types
}
