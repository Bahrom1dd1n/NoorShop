<template>
  <div class="orders">
    <h2>My Orders</h2>
    <div v-if="orders.length === 0">You haven't purchased anything yet.</div>
    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <img :src="order.image" alt="product" />
        <div class="details">
          <h3>{{ order.name }}</h3>
          <p>Price: ${{ order.price }}</p>
          <p>Ordered on: {{ formatDate(order.date) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Simulate local fetch – you can later connect this to real API or localStorage
import ordersData from '../data/orders.json'; // You might need to add this file

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: []
    };
  },
  created() {
    this.fetchOrders(); // 🔹 Highlighted: Called when component is created
  },
  methods: {
    fetchOrders() {
      // 🔹 Highlighted Function: Fetching orders data from local JSON
      this.orders = ordersData;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.orders {
  padding: 20px;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.order-item {
  display: flex;
  align-items: center;
}
.order-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.details {
  margin-left: 20px;
}
</style>
