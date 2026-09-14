export type SemesterStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Semester {
  id: string;
  semesterNumber: number;
  title: string;
  status: SemesterStatus;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSemesterPayload {
  semesterNumber: number;
  title: string;
  status?: SemesterStatus;
  order?: number;
}

export interface UpdateSemesterPayload extends Partial<CreateSemesterPayload> {}
