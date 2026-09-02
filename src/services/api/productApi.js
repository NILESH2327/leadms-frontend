import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const productApi = {
  getTraderProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.get(API_ENDPOINTS.PRODUCTS.TRADER);
        return fallback.data;
      }
      throw err;
    }
  },

  createTraderProduct: async (productData) => {
    // productData: { name, description, basePrice, isActive }
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.post(API_ENDPOINTS.PRODUCTS.TRADER, productData);
        return fallback.data;
      }
      throw err;
    }
  },

  updateTraderProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.put(API_ENDPOINTS.PRODUCTS.TRADER_BY_ID(id), productData);
        return fallback.data;
      }
      throw err;
    }
  },

  deleteTraderProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.delete(API_ENDPOINTS.PRODUCTS.TRADER_BY_ID(id));
        return fallback.data;
      }
      throw err;
    }
  },

  // Vendor Marketplace endpoints
  getAvailableProducts: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.AVAILABLE);
    return response.data;
  },

  lockProduct: async (id) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.LOCK(id));
    return response.data;
  },

  unlockProduct: async (id) => {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.UNLOCK(id));
    return response.data;
  },

  getLockedProducts: async () => {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.LOCKED);
    return response.data;
  },
};
