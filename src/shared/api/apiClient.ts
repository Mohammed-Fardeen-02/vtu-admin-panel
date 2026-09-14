import axios from 'axios';
import { toast } from '../components/toast/ToastContext';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vtu_admin_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('vtu_admin_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = res.data.accessToken || res.data.data?.accessToken;
          const newRefreshToken = res.data.refreshToken || res.data.data?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('vtu_admin_access_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('vtu_admin_refresh_token', newRefreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch {
          localStorage.removeItem('vtu_admin_access_token');
          localStorage.removeItem('vtu_admin_refresh_token');
          localStorage.removeItem('vtu_admin_user');
          window.location.href = '/login';
        }
      }
    }

    // Trigger toast notification for errors (except silent 401 retry)
    const serverMessage = error.response?.data?.message;
    let errorMessage = 'An unexpected network or server error occurred.';
    if (Array.isArray(serverMessage)) {
      errorMessage = serverMessage.join('. ');
    } else if (typeof serverMessage === 'string') {
      errorMessage = serverMessage;
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (error.response?.status !== 401) {
      toast.error(errorMessage, error.response?.status ? `HTTP ${error.response.status}` : 'Connection Error');
    }

    return Promise.reject(error);
  },
);
