import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  confirmEmail: async (token) => {
    const response = await api.get(`${API_ENDPOINTS.AUTH.CONFIRM_EMAIL}?token=${token}`);
    return response.data;
  },

  logout: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  inviteUser: async (inviteData) => {
    try {
      const response = await api.post('/auth/invite-team-member', inviteData);
      return response.data;
    } catch (err) {
      if (err.status === 404) {
        const fallbackResponse = await api.post(API_ENDPOINTS.AUTH.INVITE, inviteData);
        return fallbackResponse.data;
      }
      throw err;
    }
  },

  acceptInvitation: async (data) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ACCEPT_INVITATION, data);
    return response.data;
  },
};
