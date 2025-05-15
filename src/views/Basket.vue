<template>
  <div class="cart">
    <div class="container">
      <h2 class="cart-title">Your Basket</h2>
      
      <div v-if="loading" class="loading-container">
        <p>Loading basket...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <router-link to="/" class="btn">Continue Shopping</router-link>
      </div>
      
      <div v-else-if="basketItems.length === 0" class="empty-cart">
        <p>Your basket is empty.</p>
        <router-link to="/" class="btn">Continue Shopping</router-link>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in basketItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
              
              <div class="item-actions">
                <div class="quantity-selector">
                  <button 
                    @click="updateQuantity(item.id, item.quantity - 1)" 
                    :disabled="item.quantity <= 1 || updating"
                    class="quantity-btn"
                  >-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    :disabled="updating"
                    class="quantity-btn"
                  >+</button>
                </div>
                
                <button 
                  @click="removeItem(item.id)" 
                  :disabled="updating"
                  class="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
            
            <div class="item-total">
              <div class="total-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
              <button 
                @click="purchaseItem(item)" 
                :disabled="updating"
                class="purchase-btn"
              >
                Purchase Now
              </button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary">
          <h3>Basket Summary</h3>
          <div class="summary-row">
            <span>Total Items</span>
            <span>{{ basketItems.length }}</span>
          </div>
          <div class="summary-row">
            <span>Total Value</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="help-text">
            Click "Purchase Now" on individual items to buy them separately.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBasketProducts, updateBasketProduct, removeFromBasket, createBasket, createOrder } from '@/services/api'

export default {
  name: 'Basket',
  setup() {
    const basketItems = ref([])
    const loading = ref(true)
    const error = ref(null)
    const updating = ref(false)
    const router = useRouter()

    // Get or create basket ID
    const getBasketId = async () => {
      try {
        let basketId = localStorage.getItem('basketId')
        if (!basketId) {
          const basket = await createBasket()
          if (!basket || !basket.id) {
            console.error('Invalid basket response:', basket)
            return null
          }
          basketId = basket.id
          localStorage.setItem('basketId', basketId)
        }
        return basketId
      } catch (err) {
        console.error('Error in getBasketId:', err)
        return null
      }
    }

    // Computed property for basket subtotal
    const subtotal = computed(() => {
      return basketItems.value.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    // Load basket data
    const loadBasket = async () => {
      try {
        loading.value = true
        error.value = null
        
        const basketId = await getBasketId()
        if (!basketId) {
          error.value = 'Failed to create or get basket ID'
          loading.value = false
          return
        }

        const products = await getBasketProducts(basketId)
        
        if (!Array.isArray(products)) {
          console.error('Invalid products response:', products)
          error.value = 'Invalid response from server'
          loading.value = false
          return
        }
        
        basketItems.value = products
        loading.value = false
      } catch (err) {
        console.error('Error loading basket:', err)
        error.value = err.message || 'Failed to load basket. Please try again.'
        loading.value = false
      }
    }

    // Update item quantity
    const updateQuantity = async (itemId, newQuantity) => {
      if (newQuantity < 1 || updating.value) return
      
      try {
        updating.value = true
        // For now, we'll just show an alert since backend doesn't support quantity updates
        alert('Quantity update is not supported yet. Please remove the item and add it again with the desired quantity.')
        await loadBasket() // Reload basket to refresh the view
      } catch (err) {
        console.error('Error updating quantity:', err)
        error.value = 'Failed to update quantity. Please try again.'
      } finally {
        updating.value = false
      }
    }

    // Remove item from basket
    const removeItem = async (itemId) => {
      if (updating.value) return

      try {
        updating.value = true
        await removeFromBasket(itemId)
        await loadBasket() // Reload basket to get updated data
      } catch (err) {
        console.error('Error removing item:', err)
        error.value = 'Failed to remove item. Please try again.'
      } finally {
        updating.value = false
      }
    }

    // Purchase individual item
    const purchaseItem = async (item) => {
      if (updating.value) return

      try {
        updating.value = true
        
        // Create order with proper price calculation
        await createOrder(
          item.productId,
          null, // Using guest user ID
          item.quantity,
          item.price // Price is already in dollars, API will convert to cents
        )

        // Remove item from basket after successful purchase
        await removeFromBasket(item.id)
        
        // Show success message
        alert(`Thank you for your purchase! ${item.quantity} x ${item.name} has been ordered.`)
        
        // Reload basket to update the view
        await loadBasket()
      } catch (err) {
        console.error('Error during purchase:', err)
        error.value = 'Failed to complete purchase. Please try again.'
      } finally {
        updating.value = false
      }
    }

    // Load basket data on component mount
    onMounted(() => {
      loadBasket()
    })

    return {
      basketItems,
      loading,
      error,
      updating,
      subtotal,
      updateQuantity,
      removeItem,
      purchaseItem
    }
  }
}
</script>

<style scoped>
.cart {
  padding: 40px 0;
}

.cart-title {
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.loading-container, .error-container, .empty-cart {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-container {
  color: #dc3545;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-name {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.item-price {
  color: #666;
  margin: 0;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 15px;
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
  font-size: 16px;
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
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn:hover {
  text-decoration: underline;
}

.item-total {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.total-price {
  font-size: 18px;
  font-weight: 500;
}

.purchase-btn {
  background-color: #ff7eb8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.purchase-btn:hover:not(:disabled) {
  background-color: #e66da3;
}

.purchase-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.help-text {
  margin-top: 20px;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.cart-summary {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: fit-content;
}

.cart-summary h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
}
</style>
