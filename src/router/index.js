import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../views/Dashboard.vue';
import Product from '../components/Product.vue';
import Login from '../components/Login.vue'

import Category from '../views/Category.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      { path: '/dashboard', name: 'dashboard', component: Dashboard },
      { path: '/product', name: 'product', component: Product },
      { path: '/category', name: 'category', component: Category }


    ]
  },
  {
    path: '/login', name: 'login', component: Login
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
