<!-- src/components/ProductCard.vue -->
<template>
  <div class="product-card">
    <div class="product-image" @click="viewProductDetails">
      <img :src="product.image" :alt="product.name" />
    </div>
    <div class="product-info">
      <h3 class="product-name" @click="viewProductDetails">{{ product.name }}</h3>
      <div class="product-rating">
        <div class="stars">
          <span 
            v-for="i in 5" 
            :key="i" 
            :class="{'filled': i <= Math.floor(product.rating), 'half-filled': i - 0.5 === Math.floor(product.rating)}"
          >★</span>
        </div>
      </div>
      <div class="product-price">${{ product.price.toFixed(2) }}</div>
      <button class="add-to-cart-btn" @click="addToBasket">
        Add to Basket
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { createBasket, addToBasket as addToBasketApi } from '@/services/api'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  
  setup(props) {
    const router = useRouter()
    
    // Function to view product details
    const viewProductDetails = () => {
      console.log(`Viewing product details for: ${props.product.id}`)
      router.push(`/product/${props.product.id}`)
    }
    
    // Function to add product to basket
    const addToBasket = async () => {
      try {
        // Get or create basket ID
        let basketId = localStorage.getItem('basketId')
        if (!basketId) {
          const basket = await createBasket()
          basketId = basket.id
          localStorage.setItem('basketId', basketId)
        }
        
        // Add product to basket
        await addToBasketApi(basketId, props.product.id, 1)
        
        // Show confirmation message
        alert(`${props.product.name} has been added to your basket!`)
        
        // Optionally navigate to basket
        router.push('/basket')
      } catch (error) {
        console.error('Error adding to basket:', error)
        alert('Failed to add item to basket. Please try again.')
      }
    }
    
    return {
      viewProductDetails,
      addToBasket
    }
  }
}
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-image:hover img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 42px;
}

.product-name:hover {
  color: #ff7eb8;
}

.product-rating {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.stars {
  color: #ddd;
  font-size: 18px;
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

.product-price {
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  margin-top: auto;
}

.add-to-cart-btn {
  background-color: #ff7eb8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: #e66da3;
}
</style>
