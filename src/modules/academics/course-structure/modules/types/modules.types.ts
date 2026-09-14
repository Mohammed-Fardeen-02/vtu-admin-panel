export type ModuleStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Module {
  id: string;
  subjectId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  teachingHours?: number;
  status: ModuleStatus;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModulePayload {
  subjectId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  teachingHours?: number;
  status?: ModuleStatus;
  order?: number;
}

export interface UpdateModulePayload extends Partial<CreateModulePayload> {}
