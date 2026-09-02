import { create } from 'zustand';
import { vendorApi } from '../services/api/vendorApi';

export const useVendorStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await vendorApi.getProfile();
      const prof = data?.data || data;
      set({ profile: prof, loading: false });
      return { success: true, profile: prof };
    } catch (err) {
      const msg = err?.message || 'Failed to fetch vendor profile';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const data = await vendorApi.updateProfile(profileData);
      const updated = data?.data || data;
      set({ profile: updated, loading: false });
      return { success: true, profile: updated };
    } catch (err) {
      const msg = err?.message || 'Failed to update vendor profile';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },
}));
