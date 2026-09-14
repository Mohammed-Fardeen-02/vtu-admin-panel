import { apiClient } from '../../../../../shared/api/apiClient';
import { Unit, CreateUnitPayload, UpdateUnitPayload } from '../types/units.types';

export const getUnitsApi = async (moduleId?: string): Promise<Unit[]> => {
  const res = await apiClient.get('/academics/units', { params: { moduleId } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createUnitApi = async (payload: CreateUnitPayload): Promise<Unit> => {
  const res = await apiClient.post('/academics/units', payload);
  return res.data?.data || res.data;
};

export const updateUnitApi = async (id: string, payload: UpdateUnitPayload): Promise<Unit> => {
  const res = await apiClient.patch(`/academics/units/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteUnitApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/units/${id}`);
};
