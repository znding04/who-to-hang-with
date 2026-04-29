import { ref, watch } from 'vue'

const FRIENDS_KEY = 'wtpw_friends'
const HANGOUTS_KEY = 'wtpw_hangouts'
const SCHEMA_VERSION_KEY = 'wtpw_schema_version'
const CURRENT_SCHEMA = 2

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// One-time migration: schema v1 used 1-5 ratings; v2 uses 1-10. Double existing values.
function migrate() {
  const stored = Number(localStorage.getItem(SCHEMA_VERSION_KEY) || 0)
  if (stored >= CURRENT_SCHEMA) return
  if (stored < 2) {
    const list = load(HANGOUTS_KEY)
    if (list.length > 0) {
      const upgraded = list.map((h) => (h.quality <= 5 ? { ...h, quality: h.quality * 2 } : h))
      localStorage.setItem(HANGOUTS_KEY, JSON.stringify(upgraded))
    }
  }
  localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA))
}

migrate()

// Singleton reactive state
const friends = ref(load(FRIENDS_KEY))
const hangouts = ref(load(HANGOUTS_KEY))

watch(friends, (val) => {
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(val))
}, { deep: true })

watch(hangouts, (val) => {
  localStorage.setItem(HANGOUTS_KEY, JSON.stringify(val))
}, { deep: true })

export function useFriends() {
  function addFriend({ name, tags = [], phone, birthday, location, howWeMet, importantEvents, values }) {
    const friend = {
      id: crypto.randomUUID(),
      name,
      tags,
      addedAt: Date.now(),
      phone: phone || '',
      birthday: birthday || '',
      location: location || '',
      howWeMet: howWeMet || '',
      importantEvents: importantEvents || [],
      values: values || [],
    }
    friends.value.push(friend)
    return friend
  }

  function updateFriend(id, updates) {
    const idx = friends.value.findIndex(f => f.id === id)
    if (idx < 0) return null
    friends.value[idx] = { ...friends.value[idx], ...updates }
    return friends.value[idx]
  }

  function deleteFriend(id) {
    friends.value = friends.value.filter((f) => f.id !== id)
  }

  function getFriendById(id) {
    return friends.value.find((f) => f.id === id)
  }

  function addHangout({ friendIds, type, duration, quality, note, date }) {
    const hangout = {
      id: crypto.randomUUID(),
      friendIds,
      type,
      duration,
      quality,
      note: note || '',
      date,
      createdAt: Date.now(),
    }
    hangouts.value.push(hangout)
    return hangout
  }

  function deleteHangout(id) {
    hangouts.value = hangouts.value.filter((h) => h.id !== id)
  }

  function getHangoutsForFriend(friendId) {
    return hangouts.value.filter((h) => h.friendIds.includes(friendId))
  }

  return {
    friends,
    hangouts,
    addFriend,
    updateFriend,
    deleteFriend,
    getFriendById,
    addHangout,
    deleteHangout,
    getHangoutsForFriend,
  }
}
