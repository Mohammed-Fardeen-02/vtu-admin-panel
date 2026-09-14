export type SchemeStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Scheme {
  id: string;
  year: string;
  title: string;
  isDefault?: boolean;
  totalCreditsRequired?: number;
  status: SchemeStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchemePayload {
  year: string;
  title: string;
  isDefault?: boolean;
  totalCreditsRequired?: number;
  status?: SchemeStatus;
}

export interface UpdateSchemePayload extends Partial<CreateSchemePayload> {}
