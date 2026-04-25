<script setup>
import { ref, computed } from 'vue'
import { useTransactions } from '../composables/useTransactions'
import { CATEGORIES } from '../constants'

const { getMonthlyTotals, getCategoryBreakdown, getByMonth } = useTransactions()

// Month navigation
const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)

const yearMonth = computed(() => {
  return `${year.value}-${String(month.value).padStart(2, '0')}`
})

function prevMonth() {
  if (month.value === 1) {
    month.value = 12
    year.value--
  } else {
    month.value--
  }
}

function nextMonth() {
  if (month.value === 12) {
    month.value = 1
    year.value++
  } else {
    month.value++
  }
}

const totals = computed(() => getMonthlyTotals(yearMonth.value))
const breakdown = computed(() => getCategoryBreakdown(yearMonth.value))
const hasData = computed(() => getByMonth(yearMonth.value).length > 0)

// Sorted categories by total amount
const sortedCategories = computed(() => {
  return Object.entries(breakdown.value)
    .map(([key, val]) => ({
      key,
      ...CATEGORIES[key],
      income: val.income,
      expense: val.expense,
      total: val.income + val.expense,
    }))
    .sort((a, b) => b.total - a.total)
})

// For the expense bar chart
const expenseCategories = computed(() =>
  sortedCategories.value.filter((c) => c.expense > 0)
)
const maxExpense = computed(() =>
  Math.max(...expenseCategories.value.map((c) => c.expense), 1)
)

const monthLabel = computed(() => `${year.value}年${month.value}月`)
</script>

<template>
  <div class="px-4 pt-6">
    <h1 class="text-xl font-bold text-gray-800 mb-1">月度统计</h1>
    <p class="text-sm text-gray-400 mb-5">Monthly Summary</p>

    <!-- Month selector -->
    <div class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-5">
      <button @click="prevMonth" class="text-xl text-gray-500 bg-transparent border-none cursor-pointer px-2">‹</button>
      <span class="text-base font-semibold text-gray-700">{{ monthLabel }}</span>
      <button @click="nextMonth" class="text-xl text-gray-500 bg-transparent border-none cursor-pointer px-2">›</button>
    </div>

    <!-- Totals -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-emerald-50 rounded-xl p-3 text-center">
        <p class="text-xs text-emerald-600 mb-1">收入 Income</p>
        <p class="text-base font-bold text-emerald-600">¥{{ totals.income.toFixed(2) }}</p>
      </div>
      <div class="bg-red-50 rounded-xl p-3 text-center">
        <p class="text-xs text-red-500 mb-1">支出 Expense</p>
        <p class="text-base font-bold text-red-500">¥{{ totals.expense.toFixed(2) }}</p>
      </div>
      <div class="bg-blue-50 rounded-xl p-3 text-center">
        <p class="text-xs text-blue-500 mb-1">结余 Net</p>
        <p class="text-base font-bold" :class="totals.net >= 0 ? 'text-blue-500' : 'text-red-500'">
          ¥{{ totals.net.toFixed(2) }}
        </p>
      </div>
    </div>

    <div v-if="!hasData" class="text-center text-gray-400 py-10 text-sm">
      本月暂无记录<br />No data for this month.
    </div>

    <!-- Expense breakdown bar chart -->
    <div v-if="expenseCategories.length > 0" class="mb-6">
      <h2 class="text-sm font-semibold text-gray-600 mb-3">支出分类 Expense Breakdown</h2>
      <div class="space-y-3">
        <div v-for="cat in expenseCategories" :key="cat.key" class="flex items-center gap-3">
          <span class="text-xl w-8 text-center shrink-0">{{ cat.icon }}</span>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-600">{{ cat.zh }}</span>
              <span class="text-gray-500">¥{{ cat.expense.toFixed(2) }}</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-red-400 rounded-full transition-all duration-500"
                :style="{ width: (cat.expense / maxExpense * 100) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Income breakdown -->
    <div v-if="sortedCategories.some(c => c.income > 0)" class="mb-6">
      <h2 class="text-sm font-semibold text-gray-600 mb-3">收入分类 Income Breakdown</h2>
      <div class="space-y-2">
        <div
          v-for="cat in sortedCategories.filter(c => c.income > 0)"
          :key="'inc-' + cat.key"
          class="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3"
        >
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ cat.icon }}</span>
            <span class="text-sm text-gray-700">{{ cat.zh }}</span>
          </div>
          <span class="text-sm font-semibold text-emerald-600">¥{{ cat.income.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
