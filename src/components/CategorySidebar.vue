<!-- src/components/CategorySidebar.vue -->
<template>
  <div class="sidebar-overlay" @click="closeSidebar">
    <div class="category-sidebar" @click.stop>
      <div class="sidebar-header">
        <h2>Categories</h2>
        <button class="close-btn" @click="closeSidebar">×</button>
      </div>
      
      <div v-if="loading" class="loading">
        Loading categories...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else class="categories-list">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-item"
        >
          <div 
            class="category-header" 
            @click="toggleCategory(category.id)"
          >
            <span class="category-icon">{{ getCategoryIcon(category) }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="toggle-icon">{{ expandedCategories.includes(category.id) ? '▼' : '►' }}</span>
          </div>
          
          <div 
            v-if="expandedCategories.includes(category.id)" 
            class="subcategories"
          >
            <div 
              v-for="subcategory in category.subcategories" 
              :key="subcategory.id" 
              class="subcategory-item"
              @click="selectCategory(category.slug, subcategory.slug)"
            >
              {{ subcategory.name }}
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

export default {
  name: 'CategorySidebar',
  emits: ['close'],
  
  setup(props, { emit }) {
    const categories = ref([])
    const loading = ref(true)
    const error = ref(null)
    const expandedCategories = ref([])
    const router = useRouter()

    // Function to load categories from local data
    const loadCategories = async () => {
      try {
        loading.value = true
        // Import categories from local JSON file
        const response = await import('@/data/categories.json')
        categories.value = response.default
        loading.value = false
        
        // Expand first category by default after loading
        if (categories.value.length > 0) {
          expandedCategories.value = [categories.value[0].id]
        }
        
        console.log('Categories loaded:', categories.value)
      } catch (err) {
        console.error('Error loading categories:', err)
        error.value = 'Failed to load categories. Please try again.'
        loading.value = false
      }
    }

    // Function to toggle category expansion
    const toggleCategory = (categoryId) => {
      console.log('Toggling category:', categoryId)
      const index = expandedCategories.value.indexOf(categoryId)
      if (index === -1) {
        expandedCategories.value.push(categoryId)
      } else {
        expandedCategories.value.splice(index, 1)
      }
    }

    // Function to select a category/subcategory and navigate
    const selectCategory = (categorySlug, subcategorySlug) => {
      console.log(`Navigating to category: ${categorySlug}/${subcategorySlug}`)
      router.push(`/category/${categorySlug}/${subcategorySlug}`)
      closeSidebar()
    }

    // Function to close the sidebar
    const closeSidebar = () => {
      console.log('Closing category sidebar')
      emit('close')
    }

    // Function to get category icon
    const getCategoryIcon = (category) => {
      // Map category slugs to emojis
      const iconMap = {
        'electronics': '💻',
        'furniture': '🪑',
        'kitchen': '🍳',
        'sports': '⚽',
        'accessories': '👜',
        'tools': '🔧'
      }
      
      return iconMap[category.slug] || '📁'
    }

    // Load categories when component is mounted
    onMounted(() => {
      loadCategories()
    })

    return {
      categories,
      loading,
      error,
      expandedCategories,
      toggleCategory,
      selectCategory,
      closeSidebar,
      getCategoryIcon
    }
  }
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-start;
}

.category-sidebar {
  width: 300px;
  height: 100%;
  background-color: white;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
}

.close-btn:hover {
  color: #333;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #d9534f;
}

.categories-list {
  padding: 10px 0;
}

.category-item {
  margin-bottom: 5px;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.category-header:hover {
  background-color: #f5f5f5;
}

.category-icon {
  margin-right: 10px;
  font-size: 18px;
}

.category-name {
  flex-grow: 1;
  font-size: 16px;
  color: #333;
}

.toggle-icon {
  font-size: 12px;
  color: #888;
}

.subcategories {
  padding-left: 15px;
  background-color: #f9f9f9;
}

.subcategory-item {
  padding: 8px 15px 8px 35px;
  cursor: pointer;
  color: #555;
  font-size: 14px;
  transition: background-color 0.2s;
}

.subcategory-item:hover {
  background-color: #f0f0f0;
  color: #333;
}
</style>
