import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vue') },
  { path: '/friends', name: 'friends', component: () => import('./pages/Friends.vue') },
  { path: '/friends/:id', name: 'friend-detail', component: () => import('./pages/FriendDetail.vue') },
  { path: '/log', name: 'log', component: () => import('./pages/LogHangout.vue') },
  { path: '/stats', name: 'stats', component: () => import('./pages/Stats.vue') },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
