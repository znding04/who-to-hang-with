import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useSeedData } from './composables/useSeedData'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Seed demo data on first-ever visit
const { seedIfEmpty } = useSeedData()
seedIfEmpty()
