import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Dashboard from '../views/Dashboard.vue';
import Product from '../components/Product.vue';
import Login from '../components/Login.vue';
import Category from '../views/Category.vue';
import Shop from '../views/Shop.vue';
import UserRegister from '../form/UserRegister.vue';
import useLogin from '../form/UserLogin.vue';
import Punchases from '@/views/Punchases.vue';
import ToDayOrder from '@/views/ToDayOrder.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      { path: '/dashboard', name: 'dashboard', component: Dashboard },
      { path: '/product', name: 'product', component: Product },
      { path: '/category', name: 'category', component: Category },
      { path: '/punchase', name: 'punchase', component: Punchases },
      { path: '/todayorder', name: 'todayorder', component: ToDayOrder }
    ]
  },
  {
    path: '/shop', name: 'shop', component: Shop
  },
  {
    path: '/login', name: 'login', component: Login
  },
  {
    path: '/userregister', name: 'userregister', component: UserRegister
  },
  {
    path: '/userlogin', name: 'userlogin', component: useLogin
  },
  // Redirect any unmatched routes to the appropriate place
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      const hostname = window.location.hostname;
      if (hostname === 'admin.localhost') {
        return '/login';
      } else {
        return '/shop';
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Global navigation guard for redirection
router.beforeEach((to, from, next) => {
  const hostname = window.location.hostname;

  if (hostname === 'admin.localhost' && to.path === '/') {
    next('/login');
  } else if (hostname !== 'admin.localhost' && to.path === '/') {
    next('/shop');
  } else {
    next();
  }
});

export default router;
