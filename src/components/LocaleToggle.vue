<script setup>
import { useI18n } from '../composables/useI18n.js'

const { locale, setLocale } = useI18n()
</script>

<template>
  <div class="flex items-center text-[11px] font-medium select-none rounded-full bg-white/70 backdrop-blur border border-stone-200 overflow-hidden">
    <button
      type="button"
      @click="setLocale('en')"
      class="px-2 py-1 border-none cursor-pointer transition-colors"
      :class="locale === 'en' ? 'bg-stone-900 text-white' : 'bg-transparent text-stone-500 hover:text-stone-800'"
    >EN</button>
    <button
      type="button"
      @click="setLocale('zh')"
      class="px-2 py-1 border-none cursor-pointer transition-colors"
      :class="locale === 'zh' ? 'bg-stone-900 text-white' : 'bg-transparent text-stone-500 hover:text-stone-800'"
    >中</button>
  </div>
</template>
