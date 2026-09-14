import { create } from 'zustand';
import {
  AcademicBranch,
  AcademicScheme,
  AcademicSemester,
  AcademicSubject,
  AcademicModule,
  AcademicUnit,
  AcademicTopic,
  SharedAcademicSourceOfTruth,
} from '../shared/types/academic.types';
import { toast } from '../shared/components/toast/ToastContext';

// Mock Initial Data for Central Source of Truth
const INITIAL_BRANCHES: AcademicBranch[] = [
  { id: 'b-1', code: 'CSE', name: 'Computer Science & Engineering', status: 'ACTIVE', order: 1 },
  { id: 'b-2', code: 'ISE', name: 'Information Science & Engineering', status: 'ACTIVE', order: 2 },
  { id: 'b-3', code: 'ECE', name: 'Electronics & Communication Engineering', status: 'ACTIVE', order: 3 },
  { id: 'b-4', code: 'AIML', name: 'Artificial Intelligence & Machine Learning', status: 'ACTIVE', order: 4 },
  { id: 'b-5', code: 'EEE', name: 'Electrical & Electronics Engineering', status: 'ACTIVE', order: 5 },
  { id: 'b-6', code: 'CIVIL', name: 'Civil Engineering', status: 'ACTIVE', order: 6 },
  { id: 'b-7', code: 'MECH', name: 'Mechanical Engineering', status: 'ACTIVE', order: 7 },
];

const INITIAL_SCHEMES: AcademicScheme[] = [
  { id: 'sc-1', year: '2025', title: '2025 NEP Model Scheme', isDefault: false, status: 'ACTIVE', totalCreditsRequired: 160 },
  { id: 'sc-2', year: '2022', title: '2022 NEP Choice Based Credit Scheme (CBCS)', isDefault: true, status: 'ACTIVE', totalCreditsRequired: 160 },
  { id: 'sc-3', year: '2021', title: '2021 Outcome Based Education Scheme', isDefault: false, status: 'ACTIVE', totalCreditsRequired: 160 },
  { id: 'sc-4', year: '2018', title: '2018 Legacy CBCS Scheme', isDefault: false, status: 'ARCHIVED', totalCreditsRequired: 175 },
];

const INITIAL_SEMESTERS: AcademicSemester[] = [
  { id: 'sem-1', semesterNumber: 1, title: '1st Semester (Physics/Chemistry Cycle)', status: 'ACTIVE', order: 1 },
  { id: 'sem-2', semesterNumber: 2, title: '2nd Semester (Physics/Chemistry Cycle)', status: 'ACTIVE', order: 2 },
  { id: 'sem-3', semesterNumber: 3, title: '3rd Semester (Core Discipline Engineering)', status: 'ACTIVE', order: 3 },
  { id: 'sem-4', semesterNumber: 4, title: '4th Semester (Core Discipline Engineering)', status: 'ACTIVE', order: 4 },
  { id: 'sem-5', semesterNumber: 5, title: '5th Semester (Professional Core & Electives)', status: 'ACTIVE', order: 5 },
  { id: 'sem-6', semesterNumber: 6, title: '6th Semester (Professional Core & Open Electives)', status: 'ACTIVE', order: 6 },
  { id: 'sem-7', semesterNumber: 7, title: '7th Semester (Advanced Specialization & Project)', status: 'ACTIVE', order: 7 },
  { id: 'sem-8', semesterNumber: 8, title: '8th Semester (Major Industry Project & Internship)', status: 'ACTIVE', order: 8 },
];

const INITIAL_SUBJECTS: AcademicSubject[] = [
  {
    id: 'subj-101',
    code: '21CS53',
    name: 'Database Management Systems',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    credits: 4,
    category: 'THEORY',
    status: 'ACTIVE',
    order: 1,
    description: 'Relational Model, SQL, ER Diagrams, Normalization & Transaction Processing.',
  },
  {
    id: 'subj-102',
    code: '21CS52',
    name: 'Computer Networks',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    credits: 4,
    category: 'THEORY',
    status: 'ACTIVE',
    order: 2,
    description: 'OSI Reference Model, TCP/IP, Routing Protocols & Socket Programming.',
  },
  {
    id: 'subj-103',
    code: '21CS54',
    name: 'Theory of Computation',
    branchCode: 'CSE',
    schemeYear: '2022',
    semester: 5,
    credits: 3,
    category: 'THEORY',
    status: 'ACTIVE',
    order: 3,
    description: 'Finite Automata, Context-Free Grammars, Pushdown Automata & Turing Machines.',
  },
  {
    id: 'subj-104',
    code: '21EC42',
    name: 'Digital Signal Processing',
    branchCode: 'ECE',
    schemeYear: '2022',
    semester: 4,
    credits: 4,
    category: 'INTEGRATED',
    status: 'ACTIVE',
    order: 1,
    description: 'Discrete Fourier Transform, FFT Algorithms, IIR & FIR Filter Design.',
  },
  {
    id: 'subj-105',
    code: '18CS71',
    name: 'Artificial Intelligence & Machine Learning',
    branchCode: 'CSE',
    schemeYear: '2018',
    semester: 7,
    credits: 4,
    category: 'THEORY',
    status: 'ARCHIVED',
    order: 1,
    description: 'Search Algorithms, Supervised Learning, Neural Networks & Decision Trees.',
  },
];

const INITIAL_MODULES: AcademicModule[] = [
  { id: 'mod-1', subjectId: 'subj-101', moduleNumber: 1, title: 'Module 1: Introduction & Entity Relationship Model', description: 'Concepts of Database Systems, Data Abstraction, ER Diagrams & Keys.', teachingHours: 8, status: 'ACTIVE', order: 1 },
  { id: 'mod-2', subjectId: 'subj-101', moduleNumber: 2, title: 'Module 2: Relational Model & Relational Algebra', description: 'Relational Data Model, Tuple Relational Calculus & Relational Operations.', teachingHours: 8, status: 'ACTIVE', order: 2 },
  { id: 'mod-3', subjectId: 'subj-101', moduleNumber: 3, title: 'Module 3: Structured Query Language (SQL)', description: 'DDL, DML, DCL commands, Joins, Subqueries & Triggers.', teachingHours: 10, status: 'ACTIVE', order: 3 },
  { id: 'mod-4', subjectId: 'subj-101', moduleNumber: 4, title: 'Module 4: Database Design & Normalization', description: 'Functional Dependencies, 1NF, 2NF, 3NF & BCNF Decomposition.', teachingHours: 8, status: 'ACTIVE', order: 4 },
  { id: 'mod-5', subjectId: 'subj-101', moduleNumber: 5, title: 'Module 5: Transaction Processing & Concurrency Control', description: 'ACID Properties, Serializability, Two-Phase Locking & Recovery.', teachingHours: 8, status: 'ACTIVE', order: 5 },
  { id: 'mod-6', subjectId: 'subj-102', moduleNumber: 1, title: 'Module 1: Introduction to Computer Networks & Physical Layer', description: 'Network Topologies, OSI Reference Model, TCP/IP Suite & Data Transmission.', teachingHours: 8, status: 'ACTIVE', order: 1 },
  { id: 'mod-7', subjectId: 'subj-102', moduleNumber: 2, title: 'Module 2: Data Link Layer & Medium Access Control', description: 'Framing, Error Detection/Correction, CSMA/CD & Ethernet Standards.', teachingHours: 8, status: 'ACTIVE', order: 2 },
];

const INITIAL_UNITS: AcademicUnit[] = [
  { id: 'u-1', moduleId: 'mod-1', unitNumber: 1, title: 'Database System Concepts & Architecture', topicsCount: 5, status: 'ACTIVE', order: 1 },
  { id: 'u-2', moduleId: 'mod-1', unitNumber: 2, title: 'Data Modeling using Entity-Relationship Diagrams', topicsCount: 6, status: 'ACTIVE', order: 2 },
  { id: 'u-3', moduleId: 'mod-2', unitNumber: 1, title: 'Relational Model Constraints & Relational Schemas', topicsCount: 4, status: 'ACTIVE', order: 1 },
  { id: 'u-4', moduleId: 'mod-3', unitNumber: 1, title: 'Complex Queries, Nested Subqueries & Views in SQL', topicsCount: 8, status: 'ACTIVE', order: 1 },
  { id: 'u-5', moduleId: 'mod-6', unitNumber: 1, title: 'OSI Reference Model vs TCP/IP Protocol Stack', topicsCount: 6, status: 'ACTIVE', order: 1 },
];

const INITIAL_TOPICS: AcademicTopic[] = [
  { id: 'top-1', unitId: 'u-1', topicNumber: 1, title: 'Introduction to DBMS & File Systems vs DBMS', description: 'Comparison of Traditional File Processing Systems with Database Systems.', status: 'ACTIVE', order: 1 },
  { id: 'top-2', unitId: 'u-1', topicNumber: 2, title: 'Three-Schema Architecture & Data Independence', description: 'Physical, Conceptual and External Schemas; Logical & Physical Data Independence.', status: 'ACTIVE', order: 2 },
  { id: 'top-3', unitId: 'u-2', topicNumber: 1, title: 'Entity Sets, Key Attributes & Composite Attributes', description: 'ER Diagram Entities, Strong vs Weak Entities, Key, Composite & Multivalued Attributes.', status: 'ACTIVE', order: 1 },
  { id: 'top-4', unitId: 'u-2', topicNumber: 2, title: 'Relationship Types & Structural Constraints', description: 'Cardinality Ratios (1:1, 1:N, N:M) and Participation Constraints (Total vs Partial).', status: 'ACTIVE', order: 2 },
  { id: 'top-5', unitId: 'u-5', topicNumber: 1, title: 'OSI 7 Layer Reference Model vs TCP/IP 4 Layer Model', description: 'Layer-by-layer function comparison, Encapsulation & Decapsulation processes.', status: 'ACTIVE', order: 1 },
];

interface AcademicStore {
  branches: AcademicBranch[];
  schemes: AcademicScheme[];
  semesters: AcademicSemester[];
  subjects: AcademicSubject[];
  modules: AcademicModule[];
  units: AcademicUnit[];
  topics: AcademicTopic[];

  // Branch CRUD
  addBranch: (branch: Omit<AcademicBranch, 'id'>) => { success: boolean; error?: string };
  updateBranch: (id: string, updates: Partial<AcademicBranch>) => { success: boolean; error?: string };
  toggleBranchStatus: (id: string) => void;
  archiveBranch: (id: string) => void;
  restoreBranch: (id: string) => void;
  reorderBranches: (branches: AcademicBranch[]) => void;

  // Scheme CRUD
  addScheme: (scheme: Omit<AcademicScheme, 'id'>) => { success: boolean; error?: string };
  updateScheme: (id: string, updates: Partial<AcademicScheme>) => { success: boolean; error?: string };
  toggleSchemeStatus: (id: string) => void;
  archiveScheme: (id: string) => void;
  restoreScheme: (id: string) => void;
  reorderSchemes: (schemes: AcademicScheme[]) => void;

  // Semester CRUD
  addSemester: (sem: Omit<AcademicSemester, 'id'>) => { success: boolean; error?: string };
  updateSemester: (id: string, updates: Partial<AcademicSemester>) => { success: boolean; error?: string };
  toggleSemesterStatus: (id: string) => void;
  archiveSemester: (id: string) => void;
  restoreSemester: (id: string) => void;
  reorderSemesters: (semesters: AcademicSemester[]) => void;

  // Subject CRUD
  addSubject: (subject: Omit<AcademicSubject, 'id'>) => { success: boolean; error?: string };
  updateSubject: (id: string, updates: Partial<AcademicSubject>) => { success: boolean; error?: string };
  toggleSubjectStatus: (id: string) => void;
  archiveSubject: (id: string) => void;
  restoreSubject: (id: string) => void;
  reorderSubjects: (subjects: AcademicSubject[]) => void;

  // Module CRUD
  addModule: (mod: Omit<AcademicModule, 'id'>) => { success: boolean; error?: string };
  updateModule: (id: string, updates: Partial<AcademicModule>) => { success: boolean; error?: string };
  toggleModuleStatus: (id: string) => void;
  archiveModule: (id: string) => void;
  restoreModule: (id: string) => void;
  reorderModules: (modules: AcademicModule[]) => void;

  // Unit CRUD
  addUnit: (unit: Omit<AcademicUnit, 'id'>) => { success: boolean; error?: string };
  updateUnit: (id: string, updates: Partial<AcademicUnit>) => { success: boolean; error?: string };
  toggleUnitStatus: (id: string) => void;
  archiveUnit: (id: string) => void;
  restoreUnit: (id: string) => void;
  reorderUnits: (units: AcademicUnit[]) => void;

  // Topic CRUD
  addTopic: (topic: Omit<AcademicTopic, 'id'>) => { success: boolean; error?: string };
  updateTopic: (id: string, updates: Partial<AcademicTopic>) => { success: boolean; error?: string };
  toggleTopicStatus: (id: string) => void;
  archiveTopic: (id: string) => void;
  restoreTopic: (id: string) => void;
  reorderTopics: (topics: AcademicTopic[]) => void;

  // Selectors for Shared Source of Truth
  getSharedAcademicSourceOfTruth: () => SharedAcademicSourceOfTruth;
  getSubjectsByBranchAndScheme: (branchCode?: string, schemeYear?: string, semester?: number) => AcademicSubject[];
  getModulesForSubject: (subjectId: string) => AcademicModule[];
  getUnitsForModule: (moduleId: string) => AcademicUnit[];
  getTopicsForUnit: (unitId: string) => AcademicTopic[];
  validateHierarchyMapping: (
    branchCode: string,
    schemeYear: string,
    semester: number,
    subjectId: string,
    moduleId?: string,
    unitId?: string,
    topicId?: string
  ) => { isValid: boolean; error?: string };
}

export const useAcademicStore = create<AcademicStore>((set, get) => ({
  branches: INITIAL_BRANCHES,
  schemes: INITIAL_SCHEMES,
  semesters: INITIAL_SEMESTERS,
  subjects: INITIAL_SUBJECTS,
  modules: INITIAL_MODULES,
  units: INITIAL_UNITS,
  topics: INITIAL_TOPICS,

  // Branch operations
  addBranch: (branchData) => {
    const { branches } = get();
    if (branches.some((b) => b.code.toUpperCase() === branchData.code.toUpperCase())) {
      const err = `Branch code '${branchData.code}' already exists.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const newBranch: AcademicBranch = {
      ...branchData,
      id: `b-${Date.now()}`,
    };
    set({ branches: [...branches, newBranch] });
    toast.success(`Engineering branch '${newBranch.code}' created successfully`, 'Branch Created');
    return { success: true };
  },

  updateBranch: (id, updates) => {
    const { branches } = get();
    if (updates.code) {
      const duplicate = branches.some(
        (b) => b.id !== id && b.code.toUpperCase() === updates.code!.toUpperCase()
      );
      if (duplicate) {
        const err = `Branch code '${updates.code}' is already used.`;
        toast.error(err, 'Validation Error');
        return { success: false, error: err };
      }
    }
    set((state) => ({
      branches: state.branches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
    toast.success('Engineering branch updated successfully', 'Branch Updated');
    return { success: true };
  },

  toggleBranchStatus: (id) => {
    let updatedCode = '';
    let newStatus = '';
    set((state) => ({
      branches: state.branches.map((b) => {
        if (b.id === id) {
          updatedCode = b.code;
          newStatus = b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...b, status: newStatus as any };
        }
        return b;
      }),
    }));
    toast.info(`Branch ${updatedCode} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveBranch: (id) => {
    let archivedCode = '';
    set((state) => ({
      branches: state.branches.map((b) => {
        if (b.id === id) {
          archivedCode = b.code;
          return { ...b, status: 'ARCHIVED' };
        }
        return b;
      }),
    }));
    toast.warning(`Branch ${archivedCode} archived successfully`, 'Branch Archived');
  },

  restoreBranch: (id) => {
    let restoredCode = '';
    set((state) => ({
      branches: state.branches.map((b) => {
        if (b.id === id) {
          restoredCode = b.code;
          return { ...b, status: 'ACTIVE' };
        }
        return b;
      }),
    }));
    toast.success(`Branch ${restoredCode} restored to active`, 'Branch Restored');
  },

  reorderBranches: (reordered) => {
    set({ branches: reordered });
    toast.info('Branch ordering saved', 'Reorder Saved');
  },

  // Scheme operations
  addScheme: (schemeData) => {
    const { schemes } = get();
    if (schemes.some((s) => s.year === schemeData.year)) {
      const err = `Scheme year '${schemeData.year}' already exists.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const newScheme: AcademicScheme = {
      ...schemeData,
      id: `sc-${Date.now()}`,
    };
    set({ schemes: [...schemes, newScheme] });
    toast.success(`Academic Scheme '${newScheme.year}' created successfully`, 'Scheme Created');
    return { success: true };
  },

  updateScheme: (id, updates) => {
    const { schemes } = get();
    if (updates.year) {
      const duplicate = schemes.some((s) => s.id !== id && s.year === updates.year);
      if (duplicate) {
        const err = `Scheme year '${updates.year}' already exists.`;
        toast.error(err, 'Validation Error');
        return { success: false, error: err };
      }
    }
    set((state) => ({
      schemes: state.schemes.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    toast.success('Academic Scheme updated successfully', 'Scheme Updated');
    return { success: true };
  },

  toggleSchemeStatus: (id) => {
    let year = '';
    let newStatus = '';
    set((state) => ({
      schemes: state.schemes.map((s) => {
        if (s.id === id) {
          year = s.year;
          newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...s, status: newStatus as any };
        }
        return s;
      }),
    }));
    toast.info(`Scheme ${year} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveScheme: (id) => {
    let year = '';
    set((state) => ({
      schemes: state.schemes.map((s) => {
        if (s.id === id) {
          year = s.year;
          return { ...s, status: 'ARCHIVED' };
        }
        return s;
      }),
    }));
    toast.warning(`Scheme ${year} archived successfully`, 'Scheme Archived');
  },

  restoreScheme: (id) => {
    let year = '';
    set((state) => ({
      schemes: state.schemes.map((s) => {
        if (s.id === id) {
          year = s.year;
          return { ...s, status: 'ACTIVE' };
        }
        return s;
      }),
    }));
    toast.success(`Scheme ${year} restored to active`, 'Scheme Restored');
  },

  reorderSchemes: (reordered) => {
    set({ schemes: reordered });
    toast.info('Scheme ordering saved', 'Reorder Saved');
  },

  // Semester operations
  addSemester: (semData) => {
    const { semesters } = get();
    if (semesters.some((s) => s.semesterNumber === semData.semesterNumber)) {
      const err = `Semester ${semData.semesterNumber} already exists.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const newSem: AcademicSemester = {
      ...semData,
      id: `sem-${Date.now()}`,
    };
    set({ semesters: [...semesters, newSem].sort((a, b) => a.semesterNumber - b.semesterNumber) });
    toast.success(`Semester ${newSem.semesterNumber} created successfully`, 'Semester Created');
    return { success: true };
  },

  updateSemester: (id, updates) => {
    const { semesters } = get();
    if (updates.semesterNumber) {
      const duplicate = semesters.some((s) => s.id !== id && s.semesterNumber === updates.semesterNumber);
      if (duplicate) {
        const err = `Semester ${updates.semesterNumber} already exists.`;
        toast.error(err, 'Validation Error');
        return { success: false, error: err };
      }
    }
    set((state) => ({
      semesters: state.semesters.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    toast.success('Semester details updated successfully', 'Semester Updated');
    return { success: true };
  },

  toggleSemesterStatus: (id) => {
    let semNum = 0;
    let newStatus = '';
    set((state) => ({
      semesters: state.semesters.map((s) => {
        if (s.id === id) {
          semNum = s.semesterNumber;
          newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...s, status: newStatus as any };
        }
        return s;
      }),
    }));
    toast.info(`Semester ${semNum} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveSemester: (id) => {
    let semNum = 0;
    set((state) => ({
      semesters: state.semesters.map((s) => {
        if (s.id === id) {
          semNum = s.semesterNumber;
          return { ...s, status: 'ARCHIVED' };
        }
        return s;
      }),
    }));
    toast.warning(`Semester ${semNum} archived successfully`, 'Semester Archived');
  },

  restoreSemester: (id) => {
    let semNum = 0;
    set((state) => ({
      semesters: state.semesters.map((s) => {
        if (s.id === id) {
          semNum = s.semesterNumber;
          return { ...s, status: 'ACTIVE' };
        }
        return s;
      }),
    }));
    toast.success(`Semester ${semNum} restored to active`, 'Semester Restored');
  },

  reorderSemesters: (reordered) => {
    set({ semesters: reordered });
    toast.info('Semester ordering saved', 'Reorder Saved');
  },

  // Subject operations with validation
  addSubject: (subjectData) => {
    const { subjects, branches, schemes } = get();
    // Validate Branch
    if (!branches.some((b) => b.code === subjectData.branchCode && b.status !== 'ARCHIVED')) {
      const err = `Invalid or archived Branch code '${subjectData.branchCode}'.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    // Validate Scheme
    if (!schemes.some((s) => s.year === subjectData.schemeYear && s.status !== 'ARCHIVED')) {
      const err = `Invalid or archived Scheme '${subjectData.schemeYear}'.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    // Validate Duplicate Subject Code in Scheme
    const duplicate = subjects.some(
      (s) =>
        s.code.toUpperCase() === subjectData.code.toUpperCase() &&
        s.schemeYear === subjectData.schemeYear
    );
    if (duplicate) {
      const err = `Subject code '${subjectData.code}' already exists under the ${subjectData.schemeYear} Scheme.`;
      toast.error(err, 'Validation Error');
      return {
        success: false,
        error: err,
      };
    }
    const newSubject: AcademicSubject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
    };
    set({ subjects: [...subjects, newSubject] });
    toast.success(`Subject '${newSubject.code} - ${newSubject.name}' created successfully`, 'Subject Created');
    return { success: true };
  },

  updateSubject: (id, updates) => {
    const { subjects, branches, schemes } = get();
    const target = subjects.find((s) => s.id === id);
    if (!target) {
      const err = 'Subject entity not found.';
      toast.error(err, 'Error');
      return { success: false, error: err };
    }

    const branch = updates.branchCode || target.branchCode;
    const scheme = updates.schemeYear || target.schemeYear;
    const code = updates.code || target.code;

    if (updates.branchCode && !branches.some((b) => b.code === branch)) {
      const err = `Invalid Branch code '${branch}'.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    if (updates.schemeYear && !schemes.some((s) => s.year === scheme)) {
      const err = `Invalid Scheme year '${scheme}'.`;
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }

    const duplicate = subjects.some(
      (s) =>
        s.id !== id &&
        s.code.toUpperCase() === code.toUpperCase() &&
        s.schemeYear === scheme
    );
    if (duplicate) {
      const err = `Subject code '${code}' is already used in scheme ${scheme}.`;
      toast.error(err, 'Validation Error');
      return {
        success: false,
        error: err,
      };
    }

    set((state) => ({
      subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
    toast.success(`Subject '${code}' updated successfully`, 'Subject Updated');
    return { success: true };
  },

  toggleSubjectStatus: (id) => {
    let code = '';
    let newStatus = '';
    set((state) => ({
      subjects: state.subjects.map((s) => {
        if (s.id === id) {
          code = s.code;
          newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...s, status: newStatus as any };
        }
        return s;
      }),
    }));
    toast.info(`Subject ${code} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveSubject: (id) => {
    let code = '';
    set((state) => ({
      subjects: state.subjects.map((s) => {
        if (s.id === id) {
          code = s.code;
          return { ...s, status: 'ARCHIVED' };
        }
        return s;
      }),
    }));
    toast.warning(`Subject ${code} archived successfully`, 'Subject Archived');
  },

  restoreSubject: (id) => {
    let code = '';
    set((state) => ({
      subjects: state.subjects.map((s) => {
        if (s.id === id) {
          code = s.code;
          return { ...s, status: 'ACTIVE' };
        }
        return s;
      }),
    }));
    toast.success(`Subject ${code} restored to active`, 'Subject Restored');
  },

  reorderSubjects: (reordered) => {
    set({ subjects: reordered });
    toast.info('Subject ordering saved', 'Reorder Saved');
  },

  // Module operations
  addModule: (moduleData) => {
    const { modules, subjects } = get();
    if (!subjects.some((s) => s.id === moduleData.subjectId)) {
      const err = 'Target subject entity does not exist.';
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const duplicateMod = modules.some(
      (m) => m.subjectId === moduleData.subjectId && m.moduleNumber === moduleData.moduleNumber
    );
    if (duplicateMod) {
      const err = `Module Number ${moduleData.moduleNumber} already exists for this subject.`;
      toast.error(err, 'Validation Error');
      return {
        success: false,
        error: err,
      };
    }
    const newModule: AcademicModule = {
      ...moduleData,
      id: `mod-${Date.now()}`,
    };
    set({ modules: [...modules, newModule] });
    toast.success(`Module ${newModule.moduleNumber} created successfully`, 'Module Created');
    return { success: true };
  },

  updateModule: (id, updates) => {
    const { modules } = get();
    const target = modules.find((m) => m.id === id);
    if (!target) {
      const err = 'Module not found.';
      toast.error(err, 'Error');
      return { success: false, error: err };
    }

    if (updates.moduleNumber) {
      const duplicate = modules.some(
        (m) =>
          m.id !== id &&
          m.subjectId === target.subjectId &&
          m.moduleNumber === updates.moduleNumber
      );
      if (duplicate) {
        const err = `Module Number ${updates.moduleNumber} already exists for this subject.`;
        toast.error(err, 'Validation Error');
        return {
          success: false,
          error: err,
        };
      }
    }

    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    toast.success('Module updated successfully', 'Module Updated');
    return { success: true };
  },

  toggleModuleStatus: (id) => {
    let modNum = 0;
    let newStatus = '';
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id === id) {
          modNum = m.moduleNumber;
          newStatus = m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...m, status: newStatus as any };
        }
        return m;
      }),
    }));
    toast.info(`Module ${modNum} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveModule: (id) => {
    let modNum = 0;
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id === id) {
          modNum = m.moduleNumber;
          return { ...m, status: 'ARCHIVED' };
        }
        return m;
      }),
    }));
    toast.warning(`Module ${modNum} archived successfully`, 'Module Archived');
  },

  restoreModule: (id) => {
    let modNum = 0;
    set((state) => ({
      modules: state.modules.map((m) => {
        if (m.id === id) {
          modNum = m.moduleNumber;
          return { ...m, status: 'ACTIVE' };
        }
        return m;
      }),
    }));
    toast.success(`Module ${modNum} restored to active`, 'Module Restored');
  },

  reorderModules: (reordered) => {
    set({ modules: reordered });
    toast.info('Module ordering saved', 'Reorder Saved');
  },

  // Unit operations
  addUnit: (unitData) => {
    const { units, modules } = get();
    if (!modules.some((m) => m.id === unitData.moduleId)) {
      const err = 'Target module does not exist.';
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const newUnit: AcademicUnit = {
      ...unitData,
      id: `u-${Date.now()}`,
    };
    set({ units: [...units, newUnit] });
    toast.success(`Topic Unit ${newUnit.unitNumber} created successfully`, 'Unit Created');
    return { success: true };
  },

  updateUnit: (id, updates) => {
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
    toast.success('Topic Unit updated successfully', 'Unit Updated');
    return { success: true };
  },

  toggleUnitStatus: (id) => {
    let unitNum = 0;
    let newStatus = '';
    set((state) => ({
      units: state.units.map((u) => {
        if (u.id === id) {
          unitNum = u.unitNumber;
          newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...u, status: newStatus as any };
        }
        return u;
      }),
    }));
    toast.info(`Topic Unit ${unitNum} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveUnit: (id) => {
    let unitNum = 0;
    set((state) => ({
      units: state.units.map((u) => {
        if (u.id === id) {
          unitNum = u.unitNumber;
          return { ...u, status: 'ARCHIVED' };
        }
        return u;
      }),
    }));
    toast.warning(`Topic Unit ${unitNum} archived successfully`, 'Unit Archived');
  },

  restoreUnit: (id) => {
    let unitNum = 0;
    set((state) => ({
      units: state.units.map((u) => {
        if (u.id === id) {
          unitNum = u.unitNumber;
          return { ...u, status: 'ACTIVE' };
        }
        return u;
      }),
    }));
    toast.success(`Topic Unit ${unitNum} restored to active`, 'Unit Restored');
  },

  reorderUnits: (reordered) => {
    set({ units: reordered });
    toast.info('Unit ordering saved', 'Reorder Saved');
  },

  // Topic operations
  addTopic: (topicData) => {
    const { topics, units } = get();
    if (!units.some((u) => u.id === topicData.unitId)) {
      const err = 'Target topic unit does not exist.';
      toast.error(err, 'Validation Error');
      return { success: false, error: err };
    }
    const newTopic: AcademicTopic = {
      ...topicData,
      id: `top-${Date.now()}`,
    };
    set({ topics: [...topics, newTopic] });
    toast.success(`Topic ${newTopic.topicNumber} created successfully`, 'Topic Created');
    return { success: true };
  },

  updateTopic: (id, updates) => {
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    toast.success('Topic details updated successfully', 'Topic Updated');
    return { success: true };
  },

  toggleTopicStatus: (id) => {
    let topicNum = 0;
    let newStatus = '';
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id === id) {
          topicNum = t.topicNumber;
          newStatus = t.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...t, status: newStatus as any };
        }
        return t;
      }),
    }));
    toast.info(`Topic ${topicNum} status changed to ${newStatus}`, 'Status Updated');
  },

  archiveTopic: (id) => {
    let topicNum = 0;
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id === id) {
          topicNum = t.topicNumber;
          return { ...t, status: 'ARCHIVED' };
        }
        return t;
      }),
    }));
    toast.warning(`Topic ${topicNum} archived successfully`, 'Topic Archived');
  },

  restoreTopic: (id) => {
    let topicNum = 0;
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id === id) {
          topicNum = t.topicNumber;
          return { ...t, status: 'ACTIVE' };
        }
        return t;
      }),
    }));
    toast.success(`Topic ${topicNum} restored to active`, 'Topic Restored');
  },

  reorderTopics: (reordered) => {
    set({ topics: reordered });
    toast.info('Topic ordering saved', 'Reorder Saved');
  },

  // Selectors for Shared Source of Truth across features
  getSharedAcademicSourceOfTruth: () => {
    const { branches, schemes, semesters, subjects, modules, units, topics } = get();
    return { branches, schemes, semesters, subjects, modules, units, topics };
  },

  getSubjectsByBranchAndScheme: (branchCode, schemeYear, semester) => {
    const { subjects } = get();
    return subjects.filter(
      (s) =>
        (!branchCode || branchCode === 'ALL' || s.branchCode === branchCode) &&
        (!schemeYear || schemeYear === 'ALL' || s.schemeYear === schemeYear) &&
        (!semester || semester === 0 || s.semester === semester)
    );
  },

  getModulesForSubject: (subjectId) => {
    const { modules } = get();
    return modules
      .filter((m) => m.subjectId === subjectId)
      .sort((a, b) => a.moduleNumber - b.moduleNumber);
  },

  getUnitsForModule: (moduleId) => {
    const { units } = get();
    return units
      .filter((u) => u.moduleId === moduleId)
      .sort((a, b) => a.unitNumber - b.unitNumber);
  },

  getTopicsForUnit: (unitId) => {
    const { topics } = get();
    return topics
      .filter((t) => t.unitId === unitId)
      .sort((a, b) => (a.topicNumber || 0) - (b.topicNumber || 0));
  },

  validateHierarchyMapping: (branchCode, schemeYear, semester, subjectId, moduleId, unitId, topicId) => {
    if (!branchCode || !schemeYear || !semester) {
      return { isValid: false, error: 'Branch, Scheme, and Semester are required.' };
    }
    return { isValid: true };
  },
}));
