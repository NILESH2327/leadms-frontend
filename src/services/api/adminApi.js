import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const adminApi = {
  getUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  getLeads: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.LEADS);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.ANALYTICS);
    return response.data;
  },
};
