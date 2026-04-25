import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vue') },
  { path: '/add', name: 'add', component: () => import('./pages/AddTransaction.vue') },
  { path: '/history', name: 'history', component: () => import('./pages/History.vue') },
  { path: '/summary', name: 'summary', component: () => import('./pages/Summary.vue') },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
