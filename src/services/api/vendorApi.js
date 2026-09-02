import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const vendorApi = {
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.VENDOR.PROFILE);
    return response.data;
  },

  updateProfile: async (profileData) => {
    // profileData: { marginPercentage, installationPrice, miscCharges }
    const response = await api.put(API_ENDPOINTS.VENDOR.PROFILE, profileData);
    return response.data;
  },
};
