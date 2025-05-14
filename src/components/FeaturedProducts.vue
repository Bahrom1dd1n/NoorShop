<!-- src/components/FeaturedProducts.vue -->
<template>
  <div class="featured-products">
    <h2 class="featured-title">{{ title }}</h2>
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadProducts" class="btn btn-primary">Try Again</button>
    </div>
    
    <!-- Products grid -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'FeaturedProducts',
  components: {
    ProductCard
  },
  props: {
    title: {
      type: String,
      default: 'Featured Products'
    },
    category: {
      type: String,
      default: null
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  
  setup(props) {
    const products = ref([])
    const loading = ref(true)
    const error = ref(null)
    
    // Function to load products data
    const loadProducts = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Import products from local JSON file
        const response = await import('@/data/products.json')
        let allProducts = response.default
        
        // Filter by category if provided
        if (props.category) {
          allProducts = allProducts.filter(product => product.category === props.category)
        }
        
        // Limit number of products if needed
        products.value = allProducts.slice(0, props.limit)
        
        console.log('Products loaded:', products.value.length)
        loading.value = false
      } catch (err) {
        console.error('Error loading products:', err)
        error.value = 'Failed to load products. Please try again.'
        loading.value = false
      }
    }
    
    // Load products when component is mounted
    onMounted(() => {
      loadProducts()
    })
    
    return {
      products,
      loading,
      error,
      loadProducts
    }
  }
}
</script>

<style scoped>
.featured-products {
  margin-bottom: 40px;
}

.featured-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #777;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #ff7eb8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  color: #f44336;
}

.error-container button {
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }
  
  .featured-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
}
</style>
