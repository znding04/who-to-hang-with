import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'finance_transactions'

// Load from LocalStorage
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Shared reactive state (singleton across components)
const transactions = ref(loadTransactions())

// Persist on every change
watch(transactions, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useTransactions() {
  // Add a new transaction
  function addTransaction({ type, amount, category, note, date }) {
    transactions.value.push({
      id: crypto.randomUUID(),
      type,
      amount: parseFloat(amount),
      category,
      note: note || '',
      date,
      createdAt: Date.now(),
    })
  }

  // Delete by id
  function deleteTransaction(id) {
    transactions.value = transactions.value.filter((t) => t.id !== id)
  }

  // Sorted newest-first
  const sorted = computed(() =>
    [...transactions.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  // Get transactions for a specific month (YYYY-MM)
  function getByMonth(yearMonth) {
    return sorted.value.filter((t) => t.date.startsWith(yearMonth))
  }

  // Monthly totals for a YYYY-MM string
  function getMonthlyTotals(yearMonth) {
    const items = getByMonth(yearMonth)
    const income = items
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = items
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, net: income - expense }
  }

  // Category breakdown for a month
  function getCategoryBreakdown(yearMonth) {
    const items = getByMonth(yearMonth)
    const breakdown = {}
    for (const t of items) {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { income: 0, expense: 0 }
      }
      breakdown[t.category][t.type] += t.amount
    }
    return breakdown
  }

  return {
    transactions: sorted,
    addTransaction,
    deleteTransaction,
    getByMonth,
    getMonthlyTotals,
    getCategoryBreakdown,
  }
}
