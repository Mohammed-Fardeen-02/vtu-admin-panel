export type BranchStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Branch {
  id: string;
  code: string;
  name: string;
  department?: string;
  departmentId?: string;
  status: BranchStatus;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CreateBranchPayload {
  code: string;
  name: string;
  department?: string;
  departmentId?: string;
  status?: BranchStatus;
  order?: number;
}

export interface UpdateBranchPayload extends Partial<CreateBranchPayload> {}
