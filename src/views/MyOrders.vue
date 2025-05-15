<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">My Orders</h1>
      
      <div v-if="loading" class="loading-container">
        <p>Loading your orders...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="orders.length === 0" class="empty-orders">
        <div class="empty-content">
          <span class="empty-icon">📦</span>
          <h2>No Orders Yet</h2>
          <p>Start shopping to see your orders here!</p>
          <router-link to="/" class="btn">Browse Products</router-link>
        </div>
      </div>
      
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-date">Ordered on {{ formatDate(order.orderDate) }}</span>
              <span class="order-id">Order #{{ order.id.slice(0, 8) }}</span>
            </div>
            <div class="order-status">
              <span class="status-badge">Completed</span>
            </div>
          </div>
          
          <div class="order-content">
            <div class="product-image">
              <img :src="order.image" :alt="order.name" />
            </div>
            
            <div class="order-details">
              <h3 class="product-name">{{ order.name }}</h3>
              <div class="order-meta">
                <p class="quantity">Quantity: {{ order.quantity }}</p>
                <p class="price">Total: ${{ order.totalPrice.toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="order-actions">
              <button class="btn btn-secondary" @click="reorder(order)">
                Buy Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBasketProducts, createBasket, addToBasket, getOrders } from '@/services/api'

export default {
  name: 'MyOrders',
  setup() {
    const router = useRouter()
    const orders = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchOrders = async () => {
      try {
        loading.value = true
        error.value = null
        
        // Fetch orders from the API
        orders.value = await getOrders()
      } catch (err) {
        console.error('Error fetching orders:', err)
        error.value = 'Failed to load orders. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const reorder = async (order) => {
      try {
        // Get or create basket ID
        let basketId = localStorage.getItem('basketId')
        if (!basketId) {
          const basket = await createBasket()
          basketId = basket.id
          localStorage.setItem('basketId', basketId)
        }
        
        // Add product to basket
        await addToBasket(basketId, order.productId, order.quantity)
        
        // Navigate to basket
        router.push('/basket')
      } catch (err) {
        console.error('Error reordering:', err)
        error.value = 'Failed to add item to basket. Please try again.'
      }
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      formatDate,
      reorder
    }
  }
}
</script>

<style scoped>
.orders-page {
  padding: 40px 0;
}

.page-title {
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 600;
  color: #333;
}

.loading-container,
.error-container,
.empty-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.empty-content h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.empty-content p {
  color: #666;
  margin-bottom: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.order-date {
  font-size: 14px;
  color: #666;
}

.order-id {
  font-size: 12px;
  color: #999;
}

.status-badge {
  background-color: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.order-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  padding: 20px;
  align-items: center;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.order-meta {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .order-content {
    grid-template-columns: auto 1fr;
  }
  
  .order-actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
}

@media (max-width: 480px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .order-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .product-image {
    margin: 0 auto;
  }
  
  .order-meta {
    justify-content: center;
  }
  
  .order-actions {
    justify-content: center;
  }
}
</style>
