import { useAuthStore } from '../../../store/useAuthStore';
import { AdminUser } from '../types/type';

export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user as AdminUser | null,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: (email: string, password: string) => store.login(email, password),
    logout: () => store.logout(),
    initAuth: () => store.initAuth(),
    clearError: () => store.clearError(),
  };
};
