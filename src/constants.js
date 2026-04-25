// Category definitions with bilingual labels and icons
export const CATEGORIES = {
  food:          { icon: '🍜', en: 'Food',          zh: '餐饮', type: 'expense' },
  transport:     { icon: '🚌', en: 'Transport',     zh: '交通', type: 'expense' },
  entertainment: { icon: '🎮', en: 'Entertainment', zh: '娱乐', type: 'expense' },
  shopping:      { icon: '🛒', en: 'Shopping',      zh: '购物', type: 'expense' },
  salary:        { icon: '💰', en: 'Salary',        zh: '工资', type: 'income' },
  freelance:     { icon: '💼', en: 'Freelance',     zh: '兼职', type: 'income' },
  other:         { icon: '📦', en: 'Other',         zh: '其他', type: 'both' },
}

// Get categories filtered by transaction type
export function getCategoriesForType(type) {
  return Object.entries(CATEGORIES).filter(
    ([, cat]) => cat.type === type || cat.type === 'both'
  )
}
