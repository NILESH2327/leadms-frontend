import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const DEFAULT_TRADER_PRODUCTS = [
  {
    _id: 'prod_trader_001',
    name: 'Solar panel 450w high efficiency',
    description: 'Very high quality product',
    basePrice: 24999.00,
    isActive: true,
    createdAt: '2026-09-01T12:00:00.000Z',
  },
];

export const productApi = {
  getTraderProducts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.TRADER);
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) return data;
      if (data?.products && Array.isArray(data.products) && data.products.length > 0) return data.products;
      return DEFAULT_TRADER_PRODUCTS;
    } catch (err) {
      if (err.status === 404) {
        try {
          const fallback = await api.get('/products');
          return fallback.data;
        } catch (fErr) {
          return DEFAULT_TRADER_PRODUCTS;
        }
      }
      return DEFAULT_TRADER_PRODUCTS;
    }
  },

  createTraderProduct: async (productData) => {
    try {
      const response = await api.post(API_ENDPOINTS.PRODUCTS.TRADER, productData);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.post('/products', productData);
        return fallback.data;
      }
      throw err;
    }
  },

  updateTraderProduct: async (id, productData) => {
    try {
      const response = await api.put(API_ENDPOINTS.PRODUCTS.TRADER_BY_ID(id), productData);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.put(`/products/${id}`, productData);
        return fallback.data;
      }
      throw err;
    }
  },

  deleteTraderProduct: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.PRODUCTS.TRADER_BY_ID(id));
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallback = await api.delete(`/products/${id}`);
        return fallback.data;
      }
      throw err;
    }
  },

  // Vendor Marketplace endpoints
  getAvailableProducts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.AVAILABLE);
      return response.data;
    } catch (err) {
      return DEFAULT_TRADER_PRODUCTS;
    }
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
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.LOCKED);
      return response.data;
    } catch (err) {
      return DEFAULT_TRADER_PRODUCTS;
    }
  },
};
