<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'home', path: '/', label: '首页' },
  { name: 'friends', path: '/friends', label: '朋友' },
  { name: 'log', path: '/log', label: '记录' },
  { name: 'stats', path: '/stats', label: '统计' },
]
</script>

<template>
  <div class="mx-auto max-w-[480px] min-h-screen bg-white relative" style="padding-top: var(--safe-top); padding-bottom: calc(4.5rem + var(--safe-bottom))">
    <router-view />

    <!-- Bottom tab bar -->
    <nav
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 backdrop-blur-xl"
      style="padding-bottom: env(safe-area-inset-bottom, 0px); background: rgba(255, 255, 255, 0.82); border-top: 1px solid #ece9e4"
    >
      <div class="flex justify-around pt-2.5 pb-1.5">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          class="relative flex flex-col items-center gap-1 no-underline transition-colors duration-200 px-3"
          :class="route.name === tab.name ? 'text-stone-900' : 'text-stone-400'"
        >
          <!-- Home -->
          <svg v-if="tab.name === 'home'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 11.5 L12 4 L21 11.5" />
            <path d="M5.5 10 L5.5 20 L18.5 20 L18.5 10" />
            <path d="M10 20 L10 14.5 L14 14.5 L14 20" />
          </svg>

          <!-- Friends -->
          <svg v-else-if="tab.name === 'friends'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="8.5" r="3.5" />
            <path d="M2.5 20 C2.5 16 5.5 14 9 14 C12.5 14 15.5 16 15.5 20" />
            <path d="M16 6.2 A3 3 0 0 1 16 12.5" />
            <path d="M17.5 14.5 C20 15 21.5 17 21.5 19.5" />
          </svg>

          <!-- Log / plus -->
          <svg v-else-if="tab.name === 'log'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8 L12 16" />
            <path d="M8 12 L16 12" />
          </svg>

          <!-- Stats -->
          <svg v-else-if="tab.name === 'stats'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 20 L5 13" />
            <path d="M12 20 L12 5.5" />
            <path d="M19 20 L19 9.5" />
          </svg>

          <span class="text-[10px] font-medium tracking-wide">{{ tab.label }}</span>

          <!-- Active dot -->
          <span
            class="absolute -bottom-0.5 w-1 h-1 rounded-full transition-opacity duration-200"
            :class="route.name === tab.name ? 'opacity-100 bg-amber-500' : 'opacity-0'"
          ></span>
        </router-link>
      </div>
    </nav>
  </div>
</template>
