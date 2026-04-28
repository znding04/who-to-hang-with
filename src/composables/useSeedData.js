import { useFriends } from './useFriends'

const SEED_KEY = 'wtpw_seeded'

export function useSeedData() {
  const { friends, addFriend, addHangout } = useFriends()

  function seedIfEmpty() {
    if (localStorage.getItem(SEED_KEY) || friends.value.length > 0) return

    const alice = addFriend({ name: '小明', tags: ['大学', '球友'] })
    const bob = addFriend({ name: '小红', tags: ['同事'] })
    const charlie = addFriend({ name: '老王', tags: ['发小', '邻居'] })
    const diana = addFriend({ name: '小李', tags: ['同事', '饭搭子'] })

    const today = new Date()
    const d = (daysAgo) => {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - daysAgo)
      return dt.toISOString().slice(0, 10)
    }

    addHangout({ friendIds: [alice.id], type: 'activity', duration: '2hr', quality: 5, note: '打篮球', date: d(3) })
    addHangout({ friendIds: [alice.id, charlie.id], type: 'meal', duration: '1hr', quality: 4, note: '火锅', date: d(10) })
    addHangout({ friendIds: [bob.id], type: 'call', duration: '30min', quality: 3, note: '聊项目', date: d(5) })
    addHangout({ friendIds: [bob.id, diana.id], type: 'meal', duration: '1hr', quality: 4, note: '工作午餐', date: d(14) })
    addHangout({ friendIds: [charlie.id], type: 'hangout', duration: '2hr', quality: 5, note: '叙旧', date: d(20) })
    addHangout({ friendIds: [diana.id], type: 'online', duration: '30min', quality: 3, note: '打游戏', date: d(2) })
    addHangout({ friendIds: [alice.id, bob.id, charlie.id, diana.id], type: 'trip', duration: 'trip', quality: 5, note: '周末郊游', date: d(30) })

    localStorage.setItem(SEED_KEY, '1')
  }

  return { seedIfEmpty }
}
