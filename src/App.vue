<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const tabs = [
  { name: 'home', path: '/', icon: '🏠', label: '首页', sub: 'Home' },
  { name: 'history', path: '/history', icon: '📋', label: '账单', sub: 'History' },
  { name: 'summary', path: '/summary', icon: '📊', label: '统计', sub: 'Summary' },
]

const showTabBar = computed(() => route.name !== 'add')
</script>

<template>
  <div class="mx-auto max-w-[480px] min-h-screen bg-white relative pb-20">
    <router-view />

    <!-- Floating add button -->
    <router-link
      v-if="showTabBar"
      to="/add"
      class="fixed bottom-22 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg active:scale-95 transition-transform no-underline"
      style="max-width: 480px"
    >
      +
    </router-link>

    <!-- Bottom tab bar -->
    <nav v-if="showTabBar" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-40" style="padding-bottom: var(--safe-bottom)">
      <div class="flex justify-around py-2">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="flex flex-col items-center gap-0.5 no-underline transition-colors"
          :class="route.name === tab.name ? 'text-blue-500' : 'text-gray-400'"
        >
          <span class="text-xl">{{ tab.icon }}</span>
          <span class="text-xs font-medium">{{ tab.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>
