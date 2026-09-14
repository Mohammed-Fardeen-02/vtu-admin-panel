import { apiClient } from '../../../../../shared/api/apiClient';
import { Module, CreateModulePayload, UpdateModulePayload } from '../types/modules.types';

export const getModulesApi = async (subjectId?: string): Promise<Module[]> => {
  const res = await apiClient.get('/academics/modules', { params: { subjectId } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createModuleApi = async (payload: CreateModulePayload): Promise<Module> => {
  const res = await apiClient.post('/academics/modules', payload);
  return res.data?.data || res.data;
};

export const updateModuleApi = async (id: string, payload: UpdateModulePayload): Promise<Module> => {
  const res = await apiClient.patch(`/academics/modules/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteModuleApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/modules/${id}`);
};
