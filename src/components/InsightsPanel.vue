<script setup>
import { computed } from 'vue'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'
import { useGapThreshold } from '../composables/useGapThreshold'
import { useI18n } from '../composables/useI18n.js'

const { hangouts } = useFriends()
const { scoredFriends } = useScoring()
const { gapThreshold } = useGapThreshold()
const { t } = useI18n()

const insights = computed(() => {
  const scored = scoredFriends.value
  const result = []

  const freqLowQuality = scored.filter(s => s.quantity > 30 && s.gap < -gapThreshold.value)
  if (freqLowQuality.length > 0) {
    result.push({
      tone: 'negative',
      text: t('insights.overInvested', { name: freqLowQuality[0].friend.name }),
    })
  }

  const greatRare = scored.filter(s => s.gap > 10 && s.quantity < 20)
  if (greatRare.length > 0) {
    const suffix = greatRare.length > 1 ? t('insights.greatRareMore') : ''
    result.push({
      tone: 'positive',
      text: t('insights.greatRare', { name: greatRare[0].friend.name }) + suffix,
    })
  }

  const now = new Date()
  const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  const thisWeek = hangouts.value.filter(h => new Date(h.date) >= weekAgo).length
  if (thisWeek >= 5) {
    result.push({
      tone: 'highlight',
      text: t('insights.activeWeek', { count: thisWeek }),
    })
  }

  const neglected = scored.filter(s => s.quantity < 10 && s.gap > 0)
  if (neglected.length > 0) {
    result.push({
      tone: 'neutral',
      text: t('insights.neglected', { name: neglected[0].friend.name }),
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
    <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">{{ t('insights.title') }}</p>
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
    {{ t('insights.empty') }}
  </div>
</template>
