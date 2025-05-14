// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

// Import views
import Home from '@/views/Home.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import MyOrders from '@/views/MyOrders.vue'
import Basket from '@/views/Basket.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/basket',
    name: 'Basket',
    component: Basket
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
    component: MyOrders
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

export default router
