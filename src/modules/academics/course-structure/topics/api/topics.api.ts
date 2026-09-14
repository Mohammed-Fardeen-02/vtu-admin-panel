import { apiClient } from '../../../../../shared/api/apiClient';
import { Topic } from '../types/topics.types';

export const getTopicsApi = async (unitId?: string): Promise<Topic[]> => {
  const res = await apiClient.get('/academics/topics', { params: { unitId } });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};
