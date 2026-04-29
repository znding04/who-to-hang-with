<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'
import { useGapThreshold } from '../composables/useGapThreshold'
import { useCustomTypes } from '../composables/useCustomTypes'
import { HANGOUT_TYPES } from '../types/index.js'
import ScatterPlot from '../components/ScatterPlot.vue'

const route = useRoute()
const router = useRouter()
const { getFriendById, getHangoutsForFriend, deleteFriend } = useFriends()
const { scoredFriends } = useScoring()
const { gapThreshold } = useGapThreshold()
const { customTypes } = useCustomTypes()

function handleEdit() {
  if (!friend.value) return
  router.push({ path: '/friends', query: { edit: friend.value.id } })
}

function handleDelete() {
  if (!friend.value) return
  if (confirm(`确定删除 ${friend.value.name}？`)) {
    deleteFriend(friend.value.id)
    router.push('/friends')
  }
}

const friendId = computed(() => route.params.id)
const friend = computed(() => getFriendById(friendId.value))

const friendScore = computed(() => {
  return scoredFriends.value.find(s => s.friend.id === friendId.value) || null
})

const friendHangouts = computed(() => {
  return getHangoutsForFriend(friendId.value)
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const typeMap = computed(() =>
  Object.fromEntries([...HANGOUT_TYPES, ...customTypes.value].map(t => [t.value, t]))
)

function gapText(gap) {
  if (gap < -gapThreshold.value) return `你在 ${friend.value.name} 身上投入很多但感觉一般`
  if (gap > gapThreshold.value) return '这段友谊很值得'
  return '平衡得很好'
}

function gapTone(gap) {
  if (gap < -gapThreshold.value) return 'text-rose-500'
  if (gap > gapThreshold.value) return 'text-emerald-600'
  return 'text-stone-500'
}

function rating(n) {
  return `${n}/10`
}

const infoRows = computed(() => {
  if (!friend.value) return []
  const rows = []
  if (friend.value.phone) rows.push({ label: '电话', value: friend.value.phone })
  if (friend.value.birthday) rows.push({ label: '生日', value: friend.value.birthday })
  if (friend.value.location) rows.push({ label: '所在地', value: friend.value.location })
  if (friend.value.howWeMet) rows.push({ label: '怎么认识', value: friend.value.howWeMet })
  return rows
})
</script>

<template>
  <div class="px-5 pt-9 pb-2">
    <!-- Header -->
    <div class="flex items-center justify-between mb-7">
      <router-link to="/friends" class="text-stone-500 text-[13px] no-underline flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18 L9 12 L15 6" />
        </svg>
        朋友列表
      </router-link>
      <div v-if="friend" class="flex items-center gap-2">
        <button
          @click="handleEdit"
          class="px-2.5 py-1 text-[11.5px] text-stone-500 bg-stone-100 active:bg-stone-200 rounded-md border-none cursor-pointer touch-manipulation"
        >编辑</button>
        <button
          @click="handleDelete"
          class="px-2.5 py-1 text-[11.5px] text-rose-500 bg-rose-50 active:bg-rose-100 rounded-md border-none cursor-pointer touch-manipulation"
        >删除</button>
      </div>
    </div>

    <div v-if="!friend" class="text-center text-stone-400 py-16 text-[13.5px]">
      找不到这位朋友
    </div>

    <template v-else>
      <!-- Name & tags -->
      <h1 class="text-[26px] font-semibold text-stone-900 tracking-tight">{{ friend.name }}</h1>
      <div v-if="friend.tags && friend.tags.length" class="flex flex-wrap gap-1.5 mt-2 mb-7">
        <span
          v-for="tag in friend.tags" :key="tag"
          class="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[11.5px] rounded-full"
        >{{ tag }}</span>
      </div>
      <div v-else class="mb-7"></div>

      <!-- Gap indicator -->
      <div v-if="friendScore" class="mb-9 pb-7 border-b" style="border-color: #ece9e4">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-2">差值 · 感受 − 频率</p>
        <p class="text-[40px] font-light tabular-nums tracking-tight" :class="gapTone(friendScore.gap)">
          {{ friendScore.gap > 0 ? '+' : '' }}{{ Math.round(friendScore.gap) }}
        </p>
        <p class="text-[13px] text-stone-500 mt-1">{{ gapText(friendScore.gap) }}</p>
      </div>

      <!-- Basic info -->
      <div v-if="infoRows.length" class="mb-9">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">基本信息</p>
        <div class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
          <div
            v-for="(row, i) in infoRows" :key="row.label"
            class="flex items-center justify-between px-4 py-3"
            :class="i > 0 ? 'border-t' : ''"
            :style="i > 0 ? 'border-color: #ece9e4' : ''"
          >
            <span class="text-[12.5px] text-stone-400">{{ row.label }}</span>
            <span class="text-[13.5px] text-stone-800 text-right">{{ row.value }}</span>
          </div>
        </div>
      </div>

      <!-- Values -->
      <div v-if="friend.values && friend.values.length" class="mb-9">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">TA 的价值</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="val in friend.values" :key="val"
            class="px-3 py-1 text-[12px] rounded-full"
            style="background: #fef3c7; color: #92400e"
          >{{ val }}</span>
        </div>
      </div>

      <!-- Important events -->
      <div v-if="friend.importantEvents && friend.importantEvents.length" class="mb-9">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">重要时刻</p>
        <div class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
          <div
            v-for="(event, i) in friend.importantEvents" :key="i"
            class="flex items-start gap-3 px-4 py-3"
            :class="i > 0 ? 'border-t' : ''"
            :style="i > 0 ? 'border-color: #ece9e4' : ''"
          >
            <span class="w-1 h-1 rounded-full bg-stone-400 mt-2 flex-shrink-0"></span>
            <span class="text-[13.5px] text-stone-700 leading-relaxed">{{ event }}</span>
          </div>
        </div>
      </div>

      <!-- Mini scatter -->
      <div v-if="scoredFriends.length > 0" class="mb-9">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">在散点图中的位置</p>
        <div class="rounded-xl p-3" style="border: 1px solid #ece9e4; background: #fbfaf7">
          <ScatterPlot :scores="scoredFriends" :highlight-id="friendId" :show-tuner="false" />
        </div>
      </div>

      <!-- Hangout history -->
      <div class="mb-7">
        <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">聚会记录</p>
        <div v-if="friendHangouts.length === 0" class="text-center text-stone-400 py-6 text-[13px]">
          还没有聚会记录
        </div>
        <div v-else class="rounded-xl overflow-hidden" style="border: 1px solid #ece9e4">
          <div
            v-for="(h, i) in friendHangouts" :key="h.id"
            class="px-4 py-3"
            :class="i > 0 ? 'border-t' : ''"
            :style="i > 0 ? 'border-color: #ece9e4' : ''"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[13.5px] font-medium text-stone-800">
                {{ typeMap[h.type]?.icon || '' }} {{ typeMap[h.type]?.label || h.type }}
              </span>
              <span class="text-[11.5px] text-stone-400 tabular-nums">{{ h.date }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[11.5px] text-stone-400">{{ h.duration }}</span>
              <span class="text-[11.5px] text-amber-500 font-medium tabular-nums">★ {{ rating(h.quality) }}</span>
            </div>
            <p v-if="h.note" class="text-[12.5px] text-stone-500 mt-1.5 leading-relaxed">{{ h.note }}</p>
          </div>
        </div>
      </div>

      <!-- Log button -->
      <router-link
        :to="`/log?friend=${friend.id}`"
        class="block w-full py-3 bg-stone-900 text-white text-center font-medium text-[15px] rounded-xl no-underline active:bg-stone-800"
      >
        记录聚会
      </router-link>
    </template>
  </div>
</template>
