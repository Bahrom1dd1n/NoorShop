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
        // Import products from local JSON file
        const response = await import('@/data/products.json')
        products.value = response.default
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
        const response = await import('@/data/categories.json')
        categories.value = response.default
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
          product.description.toLowerCase().includes(query)
        )
      }
      
      // Filter by category
      if (props.categorySlug) {
        result = result.filter(product => product.category === props.categorySlug)
        
        // If we have a subcategory, we would filter further
        // Note: This would require subcategory to be part of product data
        // For now, we'll just filter by main category
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
  background-color: #50ff50;
  color: #000;
  font-weight: bold;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 30px;
}

.shop-now-btn:hover {
  background-color: #3ecc3e;
}

.hero-image {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-image img {
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
}

.section-title {
  margin: 20px 0;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.section-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.loading-container, .error-container, .no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: #666;
  font-size: 18px;
}

.error-container {
  color: #d9534f;
}

@media (max-width: 768px) {
  .hero-banner {
    flex-direction: column;
    height: auto;
  }
  
  .hero-content {
    padding: 20px;
    text-align: center;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-image {
    width: 100%;
    padding: 20px;
  }
}
</style>
