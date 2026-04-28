<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'home', path: '/', icon: '🏠', label: '首页' },
  { name: 'friends', path: '/friends', icon: '👥', label: '朋友' },
  { name: 'log', path: '/log', icon: '➕', label: '记录' },
  { name: 'stats', path: '/stats', icon: '📊', label: '统计' },
]
</script>

<template>
  <div class="mx-auto max-w-[480px] min-h-screen bg-white relative" style="padding-top: var(--safe-top); padding-bottom: calc(4rem + var(--safe-bottom))">
    <router-view />

    <!-- Bottom tab bar -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-200 z-40" style="padding-bottom: env(safe-area-inset-bottom, 0px)">
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
