// src/main.js
console.log("Vue app starting...")
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Create Vue application
const app = createApp(App)

// Use router
app.use(router)

// Mount app to DOM
app.mount('#app')
