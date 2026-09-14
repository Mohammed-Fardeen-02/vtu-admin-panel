export type ItemStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface AcademicBranch {
  id: string;
  code: string; // e.g. 'CSE', 'ECE', 'ISE', 'AIML', 'EEE', 'CIVIL', 'MECH'
  name: string; // e.g. 'Computer Science & Engineering'
  description?: string;
  status: ItemStatus;
  order: number;
}

export interface AcademicScheme {
  id: string;
  year: string; // e.g. '2018', '2021', '2022', '2025'
  title: string; // e.g. '2025 NEP Model Scheme'
  isDefault: boolean;
  status: ItemStatus;
  description?: string;
  totalCreditsRequired: number;
}

export interface AcademicSemester {
  id: string;
  semesterNumber: number; // 1 to 8
  title: string; // 'Semester 5'
  description?: string;
  status: ItemStatus;
  order: number;
}

export type SubjectCategory = 'THEORY' | 'LAB' | 'INTEGRATED' | 'ELECTIVE';

export interface AcademicSubject {
  id: string;
  code: string; // e.g. '21CS53'
  name: string; // e.g. 'Database Management Systems'
  branchCode: string; // e.g. 'CSE'
  schemeYear: string; // e.g. '2022'
  semester: number; // 1 to 8
  credits: number; // e.g. 4
  category: SubjectCategory;
  status: ItemStatus;
  order: number;
  description?: string;
}

export interface AcademicModule {
  id: string;
  subjectId: string;
  moduleNumber: number; // 1 to 5
  title: string; // e.g. 'Module 1: Introduction to DBMS'
  description: string;
  teachingHours: number; // e.g. 8
  status: ItemStatus;
  order: number;
}

export interface AcademicUnit {
  id: string;
  moduleId: string;
  unitNumber: number; // 1 to 10
  title: string; // e.g. 'Unit 1: ER Modeling'
  topicsCount: number;
  status: ItemStatus;
  order: number;
}

export interface AcademicTopic {
  id: string;
  unitId: string;
  topicNumber: number; // e.g. 1 to 10
  title: string; // e.g. 'Entity Sets, Attributes & Keys'
  description?: string;
  status: ItemStatus;
  order?: number;
}

export interface SharedAcademicSourceOfTruth {
  branches: AcademicBranch[];
  schemes: AcademicScheme[];
  semesters: AcademicSemester[];
  subjects: AcademicSubject[];
  modules: AcademicModule[];
  units: AcademicUnit[];
  topics: AcademicTopic[];
}
