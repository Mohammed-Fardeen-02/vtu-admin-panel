import { apiClient } from '../../../../../shared/api/apiClient';
import { Semester, CreateSemesterPayload, UpdateSemesterPayload } from '../types/semesters.types';

export const getSemestersApi = async (): Promise<Semester[]> => {
  const res = await apiClient.get('/academics/semesters');
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};

export const createSemesterApi = async (payload: CreateSemesterPayload): Promise<Semester> => {
  const res = await apiClient.post('/academics/semesters', payload);
  return res.data?.data || res.data;
};

export const updateSemesterApi = async (id: string, payload: UpdateSemesterPayload): Promise<Semester> => {
  const res = await apiClient.patch(`/academics/semesters/${id}`, payload);
  return res.data?.data || res.data;
};

export const deleteSemesterApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/academics/semesters/${id}`);
};
