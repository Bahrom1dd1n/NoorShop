<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <div class="container">
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <h1>Shop the<br>Latest Deals</h1>
          <router-link to="/category/electronics/all" class="btn shop-now-btn">Shop Now</router-link>
        </div>
        <div class="hero-image">
          <!--<img src="/images/products/headphones.jpg" alt="Latest deals" /> -->
        </div>
      </div>

      <!-- Title section based on context -->
      <div class="section-title">
        <h2 v-if="categoryName">{{ categoryName }}</h2>
        <h2 v-else-if="searchQuery">Search results for: "{{ searchQuery }}"</h2>
        <h2 v-else>Featured Products</h2>
      </div>

      <!-- Products grid -->
      <div v-if="loading" class="loading-container">
        <p>Loading products...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="no-products">
        <p>No products found. Try different search criteria.</p>
      </div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts, getCategories } from '@/services/api'

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    categorySlug: {
      type: String,
      default: ''
    },
    subcategorySlug: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const products = ref([])
    const categories = ref([])
    const loading = ref(true)
    const error = ref(null)
    const categoryName = ref('')

    // Load all products
    const loadProducts = async () => {
      try {
        loading.value = true
        products.value = await getProducts()
        loading.value = false
        console.log('Products loaded:', products.value.length)
      } catch (err) {
        console.error('Error loading products:', err)
        error.value = 'Failed to load products. Please try again.'
        loading.value = false
      }
    }

    // Load categories for category name display
    const loadCategories = async () => {
      try {
        categories.value = await getCategories()
        updateCategoryName()
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }

    // Update category name based on slugs
    const updateCategoryName = () => {
      if (!props.categorySlug) return
      
      const category = categories.value.find(c => c.slug === props.categorySlug)
      if (!category) return
      
      if (props.subcategorySlug && props.subcategorySlug !== 'all') {
        const subcategory = category.subcategories.find(s => s.slug === props.subcategorySlug)
        if (subcategory) {
          categoryName.value = `${subcategory.name} in ${category.name}`
        } else {
          categoryName.value = category.name
        }
      } else {
        categoryName.value = category.name
      }
    }

    // Filter products based on search query and category
    const filteredProducts = computed(() => {
      let result = [...products.value]
      
      // Filter by search query
      if (props.searchQuery) {
        const query = props.searchQuery.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query))
        )
      }
      
      // Filter by category
      if (props.categorySlug) {
        result = result.filter(product => product.category === props.categorySlug)
      }
      
      return result
    })

    // Watch for changes in props to update filtered products
    watch(() => props.searchQuery, () => {
      console.log('Search query changed:', props.searchQuery)
    })
    
    watch([() => props.categorySlug, () => props.subcategorySlug], () => {
      console.log('Category changed:', props.categorySlug, props.subcategorySlug)
      updateCategoryName()
    })

    // Load data on component mount
    onMounted(() => {
      loadProducts()
      loadCategories()
    })

    return {
      products,
      loading,
      error,
      filteredProducts,
      categoryName
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 60vh;
}

.hero-banner {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #9c3ce7, #e667b0);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  height: 300px;
}

.hero-content {
  flex: 1;
  padding: 30px;
  color: white;
}

.hero-content h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.shop-now-btn {
  background-color: white;
  color: #9c3ce7;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  transition: transform 0.2s;
}

.shop-now-btn:hover {
  transform: scale(1.05);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.hero-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.section-title {
  margin: 30px 0;
  text-align: center;
}

.section-title h2 {
  font-size: 32px;
  color: #333;
  font-weight: 600;
}

.loading-container, .error-container, .no-products {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-container {
  color: #dc3545;
}
</style>
