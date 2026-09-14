import { apiClient } from '../../../shared/api/apiClient';
import { AdminLoginPayload, AdminAuthResponseData, AdminUser } from '../types/type';

export const loginAdminApiFunction = async (payload: AdminLoginPayload): Promise<AdminAuthResponseData> => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data.data || response.data;
};

export const logoutAdminApiFunction = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout', { refreshToken });
};

export const getAdminMeApiFunction = async (): Promise<AdminUser> => {
  const response = await apiClient.get('/users/me');
  return response.data.data || response.data;
};
