<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactions } from '../composables/useTransactions'
import { getCategoriesForType } from '../constants'

const router = useRouter()
const { addTransaction } = useTransactions()

const type = ref('expense')
const amount = ref('')
const category = ref('')
const note = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

const categories = computed(() => getCategoriesForType(type.value))

// Reset category when switching type
function setType(t) {
  type.value = t
  category.value = ''
}

const canSubmit = computed(() => {
  return amount.value && parseFloat(amount.value) > 0 && category.value && date.value
})

function submit() {
  if (!canSubmit.value) return
  addTransaction({
    type: type.value,
    amount: amount.value,
    category: category.value,
    note: note.value,
    date: date.value,
  })
  router.push('/')
}
</script>

<template>
  <div class="px-4 pt-6">
    <!-- Header with back button -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="router.back()" class="text-2xl text-gray-400 bg-transparent border-none cursor-pointer">←</button>
      <h1 class="text-xl font-bold text-gray-800">记一笔 Add</h1>
    </div>

    <!-- Type toggle -->
    <div class="flex bg-gray-100 rounded-xl p-1 mb-5">
      <button
        @click="setType('expense')"
        class="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all"
        :class="type === 'expense' ? 'bg-red-500 text-white shadow-sm' : 'bg-transparent text-gray-500'"
      >
        支出 Expense
      </button>
      <button
        @click="setType('income')"
        class="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all"
        :class="type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-transparent text-gray-500'"
      >
        收入 Income
      </button>
    </div>

    <!-- Amount -->
    <div class="mb-5">
      <label class="text-sm text-gray-500 mb-2 block">金额 Amount</label>
      <div class="flex items-center bg-gray-50 rounded-xl px-4 py-3">
        <span class="text-xl font-bold text-gray-400 mr-2">¥</span>
        <input
          v-model="amount"
          type="number"
          inputmode="decimal"
          placeholder="0.00"
          step="0.01"
          min="0"
          class="flex-1 bg-transparent border-none outline-none text-2xl font-bold text-gray-800"
        />
      </div>
    </div>

    <!-- Category grid -->
    <div class="mb-5">
      <label class="text-sm text-gray-500 mb-2 block">分类 Category</label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="[key, cat] in categories"
          :key="key"
          @click="category = key"
          class="flex flex-col items-center gap-1 py-3 rounded-xl border-2 cursor-pointer transition-all bg-white"
          :class="category === key ? 'border-blue-500 bg-blue-50' : 'border-transparent'"
        >
          <span class="text-2xl">{{ cat.icon }}</span>
          <span class="text-xs text-gray-600">{{ cat.zh }}</span>
        </button>
      </div>
    </div>

    <!-- Date -->
    <div class="mb-5">
      <label class="text-sm text-gray-500 mb-2 block">日期 Date</label>
      <input
        v-model="date"
        type="date"
        class="w-full bg-gray-50 rounded-xl px-4 py-3 border-none outline-none text-gray-800 text-sm"
      />
    </div>

    <!-- Note -->
    <div class="mb-6">
      <label class="text-sm text-gray-500 mb-2 block">备注 Note (optional)</label>
      <input
        v-model="note"
        type="text"
        placeholder="添加备注..."
        class="w-full bg-gray-50 rounded-xl px-4 py-3 border-none outline-none text-gray-800 text-sm"
      />
    </div>

    <!-- Submit -->
    <button
      @click="submit"
      :disabled="!canSubmit"
      class="w-full py-3.5 rounded-xl text-white font-semibold text-base border-none cursor-pointer transition-all"
      :class="canSubmit ? 'bg-blue-500 active:scale-[0.98]' : 'bg-gray-300 cursor-not-allowed'"
    >
      保存 Save
    </button>
  </div>
</template>
