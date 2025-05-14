<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0">Your cart is empty.</div>
    <div v-else class="cart-items">
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="product" />
        <div class="details">
          <h3>{{ item.name }}</h3>
          <p>${{ item.price }}</p>
          <button @click="purchaseItem(item.id)">Purchase</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cartData from '../data/cart.json';

export default {
  name: 'Cart',
  data() {
    return {
      cartItems: []
    };
  },
  created() {
    this.fetchCartData(); // 🔹 Highlighted: fetch on component mount
  },
  methods: {
    fetchCartData() {
      // 🔹 Highlighted Function: Simulating fetch from local file or localStorage
      this.cartItems = cartData;
    },
    purchaseItem(productId) {
      // 🔹 Highlighted Function: In real app this would POST to backend
      alert(`Product with ID ${productId} purchased!`);
      // Remove from cart after purchase
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    }
  }
};
</script>

<style scoped>
.cart {
  padding: 20px;
}
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cart-item {
  display: flex;
  align-items: center;
}
.cart-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.details {
  margin-left: 20px;
}
button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
