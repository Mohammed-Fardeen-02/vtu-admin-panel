import { apiClient } from '../../../../../shared/api/apiClient';
import { Subject, CreateSubjectPayload, UpdateSubjectPayload } from '../types/subjects.types';

export const getSubjectsApi = async (params?: {
  schemeYear?: string;
  branchCode?: string;
  semester?: number;
  status?: string;
}): Promise<Subject[]> => {
  const res = await apiClient.get('/academics/courses', { params });
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createSubjectApi = async (payload: CreateSubjectPayload): Promise<Subject> => {
  const res = await apiClient.post('/academics/courses', payload);
  return res.data?.data || res.data;
};

export const updateSubjectApi = async (id: string, payload: UpdateSubjectPayload): Promise<Subject> => {
  const res = await apiClient.patch(`/academics/courses/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteSubjectApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/courses/${id}`);
};

export const bulkImportSubjectsApi = async (dtos: any[]): Promise<any> => {
  const res = await apiClient.post('/academics/courses/bulk', dtos);
  return res.data;
};
