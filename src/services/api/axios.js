import axios from 'axios';
import { tokenStorage } from '../storage/tokenStorage';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://leadcrmintern-ss-v1.vercel.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network errors or server not responding
    if (!error.response) {
      // Auto-retry once on network/wake-up timeout
      if (originalRequest && (!originalRequest._networkRetryCount || originalRequest._networkRetryCount < 2)) {
        originalRequest._networkRetryCount = (originalRequest._networkRetryCount || 0) + 1;
        await new Promise((res) => setTimeout(res, 1500));
        return api(originalRequest);
      }

      const customError = {
        message: 'Network connection or server waking up. Please retry.',
        status: 0,
      };
      return Promise.reject(customError);
    }

    const { status, data } = error.response;

    // Check for Mongoose Database Cluster Wake-Up / Buffering Timeout
    const isDbTimeout =
      status === 500 ||
      status === 504 ||
      (data?.message &&
        (data.message.includes('buffering timed out') ||
          data.message.includes('users.findOne()') ||
          data.message.includes('MongooseError')));

    // Auto-retry database cluster timeouts up to 2 times without forcing login redirect
    if (isDbTimeout && originalRequest && (!originalRequest._dbRetryCount || originalRequest._dbRetryCount < 2)) {
      originalRequest._dbRetryCount = (originalRequest._dbRetryCount || 0) + 1;
      await new Promise((res) => setTimeout(res, 1500));
      return api(originalRequest);
    }

    // Handle 401 Unauthorized & Refresh Token Logic
    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN) || originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)) {
        return Promise.reject({
          status,
          message: data?.message || 'Invalid credentials or expired session.',
          data,
        });
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        // Don't force redirect if demo session or stored user exists
        const user = tokenStorage.getUser();
        if (!user && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=1';
        }
        return Promise.reject({ status: 401, message: 'Session expired. Please log in again.' });
      }

      try {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
          refreshToken,
        });

        const newAccessToken = response.data?.accessToken || response.data?.data?.accessToken;
        const newRefreshToken = response.data?.refreshToken || response.data?.data?.refreshToken || refreshToken;

        if (newAccessToken) {
          tokenStorage.setAccessToken(newAccessToken);
          tokenStorage.setRefreshToken(newRefreshToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error('Refresh token response missing access token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Do not force window redirect if local user session exists
        const user = tokenStorage.getUser();
        if (!user && typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=1';
        }
        return Promise.reject({
          status: 401,
          message: 'Your session has expired. Please log in again.',
        });
      } finally {
        isRefreshing = false;
      }
    }

    // Clean up raw database buffering messages into user-friendly error guidance
    let errorMessage = data?.message || getErrorMessageByStatus(status);
    if (errorMessage && (errorMessage.includes('buffering timed out') || errorMessage.includes('users.findOne()'))) {
      errorMessage = 'Database cluster connection timed out while waking up. Please click Retry to connect again.';
    }

    // Normalized error output for components/services
    const formattedError = {
      status,
      message: errorMessage,
      errors: data?.errors || null,
      raw: data,
    };

    return Promise.reject(formattedError);
  }
);

function getErrorMessageByStatus(status) {
  switch (status) {
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return 'Validation failed. Please check your input fields.';
    case 500:
      return 'Server error occurred. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export default api;
