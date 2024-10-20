import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import SignUp from './views/SignUp.vue'
import Login from './views/Login.vue'
import MainCities from './views/MainCities.vue'
import searchCityByTag from './views/searchCityByTag.vue'
import SearchCityByRating from './views/SearchCityByRating.vue'
import Profile from './views/Profile.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/signup', name: 'signup', component: SignUp },
  { path: '/maincities', name: 'maincities', component: MainCities },
  { path: '/login', name: 'login', component: Login },
  { path: '/searchCityByTag', name: 'citytag', component: searchCityByTag },
  { path: '/Profile', name: 'profile', component: Profile },
  { path: '/SearchCityByRating', name: 'cityrating', component: SearchCityByRating }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
