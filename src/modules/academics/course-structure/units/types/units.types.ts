export type UnitStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Unit {
  id: string;
  moduleId: string;
  unitNumber: number;
  title: string;
  topicsCount?: number;
  status: UnitStatus;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitPayload {
  moduleId: string;
  unitNumber: number;
  title: string;
  topicsCount?: number;
  status?: UnitStatus;
  order?: number;
}

export interface UpdateUnitPayload extends Partial<CreateUnitPayload> {}
