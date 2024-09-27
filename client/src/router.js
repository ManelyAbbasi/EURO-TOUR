import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Map from './views/Map.vue'
import SignUp from './views/SignUp.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/signup', name: 'signup', component: SignUp },
  { path: '/map', name: 'map', component: Map }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
