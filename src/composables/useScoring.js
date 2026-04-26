import { computed } from 'vue'
import { useFriends } from './useFriends'

const TYPE_WEIGHTS = { trip: 2.0, activity: 1.2, meal: 1.0, hangout: 1.0, call: 0.6, online: 0.3, other: 0.5 }

function computeQuantityScore(friendId, hangouts) {
  const friendHangouts = hangouts.filter(h => h.friendIds.includes(friendId))
  if (friendHangouts.length === 0) return 0
  const total = friendHangouts.length
  const lastDate = friendHangouts.map(h => new Date(h.date)).reduce((max, d) => d > max ? d : max, new Date(0))
  const daysSince = (Date.now() - lastDate) / (1000 * 60 * 60 * 24)
  const decay = Math.exp(-daysSince / 60)
  return Math.min(100, Math.log(1 + total) * 25 * (0.3 + 0.7 * decay))
}

function computeQualityScore(friendId, hangouts) {
  const friendHangouts = hangouts.filter(h => h.friendIds.includes(friendId))
  if (friendHangouts.length === 0) return 0
  const avgQuality = friendHangouts.reduce((sum, h) => sum + h.quality, 0) / friendHangouts.length
  const avgWeight = friendHangouts.reduce((sum, h) => sum + (TYPE_WEIGHTS[h.type] || 0.5), 0) / friendHangouts.length
  return Math.min(100, avgQuality * avgWeight * 20)
}

export function computeFriendScores(friends, hangouts) {
  return friends
    .map(friend => {
      const quantity = computeQuantityScore(friend.id, hangouts)
      const quality = computeQualityScore(friend.id, hangouts)
      return { friend, quantity, quality, gap: quality - quantity }
    })
    .sort((a, b) => a.gap - b.gap)
}

export function useScoring() {
  const { friends, hangouts } = useFriends()

  const scoredFriends = computed(() => computeFriendScores(friends.value, hangouts.value))

  return { scoredFriends }
}
