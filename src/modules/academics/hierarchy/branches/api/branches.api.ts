import { apiClient } from '../../../../../shared/api/apiClient';
import { Branch, CreateBranchPayload, UpdateBranchPayload } from '../types/branches.types';

export const getBranchesApi = async (): Promise<Branch[]> => {
  const res = await apiClient.get('/academics/branches');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createBranchApi = async (payload: CreateBranchPayload): Promise<Branch> => {
  const res = await apiClient.post('/academics/branches', payload);
  return res.data?.data || res.data;
};

export const updateBranchApi = async (id: string, payload: UpdateBranchPayload): Promise<Branch> => {
  const res = await apiClient.patch(`/academics/branches/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteBranchApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/branches/${id}`);
};

export const bulkImportBranchesApi = async (dtos: any[]): Promise<any> => {
  const res = await apiClient.post('/academics/branches/bulk', dtos);
  return res.data;
};
