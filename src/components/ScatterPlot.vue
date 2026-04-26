<script setup>
const props = defineProps({
  scores: { type: Array, required: true },
  highlightId: { type: String, default: null },
})

const emit = defineEmits(['select'])

const padding = 40
const size = 300
const inner = size - padding * 2

function x(val) {
  return padding + (val / 100) * inner
}

function y(val) {
  return size - padding - (val / 100) * inner
}

function dotColor(gap) {
  if (gap > 5) return '#22c55e'
  if (gap < -5) return '#ef4444'
  return '#3b82f6'
}
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="w-full" style="max-width: 400px;">
    <!-- Axes -->
    <line :x1="padding" :y1="size - padding" :x2="size - padding" :y2="size - padding" stroke="#d1d5db" stroke-width="1" />
    <line :x1="padding" :y1="size - padding" :x2="padding" :y2="padding" stroke="#d1d5db" stroke-width="1" />

    <!-- Axis labels -->
    <text v-for="v in [0, 50, 100]" :key="'x' + v"
      :x="x(v)" :y="size - padding + 14" text-anchor="middle" font-size="9" fill="#9ca3af">{{ v }}</text>
    <text v-for="v in [0, 50, 100]" :key="'y' + v"
      :x="padding - 8" :y="y(v) + 3" text-anchor="end" font-size="9" fill="#9ca3af">{{ v }}</text>

    <!-- Axis titles -->
    <text :x="size / 2" :y="size - 4" text-anchor="middle" font-size="10" fill="#6b7280">频率 →</text>
    <text :x="12" :y="size / 2" text-anchor="middle" font-size="10" fill="#6b7280" transform="rotate(-90, 12, 150)">感受 →</text>

    <!-- Y=X diagonal reference line -->
    <line :x1="x(0)" :y1="y(0)" :x2="x(100)" :y2="y(100)" stroke="#d1d5db" stroke-width="1" stroke-dasharray="4 3" />

    <!-- Friend dots -->
    <g v-for="s in scores" :key="s.friend.id" class="cursor-pointer" @click="emit('select', s.friend)">
      <circle
        :cx="x(s.quantity)" :cy="y(s.quality)" r="12"
        :fill="dotColor(s.gap)"
        :opacity="highlightId && highlightId !== s.friend.id ? 0.2 : 0.8"
        :stroke="highlightId === s.friend.id ? '#1e3a5f' : 'white'"
        :stroke-width="highlightId === s.friend.id ? 2 : 1"
      />
      <title>{{ s.friend.name }} (频率: {{ Math.round(s.quantity) }}, 感受: {{ Math.round(s.quality) }})</title>
    </g>
  </svg>
</template>
