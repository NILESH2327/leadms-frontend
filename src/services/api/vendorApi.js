import api from './axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const DEFAULT_PROFILE = {
  marginPercentage: 15,
  installationPrice: 100,
  miscCharges: 50,
};

export const vendorApi = {
  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VENDOR.PROFILE);
      return response.data || DEFAULT_PROFILE;
    } catch {
      const saved = localStorage.getItem('leadms_vendor_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    }
  },

  updateProfile: async (profileData) => {
    // profileData: { marginPercentage, installationPrice, miscCharges }
    try {
      const response = await api.put(API_ENDPOINTS.VENDOR.PROFILE, profileData);
      localStorage.setItem('leadms_vendor_profile', JSON.stringify(profileData));
      return response.data;
    } catch {
      localStorage.setItem('leadms_vendor_profile', JSON.stringify(profileData));
      return profileData;
    }
  },
};
