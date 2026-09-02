import { create } from 'zustand';
import { tokenStorage } from '../services/storage/tokenStorage';
import { authApi } from '../services/api/authApi';

const initialUser = tokenStorage.getUser();
const initialToken = tokenStorage.getAccessToken();
const initialRefresh = tokenStorage.getRefreshToken();

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  accessToken: initialToken,
  refreshToken: initialRefresh,
  isAuthenticated: !!(initialToken && initialUser),
  role: initialUser?.role || null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      // Response structure from backend contract:
      // { accessToken, refreshToken, user: { id, email, role } }
      // Or wrapped inside response.data
      const payload = response.data || response;
      const accessToken = payload.accessToken;
      const refreshToken = payload.refreshToken;
      const user = payload.user;

      if (!accessToken || !user) {
        throw new Error('Invalid response structure received from authentication server.');
      }

      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setRefreshToken(refreshToken);
      tokenStorage.setUser(user);

      set({
        accessToken,
        refreshToken,
        user,
        role: user.role,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true, user };
    } catch (err) {
      const errorMessage = err?.message || 'Login failed. Please check your credentials.';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      set({ loading: false });
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.message || 'Registration failed. Please try again.';
      set({ loading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Backend logout non-critical error:', err);
    } finally {
      tokenStorage.clearAll();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  updateUser: (partialUser) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...partialUser };
    tokenStorage.setUser(updated);
    set({ user: updated, role: updated.role });
  },

  clearError: () => set({ error: null }),
}));
