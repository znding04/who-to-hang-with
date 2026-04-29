<script setup>
import { computed } from 'vue'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'
import { useGapThreshold } from '../composables/useGapThreshold'

const { hangouts } = useFriends()
const { scoredFriends } = useScoring()
const { gapThreshold } = useGapThreshold()

const insights = computed(() => {
  const scored = scoredFriends.value
  const result = []

  const freqLowQuality = scored.filter(s => s.quantity > 30 && s.gap < -gapThreshold.value)
  if (freqLowQuality.length > 0) {
    result.push({
      tone: 'negative',
      text: `你和 ${freqLowQuality[0].friend.name} 见面很多但感觉一般，可能投入太多了`,
    })
  }

  const greatRare = scored.filter(s => s.gap > 10 && s.quantity < 20)
  if (greatRare.length > 0) {
    result.push({
      tone: 'positive',
      text: `${greatRare[0].friend.name} 总是让你很开心，但好久没见了${greatRare.length > 1 ? '，还有其他朋友也是' : ''}`,
    })
  }

  const now = new Date()
  const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  const thisWeek = hangouts.value.filter(h => new Date(h.date) >= weekAgo).length
  if (thisWeek >= 5) {
    result.push({
      tone: 'highlight',
      text: `你这周聚会 ${thisWeek} 次！继续保持社交活跃`,
    })
  }

  const neglected = scored.filter(s => s.quantity < 10 && s.gap > 0)
  if (neglected.length > 0) {
    result.push({
      tone: 'neutral',
      text: `${neglected[0].friend.name} 的友谊质量很高但很少联系，找时间聊聊天吧`,
    })
  }

  return result
})

const toneDot = {
  positive: 'bg-emerald-500',
  negative: 'bg-rose-400',
  highlight: 'bg-amber-500',
  neutral: 'bg-stone-400',
}
</script>

<template>
  <div v-if="insights.length > 0">
    <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">洞察</p>
    <div class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
      <div
        v-for="(insight, i) in insights"
        :key="i"
        class="flex items-start gap-3 px-4 py-3.5"
        :class="i > 0 ? 'border-t' : ''"
        :style="i > 0 ? 'border-color: #ece9e4' : ''"
      >
        <span class="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0" :class="toneDot[insight.tone]"></span>
        <p class="text-[13.5px] leading-relaxed text-stone-700">{{ insight.text }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="scoredFriends.length > 0" class="text-center text-stone-400 py-4 text-sm">
    暂时没有洞察，多记录几次聚会吧
  </div>
</template>
