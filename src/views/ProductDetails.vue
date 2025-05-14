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
            
            <div class="product-price">${{ product.price.toFixed(2) }}</div>
            
            <div class="product-availability">
              <span v-if="product.inStock" class="in-stock">✓ In Stock</span>
              <span v-else class="out-of-stock">✗ Out of Stock</span>
            </div>
            
            <div class="product-actions">
              <div class="quantity-selector">
                <button 
                  @click="decrementQuantity" 
                  :disabled="quantity <= 1" 
                  class="quantity-btn"
                >-</button>
                <span class="quantity">{{ quantity }}</span>
                <button 
                  @click="incrementQuantity" 
                  class="quantity-btn"
                >+</button>
              </div>
              
              <button 
                class="add-to-cart-btn" 
                @click="addToCart" 
                :disabled="!product.inStock"
              >
                Add to Cart
              </button>
            </div>
            
            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-features">
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
    const route = useRoute()
    const router = useRouter()

    // Function to fetch product details
    const fetchProduct = async (productId) => {
      try {
        loading.value = true
        error.value = null
        
        // Import products from local JSON file
        const response = await import('@/data/products.json')
        const products = response.default
        
        // Find product by ID
        const productId = parseInt(props.id)
        const foundProduct = products.find(p => p.id === productId)
        
        if (foundProduct) {
          product.value = foundProduct
          console.log('Product loaded:', product.value)
        } else {
          error.value = 'Product not found!'
        }
        
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
        const response = await import('@/data/categories.json')
        categories.value = response.default
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
      quantity.value++
    }

    // Decrement quantity
    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    // Add product to cart
    const addToCart = () => {
      if (!product.value || !product.value.inStock) return
      
      // Get current cart from localStorage
      let cartItems = []
      const storedCart = localStorage.getItem('cartItems')
      
      if (storedCart) {
        cartItems = JSON.parse(storedCart)
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.productId === product.value.id)
      
      if (existingItemIndex !== -1) {
        // If product exists, update quantity
        cartItems[existingItemIndex].quantity += quantity.value
      } else {
        // If not, add new item to cart
        cartItems.push({
          id: Date.now(), // Unique identifier for cart item
          productId: product.value.id,
          name: product.value.name,
          price: product.value.price,
          image: product.value.image,
          quantity: quantity.value
        })
      }
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
      
      // Show confirmation and navigate to cart
      alert(`${quantity.value} ${product.value.name}${quantity.value > 1 ? 's' : ''} added to your cart!`)
      router.push('/cart')
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
      getCategoryName,
      incrementQuantity,
      decrementQuantity,
      addToCart
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
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.quantity-btn {
  background-color: #f0f0f0;
  border: none;
  padding: 8px 15px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  padding: 0 15px;
  font-size: 16px;
  min-width: 40px;
  text-align: center;
}

.add-to-cart-btn {
  flex-grow: 1;
  background-color: #ff7eb8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #e66da3;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.product-description, .product-features {
  margin-top: 20px;
}

.product-description h3, .product-features h3 {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 500;
}

.product-description p {
  line-height: 1.6;
  color: #555;
}

.product-features ul {
  list-style-type: none;
  padding-left: 5px;
}

.product-features li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #ff7eb8;
  font-weight: bold;
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
