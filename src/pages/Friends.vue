<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFriends } from '../composables/useFriends'
import { useScoring } from '../composables/useScoring'

const router = useRouter()
const { friends, addFriend, deleteFriend } = useFriends()
const { scoredFriends } = useScoring()

const showAdd = ref(false)
const newName = ref('')
const newTags = ref('')

function handleAdd() {
  const name = newName.value.trim()
  if (!name) return
  const tags = newTags.value
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean)
  addFriend({ name, tags })
  newName.value = ''
  newTags.value = ''
  showAdd.value = false
}

function handleDelete(friend) {
  if (confirm(`确定删除 ${friend.name}？`)) {
    deleteFriend(friend.id)
  }
}
</script>

<template>
  <div class="px-4 pt-6 pb-6">
    <div class="flex items-center justify-between mb-5">
      <h1 class="text-xl font-bold text-gray-800">朋友们</h1>
      <button
        @click="showAdd = !showAdd"
        class="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg border-none cursor-pointer"
      >
        {{ showAdd ? '取消' : '+ 添加' }}
      </button>
    </div>

    <!-- Add friend form -->
    <div v-if="showAdd" class="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
      <input
        v-model="newName"
        placeholder="名字"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        @keyup.enter="handleAdd"
      />
      <input
        v-model="newTags"
        placeholder="标签（逗号分隔，如：大学, 球友）"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        @keyup.enter="handleAdd"
      />
      <button
        @click="handleAdd"
        class="w-full py-2 bg-blue-500 text-white text-sm rounded-lg border-none cursor-pointer"
      >
        保存朋友
      </button>
    </div>

    <!-- Friend list -->
    <div v-if="friends.length === 0" class="text-center text-gray-400 py-16 text-sm">
      还没有朋友<br />点击上方 + 添加 开始
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="s in scoredFriends"
        :key="s.friend.id"
        class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 cursor-pointer active:bg-gray-100 transition-colors"
        @click="router.push(`/friends/${s.friend.id}`)"
      >
        <div>
          <p class="text-sm font-medium text-gray-700">{{ s.friend.name }}</p>
          <p v-if="s.friend.tags.length" class="text-xs text-gray-400 mt-0.5">
            {{ s.friend.tags.join(' · ') }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="text-xs font-medium"
            :class="s.gap > 5 ? 'text-green-500' : s.gap < -5 ? 'text-red-500' : 'text-blue-500'"
          >
            {{ s.gap > 0 ? '+' : '' }}{{ Math.round(s.gap) }}
          </span>
          <button
            @click.stop="handleDelete(s.friend)"
            class="text-gray-300 text-xs bg-transparent border-none cursor-pointer hover:text-red-400"
          >删除</button>
          <span class="text-gray-300 text-sm">›</span>
        </div>
      </div>
    </div>
  </div>
</template>
