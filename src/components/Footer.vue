<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo">
            <div class="cart-icon">🛒</div>
            <span>NoorShop</span>
          </div>
          <p class="slogan">YOUR #1 ONLINE STOP DESTINATION FOR EVERYDAY TECH, TOOLS, AND LIFESTYLE ESSENTIALS ALL IN ONE PLACE.</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-column">
            <h3>About</h3>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/categories">Categories</router-link></li>
              <li><router-link to="/about">About us</router-link></li>
              <li><router-link to="/faq">FAQs</router-link></li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>Contact us</h3>
            <ul>
              <li><a href="mailto:support@noorshop.com">support@noorshop.com</a></li>
              <li><a href="tel:+9987131 10909">+9987131 10909</a></li>
              <li>Mon-Fri, 9AM–6PM</li>
              <li>Mirzo Ulug'bek, 9 Ziyolilar St</li>
            </ul>
          </div>
          
          <div class="footer-column">
            <h3>Follow us</h3>
            <div class="social-icons">
              <a href="#" class="social-icon facebook">
                <span>Facebook</span>
              </a>
              <a href="#" class="social-icon instagram">
                <span>Instagram</span>
              </a>
              <a href="#" class="social-icon twitter">
                <span>Twitter</span>
              </a>
              <a href="#" class="social-icon linkedin">
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© {{ currentYear }} NoorShop. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Footer',
  setup() {
    // Get current year for copyright
    const currentYear = computed(() => new Date().getFullYear())
    
    return {
      currentYear
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: #333;
  color: #f8f8f8;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 20px;
}

.footer-logo {
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: white;
}

.cart-icon {
  margin-right: 8px;
  font-size: 20px;
}

.slogan {
  font-size: 12px;
  line-height: 1.5;
  color: #ccc;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: white;
  font-weight: 500;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 8px;
}

.footer-column a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-column a:hover {
  color: #ff7eb8;
}

.social-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #555;
  transition: background-color 0.2s;
  color: white;
  text-decoration: none;
}

.social-icon span {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.social-icon.facebook:hover {
  background-color: #3b5998;
}

.social-icon.instagram:hover {
  background-color: #e1306c;
}

.social-icon.twitter:hover {
  background-color: #1da1f2;
}

.social-icon.linkedin:hover {
  background-color: #0077b5;
}

.footer-bottom {
  border-top: 1px solid #555;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #aaa;
}

/* Social icons with emoji */
.social-icon.facebook::before {
  content: "👍";
}

.social-icon.instagram::before {
  content: "📷";
}

.social-icon.twitter::before {
  content: "🐦";
}

.social-icon.linkedin::before {
  content: "💼";
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style>
