export type SubjectCategory = 'THEORY' | 'LAB' | 'INTEGRATED' | 'ELECTIVE';
export type SubjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Subject {
  id: string;
  code: string;
  name: string;
  branchCode: string;
  schemeYear: string;
  semester: number;
  credits: number;
  category: SubjectCategory;
  status: SubjectStatus;
  order?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectPayload {
  code: string;
  name: string;
  branchCode: string;
  schemeYear: string;
  semester: number;
  credits: number;
  category: SubjectCategory;
  status?: SubjectStatus;
  order?: number;
  description?: string;
}

export interface UpdateSubjectPayload extends Partial<CreateSubjectPayload> {}
