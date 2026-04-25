<script setup>
import { computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'
import { CATEGORIES } from '../constants'

const { transactions, getMonthlyTotals } = useTransactions()

// Current month in YYYY-MM format
const currentMonth = new Date().toISOString().slice(0, 7)
const totals = computed(() => getMonthlyTotals(currentMonth))

// Recent 5 transactions
const recent = computed(() => transactions.value.slice(0, 5))

function formatAmount(type, amount) {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}¥${amount.toFixed(2)}`
}

const monthLabel = computed(() => {
  const [y, m] = currentMonth.split('-')
  return `${y}年${parseInt(m)}月`
})
</script>

<template>
  <div class="px-4 pt-6">
    <!-- Header -->
    <h1 class="text-xl font-bold text-gray-800 mb-1">记账本</h1>
    <p class="text-sm text-gray-400 mb-4">Personal Finance Tracker</p>

    <!-- Monthly summary card -->
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white mb-6 shadow-md">
      <p class="text-sm opacity-80 mb-3">{{ monthLabel }} · 本月概览</p>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div>
          <p class="text-xs opacity-70">收入 Income</p>
          <p class="text-lg font-bold mt-1">¥{{ totals.income.toFixed(2) }}</p>
        </div>
        <div>
          <p class="text-xs opacity-70">支出 Expense</p>
          <p class="text-lg font-bold mt-1">¥{{ totals.expense.toFixed(2) }}</p>
        </div>
        <div>
          <p class="text-xs opacity-70">结余 Net</p>
          <p class="text-lg font-bold mt-1" :class="totals.net >= 0 ? '' : 'text-red-200'">
            ¥{{ totals.net.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent transactions -->
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-base font-semibold text-gray-700">最近交易 Recent</h2>
      <router-link to="/history" class="text-sm text-blue-500 no-underline">查看全部 →</router-link>
    </div>

    <div v-if="recent.length === 0" class="text-center text-gray-400 py-10 text-sm">
      暂无记录，点击 + 添加第一笔<br />No records yet. Tap + to add one.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="t in recent"
        :key="t.id"
        class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ CATEGORIES[t.category]?.icon || '📦' }}</span>
          <div>
            <p class="text-sm font-medium text-gray-700">
              {{ CATEGORIES[t.category]?.zh || t.category }}
            </p>
            <p v-if="t.note" class="text-xs text-gray-400 mt-0.5">{{ t.note }}</p>
          </div>
        </div>
        <span
          class="text-sm font-semibold"
          :class="t.type === 'income' ? 'text-emerald-500' : 'text-red-500'"
        >
          {{ formatAmount(t.type, t.amount) }}
        </span>
      </div>
    </div>
  </div>
</template>
