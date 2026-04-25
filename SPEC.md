# Personal Finance Tracker — WeChat Mini App Spec

## Overview
A mobile-first personal finance tracker that runs as a standalone web app and is compatible with WeChat Mini App webview. Users can record income/expense transactions, view history, and see monthly summaries.

## Tech Stack
- **Framework**: Vue 3 (Composition API) + Vite
- **Styling**: Tailwind CSS 3
- **Routing**: Vue Router 4 (hash mode for mini-app compatibility)
- **Storage**: LocalStorage via a reactive composable
- **Language**: JavaScript (no TypeScript for simplicity)
- **Compatibility**: Works in modern browsers + WeChat webview

## Data Model

### Transaction
```json
{
  "id": "uuid-string",
  "type": "income" | "expense",
  "amount": 100.00,
  "category": "food" | "transport" | "entertainment" | "shopping" | "salary" | "freelance" | "other",
  "note": "Optional description",
  "date": "2026-04-25",
  "createdAt": 1745000000000
}
```

### Categories
| Category       | Type    | Icon | Label (EN)      | Label (ZH) |
|---------------|---------|------|-----------------|-------------|
| food          | expense | 🍜   | Food            | 餐饮        |
| transport     | expense | 🚌   | Transport       | 交通        |
| entertainment | expense | 🎮   | Entertainment   | 娱乐        |
| shopping      | expense | 🛒   | Shopping        | 购物        |
| salary        | income  | 💰   | Salary          | 工资        |
| freelance     | income  | 💼   | Freelance       | 兼职        |
| other         | both    | 📦   | Other           | 其他        |

## Pages / Views

### 1. Home (Dashboard) — `/`
- Current month summary card: total income, total expenses, net savings
- Quick-add button (floating action button)
- Recent transactions (last 5)

### 2. Add Transaction — `/add`
- Toggle: Income / Expense
- Amount input (numeric keypad friendly)
- Category selector (grid of icons)
- Date picker (defaults to today)
- Optional note field
- Save button → redirects to home

### 3. Transaction History — `/history`
- Grouped by month
- Each item shows: category icon, note, amount (green for income, red for expense), date
- Swipe-to-delete or delete button

### 4. Monthly Summary — `/summary`
- Month selector (prev/next arrows)
- Pie chart or bar breakdown by category (CSS-only, no chart library)
- Total income / expense / net
- List of categories with amounts

## Navigation
- Bottom tab bar with 3 tabs: Home, History, Summary
- Floating "+" button on Home for quick add

## Storage
- Key: `finance_transactions`
- Value: JSON array of Transaction objects
- Composable: `useTransactions()` returns reactive list + CRUD methods

## UI Design Principles
- Mobile-first: max-width 480px centered
- Clean white background, subtle shadows
- Green (#10B981) for income, Red (#EF4444) for expense
- Rounded cards, 16px padding
- Chinese labels with English subtitles
- Safe-area padding for notch devices

## Mini-App Compatibility Notes
- Hash-based routing (`createWebHashHistory`)
- No external font loading (use system fonts)
- No `window.open` or external links
- LocalStorage is available in WeChat webview
- Viewport meta tag for proper scaling
