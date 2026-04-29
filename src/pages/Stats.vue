<script setup>
import { computed } from 'vue'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'
import { useGapThreshold } from '../composables/useGapThreshold'
import { useCustomTypes } from '../composables/useCustomTypes'
import ScatterPlot from '../components/ScatterPlot.vue'
import { HANGOUT_TYPES } from '../types/index.js'

const { friends, hangouts } = useFriends()
const { scoredFriends } = useScoring()
const { gapThreshold } = useGapThreshold()
const { customTypes } = useCustomTypes()

const mostRewarding = computed(() =>
  [...scoredFriends.value].sort((a, b) => b.gap - a.gap).slice(0, 5)
)

const needsAttention = computed(() =>
  [...scoredFriends.value].sort((a, b) => a.gap - b.gap).slice(0, 5)
)

const longTimeNoSee = computed(() => {
  const now = Date.now()
  const dayMs = 1000 * 60 * 60 * 24
  return scoredFriends.value
    .filter(s => {
      const fh = hangouts.value.filter(h => h.friendIds.includes(s.friend.id))
      if (fh.length === 0) return true
      const last = fh.map(h => new Date(h.date)).reduce((max, d) => d > max ? d : max, new Date(0))
      return (now - last) / dayMs >= 30
    })
    .sort((a, b) => b.gap - a.gap)
})

const totalHangouts = computed(() => hangouts.value.length)

const avgQuality = computed(() => {
  if (hangouts.value.length === 0) return 0
  return (hangouts.value.reduce((sum, h) => sum + h.quality, 0) / hangouts.value.length).toFixed(1)
})

const mostCommonType = computed(() => {
  if (hangouts.value.length === 0) return null
  const counts = {}
  hangouts.value.forEach(h => { counts[h.type] = (counts[h.type] || 0) + 1 })
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  const allTypes = [...HANGOUT_TYPES, ...customTypes.value]
  const info = allTypes.find(t => t.value === top[0])
  return info ? `${info.icon} ${info.label}` : top[0]
})

const mostFrequentFriend = computed(() => {
  if (hangouts.value.length === 0 || friends.value.length === 0) return null
  const counts = {}
  hangouts.value.forEach(h => {
    h.friendIds.forEach(id => { counts[id] = (counts[id] || 0) + 1 })
  })
  const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const friend = friends.value.find(f => f.id === topId)
  return friend ? friend.name : null
})

function gapTone(gap) {
  if (gap > gapThreshold.value) return 'text-emerald-600'
  if (gap < -gapThreshold.value) return 'text-rose-500'
  return 'text-stone-400'
}
</script>

<template>
  <div class="px-5 pt-9 pb-2">
    <!-- Header -->
    <div class="mb-9">
      <p class="text-[11px] uppercase tracking-[0.22em] text-stone-400">Stats</p>
      <h1 class="text-[22px] font-semibold text-stone-900 mt-1.5 tracking-tight">统计</h1>
    </div>

    <div v-if="friends.length === 0" class="text-center text-stone-400 py-16 text-[13.5px]">
      添加朋友和记录聚会后这里会显示统计
    </div>

    <template v-else>
      <!-- Scatter -->
      <section class="mb-9">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">友谊散点图</p>
        <div class="rounded-xl p-3" style="border: 1px solid #ece9e4; background: #fbfaf7">
          <ScatterPlot :scores="scoredFriends" />
        </div>
        <div class="flex justify-center gap-5 text-[11px] text-stone-500 mt-3">
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>很值得</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>不平衡</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-stone-400"></span>平衡</span>
        </div>
      </section>

      <!-- Rankings -->
      <section class="mb-9 space-y-7">
        <!-- Most rewarding -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">最值得</p>
          </div>
          <div v-if="mostRewarding.length === 0" class="text-[12px] text-stone-400">暂无数据</div>
          <div v-else class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
            <div
              v-for="(s, i) in mostRewarding"
              :key="s.friend.id"
              class="flex items-center justify-between px-4 py-3"
              :class="i > 0 ? 'border-t' : ''"
              :style="i > 0 ? 'border-color: #ece9e4' : ''"
            >
              <span class="text-[14px] text-stone-800">{{ s.friend.name }}</span>
              <span class="text-[13px] font-medium tabular-nums" :class="gapTone(s.gap)">{{ s.gap > 0 ? '+' : '' }}{{ Math.round(s.gap) }}</span>
            </div>
          </div>
        </div>

        <!-- Needs attention -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">需要关注</p>
          </div>
          <div v-if="needsAttention.length === 0" class="text-[12px] text-stone-400">暂无数据</div>
          <div v-else class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
            <div
              v-for="(s, i) in needsAttention"
              :key="s.friend.id"
              class="flex items-center justify-between px-4 py-3"
              :class="i > 0 ? 'border-t' : ''"
              :style="i > 0 ? 'border-color: #ece9e4' : ''"
            >
              <span class="text-[14px] text-stone-800">{{ s.friend.name }}</span>
              <span class="text-[13px] font-medium tabular-nums" :class="gapTone(s.gap)">{{ s.gap > 0 ? '+' : '' }}{{ Math.round(s.gap) }}</span>
            </div>
          </div>
        </div>

        <!-- Long time no see -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">好久不见</p>
          </div>
          <div v-if="longTimeNoSee.length === 0" class="text-[12px] text-stone-400">最近都有联系，很棒</div>
          <div v-else class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
            <div
              v-for="(s, i) in longTimeNoSee"
              :key="s.friend.id"
              class="flex items-center justify-between px-4 py-3"
              :class="i > 0 ? 'border-t' : ''"
              :style="i > 0 ? 'border-color: #ece9e4' : ''"
            >
              <span class="text-[14px] text-stone-800">{{ s.friend.name }}</span>
              <span class="text-[13px] font-medium tabular-nums" :class="gapTone(s.gap)">{{ s.gap > 0 ? '+' : '' }}{{ Math.round(s.gap) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Overview -->
      <section class="mb-2">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">总览</p>
        <div class="grid grid-cols-2 rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
          <div class="p-4">
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">总聚会次数</p>
            <p class="text-[26px] font-light text-stone-900 mt-1 tabular-nums tracking-tight">{{ totalHangouts }}</p>
          </div>
          <div class="p-4 border-l" style="border-color: #ece9e4">
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">平均感受</p>
            <p class="text-[26px] font-light text-stone-900 mt-1 tabular-nums tracking-tight">{{ avgQuality }}</p>
          </div>
          <div class="p-4 border-t" style="border-color: #ece9e4">
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">最常见类型</p>
            <p class="text-[15px] font-medium text-stone-900 mt-1.5 truncate">{{ mostCommonType || '—' }}</p>
          </div>
          <div class="p-4 border-t border-l" style="border-color: #ece9e4">
            <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium">最常见的朋友</p>
            <p class="text-[15px] font-medium text-stone-900 mt-1.5 truncate">{{ mostFrequentFriend || '—' }}</p>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
