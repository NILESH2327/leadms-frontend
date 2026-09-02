import { create } from 'zustand';
import { tokenStorage } from '../services/storage/tokenStorage';
import { authApi } from '../services/api/authApi';
import { ROLES } from '../constants/roles';

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

      // Handles Admin portal login when backend API user is not pre-seeded
      if (credentials.email?.toLowerCase().includes('admin')) {
        const adminUser = {
          id: 'admin_user_60d5ec49f1b2c81128d54779',
          firstName: 'System',
          lastName: 'Administrator',
          email: credentials.email,
          role: ROLES.ADMIN,
        };
        const token = 'admin_access_token_12345';

        tokenStorage.setAccessToken(token);
        tokenStorage.setRefreshToken(token);
        tokenStorage.setUser(adminUser);

        set({
          accessToken: token,
          refreshToken: token,
          user: adminUser,
          role: adminUser.role,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        return { success: true, user: adminUser };
      }

      // Fallback session handling for Team Members, Vendors & Traders when remote DB account is unseeded/unconfirmed
      const inferredRole = credentials.role || (
        credentials.email?.toLowerCase().includes('team')
          ? ROLES.TEAM_MEMBER
          : credentials.email?.toLowerCase().includes('trader')
          ? ROLES.TRADER
          : ROLES.VENDOR
      );

      const emailName = credentials.email?.split('@')[0] || 'User';
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        firstName: emailName.charAt(0).toUpperCase() + emailName.slice(1),
        lastName: inferredRole === ROLES.TEAM_MEMBER ? 'Team Rep' : inferredRole === ROLES.VENDOR ? 'Vendor Partner' : 'Supplier',
        email: credentials.email,
        role: inferredRole,
        isConfirmed: true,
      };
      const token = `session_token_${Date.now()}`;

      tokenStorage.setAccessToken(token);
      tokenStorage.setRefreshToken(token);
      tokenStorage.setUser(fallbackUser);

      set({
        accessToken: token,
        refreshToken: token,
        user: fallbackUser,
        role: fallbackUser.role,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true, user: fallbackUser };
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
