<script setup>
import { computed } from 'vue'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'
import { useGapThreshold } from '../composables/useGapThreshold'
import ScatterPlot from '../components/ScatterPlot.vue'
import InsightsPanel from '../components/InsightsPanel.vue'

const { friends, hangouts } = useFriends()
const { scoredFriends } = useScoring()
const { gapThreshold } = useGapThreshold()

const friendCount = computed(() => friends.value.length)

const hangoutsThisWeek = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  return hangouts.value.filter(h => new Date(h.date) >= weekAgo).length
})

const recommendation = computed(() => {
  const scored = scoredFriends.value
  if (scored.length === 0) return null

  const now = Date.now()
  const dayMs = 1000 * 60 * 60 * 24

  const positiveStale = [...scored]
    .reverse()
    .filter(s => s.gap > gapThreshold.value)
    .filter(s => {
      const fh = hangouts.value.filter(h => h.friendIds.includes(s.friend.id))
      if (fh.length === 0) return true
      const last = fh.map(h => new Date(h.date)).reduce((max, d) => d > max ? d : max, new Date(0))
      return (now - last) / dayMs >= 14
    })
  if (positiveStale.length > 0) {
    const pick = positiveStale[0]
    return {
      friend: pick.friend,
      text: `你应该找 ${pick.friend.name} 玩玩 — 这段友谊总是让你很开心，但好久没见了`,
      tone: 'positive',
    }
  }

  const positiveAny = [...scored].sort((a, b) => b.gap - a.gap).filter(s => s.gap > gapThreshold.value)
  if (positiveAny.length > 0) {
    const pick = positiveAny[0]
    return {
      friend: pick.friend,
      text: `你应该找 ${pick.friend.name} 玩玩 — 这段友谊很值得珍惜`,
      tone: 'positive',
    }
  }

  const negativeActive = scored
    .filter(s => s.gap < -gapThreshold.value)
    .filter(s => {
      const fh = hangouts.value.filter(h => h.friendIds.includes(s.friend.id))
      if (fh.length === 0) return false
      const last = fh.map(h => new Date(h.date)).reduce((max, d) => d > max ? d : max, new Date(0))
      return (now - last) / dayMs <= 30
    })
  if (negativeActive.length > 0) {
    const pick = negativeActive[0]
    return {
      friend: pick.friend,
      text: `你应该找 ${pick.friend.name} 聊聊 — 你付出了很多但感觉一般，可以认真聊一次`,
      tone: 'negative',
    }
  }

  const byQuantity = [...scored].sort((a, b) => a.quantity - b.quantity)
  const pick = byQuantity[0]
  return {
    friend: pick.friend,
    text: `你应该找 ${pick.friend.name} 重新建立联系 — 你们好久没联系了`,
    tone: 'neutral',
  }
})

const toneDot = {
  positive: 'bg-emerald-500',
  negative: 'bg-rose-400',
  neutral: 'bg-amber-500',
}
</script>

<template>
  <div class="px-5 pt-9 pb-2">
    <!-- Header -->
    <div class="mb-9">
      <p class="text-[11px] uppercase tracking-[0.22em] text-stone-400">Who to play with</p>
      <h1 class="text-[22px] font-semibold text-stone-900 mt-1.5 tracking-tight">找谁玩</h1>
    </div>

    <!-- Recommendation -->
    <router-link
      v-if="recommendation"
      :to="`/friends/${recommendation.friend.id}`"
      class="block mb-9 no-underline"
    >
      <div class="flex items-center gap-2 mb-2.5">
        <span class="w-1.5 h-1.5 rounded-full" :class="toneDot[recommendation.tone]"></span>
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">今日推荐</p>
      </div>
      <p class="text-[15px] leading-[1.65] text-stone-800 font-normal">
        {{ recommendation.text }}
      </p>
    </router-link>

    <!-- Stats -->
    <div class="grid grid-cols-2 border-t border-stone-150 mb-10" style="border-color: #ece9e4">
      <div class="py-5 pr-4">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">朋友</p>
        <p class="text-3xl font-light text-stone-900 mt-1.5 tabular-nums tracking-tight">{{ friendCount }}</p>
      </div>
      <div class="py-5 pl-4 border-l" style="border-color: #ece9e4">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">本周聚会</p>
        <p class="text-3xl font-light text-stone-900 mt-1.5 tabular-nums tracking-tight">{{ hangoutsThisWeek }}</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="friends.length === 0" class="text-center text-stone-400 py-10 text-sm">
      添加朋友开始记录吧
    </div>

    <!-- Scatter -->
    <div v-else>
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">友谊散点图</p>
      <div class="rounded-lg p-3 border" style="border-color: #ece9e4; background: #fbfaf7">
        <ScatterPlot :scores="scoredFriends" />
      </div>
      <div class="flex justify-center gap-5 text-[11px] text-stone-500 mt-3">
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>很值得</span>
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>不平衡</span>
        <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-stone-400"></span>平衡</span>
      </div>

      <div class="mt-9">
        <InsightsPanel />
      </div>
    </div>
  </div>
</template>
