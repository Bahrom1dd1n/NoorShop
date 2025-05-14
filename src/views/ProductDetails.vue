<!-- src/views/ProductDetails.vue -->
<template>
  <div class="product-details">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <p>Loading product details...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <router-link to="/" class="btn">Return to Home</router-link>
      </div>
      
      <!-- Product not found -->
      <div v-else-if="!product" class="error-container">
        <p>Product not found!</p>
        <router-link to="/" class="btn">Return to Home</router-link>
      </div>
      
      <!-- Product details content -->
      <div v-else class="product-content">
        <!-- Breadcrumb navigation -->
        <div class="breadcrumb">
          <router-link to="/">Home</router-link> &gt;
          <router-link :to="`/category/${product.category}/all`">{{ getCategoryName(product.category) }}</router-link> &gt;
          <span>{{ product.name }}</span>
        </div>
        
        <!-- Product main section -->
        <div class="product-main">
          <!-- Product image -->
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          
          <!-- Product info -->
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            
            <div class="product-rating">
              <div class="stars">
                <span 
                  v-for="i in 5" 
                  :key="i" 
                  :class="{'filled': i <= Math.floor(product.rating), 'half-filled': i - 0.5 === Math.floor(product.rating)}"
                >★</span>
              </div>
              <span class="rating-text">{{ product.rating }} out of 5</span>
            </div>
            
            <div class="product-price">${{ (product.price / 100).toFixed(2) }}</div>
            
            <div class="product-availability">
              <span v-if="product.quantity > 0" class="in-stock">✓ In Stock ({{ product.quantity }} available)</span>
              <span v-else class="out-of-stock">✗ Out of Stock</span>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <button 
                  @click="decrementQuantity" 
                  :disabled="quantity <= 1 || product.quantity === 0" 
                  class="quantity-btn"
                >-</button>
                <span class="quantity">{{ quantity }}</span>
                <button 
                  @click="incrementQuantity" 
                  :disabled="quantity >= product.quantity"
                  class="quantity-btn"
                >+</button>
              </div>
              
              <button 
                class="add-to-basket-btn" 
                @click="addToBasket" 
                :disabled="product.quantity === 0"
              >
                Add to Basket
              </button>
            </div>
            
            <div class="product-description" v-if="product.description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-features" v-if="product.features && product.features.length">
              <h3>Features</h3>
              <ul>
                <li v-for="(feature, index) in product.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct, getCategories, createBasket, addToBasket as addToBasketApi } from '@/services/api'

export default {
  name: 'ProductDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const product = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const quantity = ref(1)
    const categories = ref([])
    const adding = ref(false)
    const route = useRoute()
    const router = useRouter()

    // Get or create basket ID
    const getBasketId = () => {
      let basketId = localStorage.getItem('basketId')
      if (!basketId) {
        return createBasket().then(basket => {
          basketId = basket.id
          localStorage.setItem('basketId', basketId)
          return basketId
        })
      }
      return Promise.resolve(basketId)
    }

    // Function to fetch product details
    const fetchProduct = async (productId) => {
      try {
        loading.value = true
        error.value = null
        product.value = await getProduct(productId)
        loading.value = false
      } catch (err) {
        console.error('Error loading product:', err)
        error.value = 'Failed to load product details. Please try again.'
        loading.value = false
      }
    }

    // Load categories for breadcrumb
    const loadCategories = async () => {
      try {
        categories.value = await getCategories()
      } catch (err) {
        console.error('Error loading categories:', err)
      }
    }

    // Get category name from slug
    const getCategoryName = (slug) => {
      const category = categories.value.find(c => c.slug === slug)
      return category ? category.name : slug
    }

    // Increment quantity
    const incrementQuantity = () => {
      if (quantity.value < product.value.quantity) {
        quantity.value++
      }
    }

    // Decrement quantity
    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    // Add product to basket
    const addToBasket = async () => {
      if (!product.value || product.value.quantity === 0 || adding.value) return
      
      try {
        adding.value = true
        const basketId = await getBasketId()
        await addToBasketApi(basketId, product.value.id, quantity.value)
        
        // Show confirmation and navigate to basket
        alert(`${quantity.value} ${product.value.name}${quantity.value > 1 ? 's' : ''} added to your basket!`)
        router.push('/basket')
      } catch (err) {
        console.error('Error adding to basket:', err)
        error.value = 'Failed to add item to basket. Please try again.'
      } finally {
        adding.value = false
      }
    }

    // Watch for changes in product ID
    watch(() => props.id, (newId) => {
      console.log('Product ID changed:', newId)
      fetchProduct(newId)
    })

    // Load data on component mount
    onMounted(() => {
      fetchProduct(props.id)
      loadCategories()
    })

    return {
      product,
      loading,
      error,
      quantity,
      adding,
      getCategoryName,
      incrementQuantity,
      decrementQuantity,
      addToBasket
    }
  }
}
</script>

<style scoped>
.product-details {
  padding: 20px 0;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  gap: 20px;
}

.error-container {
  color: #d9534f;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #ff7eb8;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.product-image {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 400px;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-name {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  color: #ddd;
  font-size: 20px;
  display: flex;
}

.stars span {
  margin-right: 2px;
}

.stars .filled {
  color: #ffb700;
}

.stars .half-filled {
  color: #ffb700;
}

.rating-text {
  color: #666;
  font-size: 14px;
}

.product-price {
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.product-availability {
  font-size: 16px;
  margin-bottom: 10px;
}

.in-stock {
  color: #28a745;
  font-weight: 500;
}

.out-of-stock {
  color: #dc3545;
  font-weight: 500;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.quantity-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 10px;
  color: #666;
}

.quantity-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
}

.add-to-basket-btn {
  flex: 1;
  background-color: #ff7eb8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-to-basket-btn:hover:not(:disabled) {
  background-color: #e66da3;
}

.add-to-basket-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.product-description, .product-features {
  margin-top: 20px;
}

.product-description h3, .product-features h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-features ul {
  list-style-type: none;
  padding: 0;
}

.product-features li {
  margin-bottom: 5px;
  padding-left: 20px;
  position: relative;
}

.product-features li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff7eb8;
}

@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    height: 300px;
  }
}
</style>
