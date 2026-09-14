export type StatusType = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Scheme {
  id: string;
  schemeYear: string;
  year?: string;
  title: string;
  name?: string;
  isDefault?: boolean;
  totalCreditsRequired?: number;
  status: StatusType;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  status: StatusType;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  department?: string;
  departmentId?: string;
  deptRef?: Department;
  status: StatusType;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface Semester {
  id: string;
  number: number;
  semesterNumber?: number;
  title: string;
  label?: string;
  status: StatusType;
}

export interface CourseType {
  id: string;
  code: string;
  name: string;
  status: StatusType;
}

export interface UnitItem {
  id: string;
  unitNumber: string;
  title: string;
  topics: string;
  description?: string;
}

export interface ModuleItem {
  id: string;
  moduleNumber: number;
  title: string;
  description?: string;
  units: UnitItem[];
}

export interface Course {
  id: string;
  subjectCode: string;
  title: string;
  schemeId?: string;
  branchId?: string;
  semesterId?: string;
  courseTypeId?: string;
  scheme?: Scheme;
  branch?: Branch;
  semester?: Semester;
  credits?: number;
  syllabusModules?: ModuleItem[];
  syllabusUnits?: any;
  status: StatusType;
}

export interface College {
  id: string;
  code: string;
  name: string;
  region: string;
  type: string;
  status: StatusType;
}
