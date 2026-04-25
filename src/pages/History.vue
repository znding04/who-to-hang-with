<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'
import { CATEGORIES } from '../constants'

const { transactions, deleteTransaction } = useTransactions()

// Group by date
const grouped = computed(() => {
  const groups = {}
  for (const t of transactions.value) {
    if (!groups[t.date]) groups[t.date] = []
    groups[t.date].push(t)
  }
  // Sort dates descending
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
})

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${month}月${day}日 ${weekdays[d.getDay()]}`
}

function formatAmount(type, amount) {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}¥${amount.toFixed(2)}`
}

function handleDelete(id) {
  deleteTransaction(id)
}
</script>

<template>
  <div class="px-4 pt-6">
    <h1 class="text-xl font-bold text-gray-800 mb-1">账单明细</h1>
    <p class="text-sm text-gray-400 mb-5">Transaction History</p>

    <div v-if="transactions.length === 0" class="text-center text-gray-400 py-16 text-sm">
      暂无记录<br />No transactions yet.
    </div>

    <div v-for="[date, items] in grouped" :key="date" class="mb-5">
      <p class="text-xs text-gray-400 font-medium mb-2 px-1">{{ formatDate(date) }}</p>
      <div class="space-y-2">
        <div
          v-for="t in items"
          :key="t.id"
          class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
        >
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-2xl shrink-0">{{ CATEGORIES[t.category]?.icon || '📦' }}</span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-700">
                {{ CATEGORIES[t.category]?.zh || t.category }}
              </p>
              <p v-if="t.note" class="text-xs text-gray-400 mt-0.5 truncate">{{ t.note }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="text-sm font-semibold"
              :class="t.type === 'income' ? 'text-emerald-500' : 'text-red-500'"
            >
              {{ formatAmount(t.type, t.amount) }}
            </span>
            <button
              @click="handleDelete(t.id)"
              class="text-gray-300 hover:text-red-400 bg-transparent border-none cursor-pointer text-lg p-1 transition-colors"
              title="删除 Delete"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
