export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    CONFIRM_EMAIL: '/auth/confirm-email',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ACCEPT_INVITATION: '/auth/accept-invitation',
    INVITE: '/auth/invite',
  },
  VENDOR: {
    PROFILE: '/vendor/profile',
  },
  PRODUCTS: {
    TRADER: '/products/trader',
    TRADER_BY_ID: (id) => `/products/trader/${id}`,
    AVAILABLE: '/products/available',
    LOCK: (id) => `/products/${id}/lock`,
    UNLOCK: (id) => `/products/${id}/unlock`,
    LOCKED: '/products/locked',
  },
  LEADS: {
    BASE: '/leads',
    ASSIGN: (id) => `/leads/${id}/assign`,
    QUOTE: (id) => `/leads/${id}/quote`,
  },
  ADMIN: {
    USERS: '/admin/users',
    LEADS: '/admin/leads',
    ANALYTICS: '/admin/analytics',
  },
};
