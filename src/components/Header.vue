<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="container header-container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <div class="basket-icon">🛒</div>
          <span>NoorShop</span>
        </router-link>
      </div>

      <div class="search-container">
        <input
          type="text"
          placeholder="Search"
          v-model="searchQuery"
          @keyup.enter="searchProducts"
        />
        <button class="search-button" @click="searchProducts">
          <span>🔍</span>
        </button>
      </div>

      <div class="account-container">
        <router-link to="/account" class="account-link">
          <span>👤 Account</span>
        </router-link>
      </div>
    </div>

    <div class="nav-container">
      <div class="container">
        <nav class="main-nav">
          <button class="nav-btn" @click="openCategorySidebar">
            <span>📋 Categories</span>
          </button>
          <router-link to="/my-orders" class="nav-btn">
            <span>📦 My Orders</span>
          </router-link>
          <router-link to="/basket" class="nav-btn">
            <span>🛒 Basket</span>
            <span v-if="basketCount > 0" class="basket-count">{{ basketCount }}</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Category Sidebar (conditionally rendered) -->
    <CategorySidebar 
      v-if="showCategorySidebar" 
      @close="showCategorySidebar = false" 
    />
  </header>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CategorySidebar from './CategorySidebar.vue'

export default {
  name: 'Header',
  components: {
    CategorySidebar
  },
  setup() {
    const searchQuery = ref('')
    const showCategorySidebar = ref(false)
    const basketItems = ref([])
    const router = useRouter()

    // Computed property to get basket count
    const basketCount = computed(() => {
      return basketItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    // Function to search products
    const searchProducts = () => {
      if (searchQuery.value.trim()) {
        router.push({ 
          path: '/search', 
          query: { q: searchQuery.value } 
        })
      }
    }

    // Function to open category sidebar
    const openCategorySidebar = () => {
      showCategorySidebar.value = true
    }

    // Load basket data on component mount
    onMounted(() => {
      loadBasketData()
    })

    // Function to load basket data from localStorage
    const loadBasketData = () => {
      const storedBasket = localStorage.getItem('basketItems')
      if (storedBasket) {
        basketItems.value = JSON.parse(storedBasket)
      } else {
        basketItems.value = []
      }
    }

    return {
      searchQuery,
      showCategorySidebar,
      basketCount,
      searchProducts,
      openCategorySidebar
    }
  }
}
</script>

<style scoped>
.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: linear-gradient(to right, #ff7eb8, #b073ff);
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 24px;
  font-weight: bold;
}

.basket-icon {
  margin-right: 8px;
  font-size: 20px;
}

.search-container {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 20px;
  display: flex;
  position: relative;
}

.search-container input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.account-container {
  display: flex;
  align-items: center;
}

.account-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
}

.nav-container {
  background-color: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
}

.main-nav {
  display: flex;
  padding: 10px 0;
}

.nav-btn {
  background: none;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
}

.nav-btn:hover {
  background-color: #e9e9e9;
}

.basket-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
</style>
