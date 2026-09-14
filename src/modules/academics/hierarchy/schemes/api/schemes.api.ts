import { apiClient } from '../../../../../shared/api/apiClient';
import { Scheme, CreateSchemePayload, UpdateSchemePayload } from '../types/schemes.types';

export const getSchemesApi = async (): Promise<Scheme[]> => {
  const res = await apiClient.get('/academics/schemes');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createSchemeApi = async (payload: CreateSchemePayload): Promise<Scheme> => {
  const res = await apiClient.post('/academics/schemes', payload);
  return res.data?.data || res.data;
};

export const updateSchemeApi = async (id: string, payload: UpdateSchemePayload): Promise<Scheme> => {
  const res = await apiClient.patch(`/academics/schemes/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteSchemeApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/schemes/${id}`);
};

export const bulkImportSchemesApi = async (dtos: any[]): Promise<any> => {
  const res = await apiClient.post('/academics/schemes/bulk', dtos);
  return res.data;
};
