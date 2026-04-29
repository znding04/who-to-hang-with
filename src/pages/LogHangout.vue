<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFriends } from '../composables/useFriends'
import { useCustomTypes } from '../composables/useCustomTypes'
import { HANGOUT_TYPES, DURATION_OPTIONS } from '../types/index.js'

const router = useRouter()
const route = useRoute()
const { friends, addFriend, addHangout } = useFriends()
const { customTypes, addCustomType } = useCustomTypes()

const selectedFriendIds = ref([])
const hangoutType = ref('meal')
const duration = ref('1hr')
const quality = ref(6)
const date = ref(new Date().toISOString().slice(0, 10))
const note = ref('')

const customTypeLabel = ref('')

const allTypes = computed(() => [...HANGOUT_TYPES, ...customTypes.value])

const showAddFriend = ref(false)
const newFriendName = ref('')

onMounted(() => {
  const id = route.query.friend
  if (id && friends.value.some((f) => f.id === id)) {
    selectedFriendIds.value = [id]
  }
})

function toggleFriend(id) {
  const idx = selectedFriendIds.value.indexOf(id)
  if (idx >= 0) {
    selectedFriendIds.value.splice(idx, 1)
  } else {
    selectedFriendIds.value.push(id)
  }
}

function handleAddFriend() {
  const name = newFriendName.value.trim()
  if (!name) return
  const friend = addFriend({ name, tags: [] })
  selectedFriendIds.value.push(friend.id)
  newFriendName.value = ''
  showAddFriend.value = false
}

const canSubmit = computed(() => selectedFriendIds.value.length > 0)

function submit() {
  if (!canSubmit.value) return

  let typeToSave = hangoutType.value
  if (hangoutType.value === 'other' && customTypeLabel.value.trim()) {
    const created = addCustomType(customTypeLabel.value)
    if (created) typeToSave = created.value
  }

  addHangout({
    friendIds: [...selectedFriendIds.value],
    type: typeToSave,
    duration: duration.value,
    quality: quality.value,
    note: note.value,
    date: date.value,
  })
  router.push('/friends')
}
</script>

<template>
  <div class="px-5 pt-9 pb-2">
    <!-- Header -->
    <div class="flex items-center justify-between mb-9">
      <router-link to="/" class="text-stone-500 text-[13px] no-underline flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18 L9 12 L15 6" />
        </svg>
        返回
      </router-link>
      <div>
        <p class="text-[11px] uppercase tracking-[0.22em] text-stone-400 text-right">Log</p>
        <h1 class="text-[18px] font-semibold text-stone-900 tracking-tight">记录聚会</h1>
      </div>
    </div>

    <!-- Friend selector -->
    <section class="mb-7">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">和谁玩了</p>
      <div v-if="friends.length === 0" class="text-[13px] text-stone-400 mb-2">
        还没有朋友，先添加一个吧
      </div>
      <div class="rounded-xl overflow-hidden max-h-56 overflow-y-auto" style="border: 1px solid #ece9e4">
        <label
          v-for="(f, i) in friends"
          :key="f.id"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
          :class="[
            i > 0 ? 'border-t' : '',
            selectedFriendIds.includes(f.id) ? 'bg-stone-900 text-white' : 'bg-white active:bg-stone-50',
          ]"
          :style="i > 0 ? 'border-color: #ece9e4' : ''"
        >
          <input
            type="checkbox"
            :checked="selectedFriendIds.includes(f.id)"
            @change="toggleFriend(f.id)"
            class="w-4 h-4"
            style="accent-color: #1c1917"
          />
          <span class="text-[14px] flex-1" :class="selectedFriendIds.includes(f.id) ? 'text-white' : 'text-stone-800'">{{ f.name }}</span>
          <span v-if="f.tags.length" class="text-[11px]" :class="selectedFriendIds.includes(f.id) ? 'text-stone-300' : 'text-stone-400'">{{ f.tags.join(', ') }}</span>
        </label>
      </div>

      <button
        v-if="!showAddFriend"
        @click="showAddFriend = true"
        class="mt-2.5 text-[12.5px] text-stone-500 hover:text-stone-900 bg-transparent border-none cursor-pointer"
      >
        + 添加新朋友
      </button>
      <div v-else class="flex gap-2 mt-2.5">
        <input
          v-model="newFriendName"
          placeholder="朋友名字"
          class="flex-1 bg-white rounded-lg px-3.5 py-2 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none"
          style="border: 1px solid #ece9e4"
          @keyup.enter="handleAddFriend"
        />
        <button
          @click="handleAddFriend"
          class="px-3.5 py-2 bg-stone-900 text-white text-[13px] rounded-lg border-none cursor-pointer"
        >添加</button>
        <button
          @click="showAddFriend = false; newFriendName = ''"
          class="px-3.5 py-2 bg-stone-100 text-stone-600 text-[13px] rounded-lg border-none cursor-pointer"
        >取消</button>
      </div>
    </section>

    <!-- Type picker -->
    <section class="mb-7">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">类型</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="t in allTypes"
          :key="t.value"
          @click="hangoutType = t.value; customTypeLabel = ''"
          class="px-3.5 py-1.5 rounded-full text-[13px] cursor-pointer transition-colors"
          :class="hangoutType === t.value
            ? 'bg-stone-900 text-white'
            : 'bg-white text-stone-600'"
          :style="hangoutType === t.value ? 'border: 1px solid #1c1917' : 'border: 1px solid #ece9e4'"
        >
          {{ t.icon }} {{ t.label }}
        </button>
      </div>
      <input
        v-if="hangoutType === 'other'"
        v-model="customTypeLabel"
        placeholder="自定义类型名（前面可加 emoji，如 🎲 桌游）"
        class="mt-2.5 w-full bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none"
        style="border: 1px solid #ece9e4"
      />
      <p v-if="hangoutType === 'other' && customTypeLabel.trim()" class="text-[11.5px] text-stone-400 mt-1.5">
        保存后 "{{ customTypeLabel.trim() }}" 会出现在类型选项里
      </p>
    </section>

    <!-- Duration picker -->
    <section class="mb-7">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">时长</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="d in DURATION_OPTIONS"
          :key="d.value"
          @click="duration = d.value"
          class="px-3.5 py-1.5 rounded-full text-[13px] cursor-pointer transition-colors"
          :class="duration === d.value
            ? 'bg-stone-900 text-white'
            : 'bg-white text-stone-600'"
          :style="duration === d.value ? 'border: 1px solid #1c1917' : 'border: 1px solid #ece9e4'"
        >
          {{ d.label }}
        </button>
      </div>
    </section>

    <!-- Quality rating (1-10) -->
    <section class="mb-7">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">感受 · {{ quality }}/10</p>
      <div class="flex flex-wrap gap-0.5">
        <button
          v-for="s in 10"
          :key="s"
          @click="quality = s"
          class="text-xl bg-transparent border-none cursor-pointer px-0.5 py-0.5 transition-colors touch-manipulation"
          :class="s <= quality ? 'text-amber-500' : 'text-stone-300'"
        >★</button>
      </div>
    </section>

    <!-- Date picker -->
    <section class="mb-7">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">日期</p>
      <input
        v-model="date"
        type="date"
        class="w-full bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-stone-800 outline-none"
        style="border: 1px solid #ece9e4"
      />
    </section>

    <!-- Note -->
    <section class="mb-9">
      <p class="text-[10px] uppercase tracking-[0.22em] text-stone-400 font-medium mb-3">备注</p>
      <textarea
        v-model="note"
        placeholder="记点什么..."
        rows="3"
        class="w-full bg-white rounded-lg px-3.5 py-2.5 text-[14px] text-stone-800 placeholder:text-stone-400 outline-none resize-none"
        style="border: 1px solid #ece9e4"
      />
    </section>

    <!-- Submit -->
    <button
      @click="submit"
      :disabled="!canSubmit"
      class="w-full py-3 rounded-xl text-[15px] font-medium border-none cursor-pointer transition-colors"
      :class="canSubmit ? 'bg-stone-900 text-white active:bg-stone-800' : 'bg-stone-100 text-stone-400 cursor-not-allowed'"
    >
      保存
    </button>
  </div>
</template>
