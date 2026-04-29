import { useFriends, _internalState } from './useFriends'
import { useI18n } from './useI18n.js'
import { seedZh } from '../data/seedFriends.zh.js'
import { seedEn } from '../data/seedFriends.en.js'

const SEED_KEY = 'wtpw_seeded'
const SEED_VERSION = '3'

export function useSeedData() {
  const { addFriend: addFriendBase, addHangout: addHangoutBase } = useFriends()
  const { locale } = useI18n()
  const addFriend = (props) => addFriendBase({ ...props, isSeed: true })
  const addHangout = (props) => addHangoutBase({ ...props, isSeed: true })

  function seedIfEmpty() {
    if (localStorage.getItem(SEED_KEY) === SEED_VERSION) return

    // Wipe any prior seed / stale-schema data and reseed cleanly.
    _internalState.friends.value = []
    _internalState.hangouts.value = []

    const today = new Date()
    const d = (daysAgo) => {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - daysAgo)
      return dt.toISOString().slice(0, 10)
    }

    const seed = locale.value === 'en' ? seedEn : seedZh
    seed({ addFriend, addHangout, d })

    localStorage.setItem(SEED_KEY, SEED_VERSION)
  }

  return { seedIfEmpty }
}
