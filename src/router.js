// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

// Import views
import Home from '@/views/Home.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import MyOrders from '@/views/MyOrders.vue'
import Basket from '@/views/Basket.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresGuest: true }
  },
  {
    path: '/basket',
    name: 'Basket',
    component: Basket,
    meta: { requiresAuth: true }
  },
  {
    path: '/product/:id',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true // Pass route params as props
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: MyOrders,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: Home,
    props: (route) => ({ searchQuery: route.query.q })
  },
  {
    path: '/category/:categorySlug/:subcategorySlug',
    name: 'Category',
    component: Home,
    props: true
  },
  // Redirect any unmatched routes to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on route change
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
