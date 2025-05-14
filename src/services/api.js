import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transformProduct = (backendProduct) => {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: backendProduct.price / 100, // Assuming backend price is in cents
    rating: 4, // Default rating since backend doesn't have it
    image: backendProduct.image.startsWith('/') ? backendProduct.image : `/images/products/${backendProduct.image}`,
    category: backendProduct.category_id, // Will need to be mapped to category name
    description: backendProduct.description || "Product description", // Use backend description if available
    features: backendProduct.features || [], // Use backend features if available
    inStock: backendProduct.quantity > 0,
    quantity: backendProduct.quantity || 0  // Add the quantity field
  };
};

export const transformBasketProduct = (backendBasketProduct) => {
  return {
    id: backendBasketProduct.id,
    productId: backendBasketProduct.product_id,
    name: backendBasketProduct.name || '',
    price: backendBasketProduct.price / 100,
    quantity: backendBasketProduct.quantity,
    image: backendBasketProduct.image || ''
  };
};

export const getProducts = async () => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ]);

    // Create a map of category IDs to names
    const categoryMap = (categoriesResponse.data.Data.category || []).reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    // Transform products and map category IDs to names
    const products = productsResponse.data.Data.Products || [];
    return products.map(product => ({
      ...transformProduct(product),
      category: categoryMap[product.category_id] || 'uncategorized'
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return transformProduct(response.data.Data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.Data.category || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Basket related functions
export const createBasket = async () => {
  try {
    const response = await api.post('/basket', {
      customer_id: "00000000-0000-0000-0000-000000000000", // Guest user ID
      total_sum: 0 // Initial total sum
    });
    return response.data.Data || response.data; // Handle both response formats
  } catch (error) {
    console.error('Error creating basket:', error);
    throw error;
  }
};

export const getBasket = async (basketId) => {
  try {
    const response = await api.get(`/basket/${basketId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching basket ${basketId}:`, error);
    throw error;
  }
};

export const addToBasket = async (basketId, productId, quantity) => {
  try {
    const response = await api.post('/basketProduct', {
      basket_id: basketId,
      product_id: productId,
      quantity: quantity
    });
    return transformBasketProduct(response.data.Data);
  } catch (error) {
    console.error('Error adding product to basket:', error);
    throw error;
  }
};

export const updateBasketProduct = async (basketProductId, quantity) => {
  try {
    const basketId = localStorage.getItem('basketId');
    if (!basketId) {
      throw new Error('No basket ID found');
    }
    
    console.log('Updating basket product with:', {
      basketProductId,
      basketId,
      quantity
    });
    
    const response = await api.put(`/basketProduct/${basketProductId}`, 
      { quantity: quantity },
      { params: { basket_id: basketId } }
    );
    return transformBasketProduct(response.data.Data);
  } catch (error) {
    console.error('Error updating basket product:', error);
    console.error('Request details:', {
      basketProductId,
      basketId: localStorage.getItem('basketId'),
      quantity
    });
    throw error;
  }
};

export const removeFromBasket = async (basketProductId) => {
  try {
    await api.delete(`/basketProduct/${basketProductId}`);
  } catch (error) {
    console.error('Error removing product from basket:', error);
    throw error;
  }
};

export const getBasketProducts = async (basketId) => {
  try {
    const response = await api.get('/basketProducts', {
      params: { basket_id: basketId }
    });
    
    console.log('Basket products response:', response.data); // Debug log
    
    // Handle different response formats
    const basketProducts = response.data.Data?.BasketProducts || response.data.Data || [];
    
    if (!Array.isArray(basketProducts)) {
      console.error('Invalid basket products response format:', basketProducts);
      return [];
    }
    
    // Get product details for each basket product
    const productDetailsPromises = basketProducts.map(async (basketProduct) => {
      try {
        const productResponse = await api.get(`/product/${basketProduct.product_id}`);
        const product = productResponse.data.Data;
        
        return {
          id: basketProduct.id,
          productId: basketProduct.product_id,
          name: product.name,
          price: product.price / 100,
          quantity: basketProduct.quantity,
          image: product.image || ''
        };
      } catch (err) {
        console.error(`Error fetching product ${basketProduct.product_id}:`, err);
        return null;
      }
    });
    
    const products = await Promise.all(productDetailsPromises);
    return products.filter(product => product !== null);
  } catch (error) {
    console.error('Error fetching basket products:', error);
    throw error;
  }
};

export default api; 