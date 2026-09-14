import { create } from 'zustand';
import {
  loginAdminApiFunction,
  logoutAdminApiFunction,
  getAdminMeApiFunction,
} from '../modules/auth/apifunction/apiFunction';
import { AdminUser } from '../modules/auth/types/type';
import { toast } from '../shared/components/toast/ToastContext';

export type { AdminUser };

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('vtu_admin_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('vtu_admin_access_token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const payload = await loginAdminApiFunction({ email, password });
      const { user, accessToken, refreshToken } = payload;

      if (user.role !== 'ADMIN') {
        const errorMsg = 'Access Denied: Only Admin accounts can access the Governance Console.';
        set({
          isLoading: false,
          error: errorMsg,
        });
        toast.error(errorMsg, 'Access Denied');
        return false;
      }

      localStorage.setItem('vtu_admin_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('vtu_admin_refresh_token', refreshToken);
      }
      localStorage.setItem('vtu_admin_user', JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success(`Welcome back, ${user.name || 'Admin'}!`, 'Authentication Successful');
      return true;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Invalid email or password.';
      const errorMessageStr = typeof msg === 'string' ? msg : JSON.stringify(msg);
      set({
        isLoading: false,
        error: errorMessageStr,
      });
      toast.error(errorMessageStr, 'Login Failed');
      return false;
    }
  },

  logout: () => {
    const refreshToken = localStorage.getItem('vtu_admin_refresh_token');
    if (refreshToken) {
      logoutAdminApiFunction(refreshToken).catch(() => {});
    }
    localStorage.removeItem('vtu_admin_access_token');
    localStorage.removeItem('vtu_admin_refresh_token');
    localStorage.removeItem('vtu_admin_user');

    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    toast.info('Logged out successfully', 'Session Ended');
  },

  initAuth: async () => {
    const token = localStorage.getItem('vtu_admin_access_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const user = await getAdminMeApiFunction();

      if (user.role !== 'ADMIN') {
        localStorage.removeItem('vtu_admin_access_token');
        localStorage.removeItem('vtu_admin_user');
        set({ user: null, isAuthenticated: false });
        return;
      }

      localStorage.setItem('vtu_admin_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('vtu_admin_access_token');
      localStorage.removeItem('vtu_admin_user');
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

