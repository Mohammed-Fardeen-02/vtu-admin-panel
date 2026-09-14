import { create } from 'zustand';
import { PassingPackage, PassingQuestion, PackageAuditLog } from '../shared/types/package.types';

interface PackageStoreState {
  packages: PassingPackage[];
  auditLogs: PackageAuditLog[];
  searchQuery: string;
  filterBranch: string;
  filterScheme: string;
  filterSemester: string;
  filterStatus: string;
  filterPremium: string;

  setSearchQuery: (query: string) => void;
  setFilterBranch: (branch: string) => void;
  setFilterScheme: (scheme: string) => void;
  setFilterSemester: (sem: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterPremium: (premium: string) => void;

  createPackage: (data: Omit<PassingPackage, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'downloads' | 'bookmarks'>) => void;
  updatePackage: (id: string, updates: Partial<PassingPackage>) => void;
  publishPackage: (id: string) => void;
  unpublishPackage: (id: string) => void;
  archivePackage: (id: string) => void;
  deletePackage: (id: string) => void;
  reorderQuestions: (packageId: string, questions: PassingQuestion[]) => void;
}

// Prohibited Claims Detector Policy
export const containsGuaranteedClaim = (text: string): boolean => {
  const lower = text.toLowerCase();
  return (
    lower.includes('100% guaranteed') ||
    lower.includes('guaranteed 100%') ||
    lower.includes('100% pass guarantee') ||
    lower.includes('guaranteed questions') ||
    lower.includes('100% leak')
  );
};

export const sanitizePackageText = (text: string): string => {
  return text
    .replace(/100%\s*guaranteed/gi, 'High Probability Expected')
    .replace(/guaranteed\s*100%/gi, 'High Probability Expected')
    .replace(/guaranteed\s*questions/gi, 'Most Frequently Asked Questions')
    .replace(/100%\s*pass\s*guarantee/gi, 'High Yield Exam Preparation');
};

const INITIAL_PACKAGES: PassingPackage[] = [
  {
    id: 'pkg-101',
    title: '21MAT31 Engineering Mathematics III - Passing Package & High Yield Guide',
    subjectCode: '21MAT31',
    subjectName: 'Transform Calculus, Fourier Series & Numerical Techniques',
    schemeYear: '2021',
    branchCode: 'CSE',
    semester: 3,
    unitsCount: 5,
    questionsCount: 25,
    lastMinuteRevisionSummary: 'Master Fourier series expansion, Laplace transform properties, and Euler-Gauss numerical integration steps.',
    oneNightBeforeNotes: 'Key formulas: Laplace L{e^(at)} = 1/(s-a), Fourier half range sine series, and Runge-Kutta 4th order formulas.',
    status: 'PUBLISHED',
    isPremium: false,
    tier: 'FREE',
    priceINR: 0,
    views: 14250,
    downloads: 9800,
    bookmarks: 3410,
    createdAt: '2026-08-10',
    updatedAt: '2026-08-20',
    author: 'VTU Math Cell',
    questions: [
      {
        id: 'q-1',
        questionText: 'State and prove the Laplace Transform of periodic functions.',
        answerSummary: 'Definition of periodic function f(t+T)=f(t), integration limits from 0 to T over (1 - e^-sT).',
        unitNumber: 1,
        unitName: 'Laplace & Inverse Laplace Transforms',
        category: 'IMPORTANT',
        weightageMarks: 10,
        priority: 'HIGH',
        frequencyText: 'Asked 6 times in VTU 2021-2025 examinations',
        order: 1,
        diagramRequired: false,
      },
      {
        id: 'q-2',
        questionText: 'Obtain the Fourier Series expansion of f(x) = x^2 in the interval (-pi, pi).',
        answerSummary: 'Even function symmetry a0 and an calculation, bn = 0. Deduce pi^2 / 6 summation.',
        unitNumber: 2,
        unitName: 'Fourier Series & Fourier Transforms',
        category: 'MOST_EXPECTED',
        weightageMarks: 8,
        priority: 'HIGH',
        frequencyText: 'Asked 5 times in VTU main examinations',
        order: 2,
        diagramRequired: false,
      },
      {
        id: 'q-3',
        questionText: 'Apply Runge-Kutta 4th Order method to find y(0.1) given dy/dx = x + y with y(0)=1.',
        answerSummary: 'Calculate k1, k2, k3, k4 step values for h=0.1, formula y1 = y0 + (k1 + 2k2 + 2k3 + k4)/6.',
        unitNumber: 4,
        unitName: 'Numerical Solutions of Ordinary Differential Equations',
        category: 'REPEATED',
        weightageMarks: 10,
        priority: 'HIGH',
        frequencyText: 'Asked in almost every VTU SEE paper',
        order: 3,
        diagramRequired: false,
      },
    ],
  },
  {
    id: 'pkg-102',
    title: '21CS32 Data Structures & Algorithms - Ultimate Passing Package',
    subjectCode: '21CS32',
    subjectName: 'Data Structures and Applications',
    schemeYear: '2021',
    branchCode: 'CSE',
    semester: 3,
    unitsCount: 5,
    questionsCount: 20,
    lastMinuteRevisionSummary: 'Focus on Stack operations, Linked List inversions, Binary Search Tree traversals, and Dijkstra algorithm.',
    oneNightBeforeNotes: 'Stack array representation, Queue circular implementation, AVL rotation trees, and Max Heapify code.',
    status: 'PUBLISHED',
    isPremium: true,
    tier: 'SILVER',
    priceINR: 49,
    views: 18900,
    downloads: 12400,
    bookmarks: 4890,
    createdAt: '2026-08-15',
    updatedAt: '2026-08-25',
    author: 'VTU CS Academic Board',
    questions: [
      {
        id: 'q-4',
        questionText: 'Write a C program to implement Stack operations (PUSH, POP, DISPLAY) with overflow check.',
        answerSummary: 'Stack array struct, top variable initialized to -1, push increments top, pop decrements top.',
        unitNumber: 1,
        unitName: 'Stacks and Queues',
        category: 'ONE_NIGHT_BEFORE',
        weightageMarks: 10,
        priority: 'HIGH',
        frequencyText: 'Compulsory Lab and SEE question',
        order: 1,
        diagramRequired: true,
      },
      {
        id: 'q-5',
        questionText: 'Explain Doubly Linked List node structure and algorithm to delete a given node.',
        answerSummary: 'prev, data, next pointers. Update next of prev node and prev of next node.',
        unitNumber: 2,
        unitName: 'Linked Lists',
        category: 'IMPORTANT',
        weightageMarks: 8,
        priority: 'MEDIUM',
        frequencyText: 'Asked 4 times in VTU SEE',
        order: 2,
        diagramRequired: true,
      },
    ],
  },
];

const INITIAL_LOGS: PackageAuditLog[] = [
  {
    id: 'plog-1',
    packageId: 'pkg-101',
    packageTitle: '21MAT31 Engineering Mathematics III - Passing Package',
    action: 'PUBLISHED',
    admin: 'Academic Dean Admin',
    timestamp: '2026-08-20 12:00',
    details: 'Published 21MAT31 passing package to student mobile app.',
  },
];

export const usePackageStore = create<PackageStoreState>((set, get) => ({
  packages: INITIAL_PACKAGES,
  auditLogs: INITIAL_LOGS,
  searchQuery: '',
  filterBranch: 'ALL',
  filterScheme: 'ALL',
  filterSemester: 'ALL',
  filterStatus: 'ALL',
  filterPremium: 'ALL',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterBranch: (branch) => set({ filterBranch: branch }),
  setFilterScheme: (scheme) => set({ filterScheme: scheme }),
  setFilterSemester: (sem) => set({ filterSemester: sem }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPremium: (premium) => set({ filterPremium: premium }),

  createPackage: (data) => {
    // Sanitize title and revision text against prohibited claims
    const cleanTitle = sanitizePackageText(data.title);
    const cleanSummary = sanitizePackageText(data.lastMinuteRevisionSummary);
    const cleanOneNight = sanitizePackageText(data.oneNightBeforeNotes);

    const id = `pkg-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];

    const newPkg: PassingPackage = {
      ...data,
      title: cleanTitle,
      lastMinuteRevisionSummary: cleanSummary,
      oneNightBeforeNotes: cleanOneNight,
      id,
      views: 0,
      downloads: 0,
      bookmarks: 0,
      createdAt: now,
      updatedAt: now,
    };

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: cleanTitle,
      action: 'CREATED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: `Created passing package for ${data.subjectCode} (${data.branchCode} Sem ${data.semester}).`,
    };

    set((state) => ({
      packages: [newPkg, ...state.packages],
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  updatePackage: (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    const target = get().packages.find((p) => p.id === id);
    if (!target) return;

    if (updates.title) updates.title = sanitizePackageText(updates.title);
    if (updates.lastMinuteRevisionSummary)
      updates.lastMinuteRevisionSummary = sanitizePackageText(updates.lastMinuteRevisionSummary);
    if (updates.oneNightBeforeNotes)
      updates.oneNightBeforeNotes = sanitizePackageText(updates.oneNightBeforeNotes);

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: updates.title || target.title,
      action: 'UPDATED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: `Updated package fields.`,
    };

    set((state) => ({
      packages: state.packages.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: now } : p)),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  publishPackage: (id) => {
    const target = get().packages.find((p) => p.id === id);
    if (!target) return;

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: target.title,
      action: 'PUBLISHED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: 'Published passing package to student mobile app.',
    };

    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, status: 'PUBLISHED', updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  unpublishPackage: (id) => {
    const target = get().packages.find((p) => p.id === id);
    if (!target) return;

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: target.title,
      action: 'UNPUBLISHED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: 'Unpublished passing package.',
    };

    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  archivePackage: (id) => {
    const target = get().packages.find((p) => p.id === id);
    if (!target) return;

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: target.title,
      action: 'ARCHIVED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: 'Archived passing package.',
    };

    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === id ? { ...p, status: 'ARCHIVED', updatedAt: new Date().toISOString().split('T')[0] } : p
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  deletePackage: (id) => {
    const target = get().packages.find((p) => p.id === id);
    if (!target) return;

    const newLog: PackageAuditLog = {
      id: `plog-${Date.now()}`,
      packageId: id,
      packageTitle: target.title,
      action: 'DELETED',
      admin: 'Super Admin',
      timestamp: new Date().toLocaleString(),
      details: 'Deleted passing package.',
    };

    set((state) => ({
      packages: state.packages.filter((p) => p.id !== id),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  reorderQuestions: (packageId, questions) => {
    set((state) => ({
      packages: state.packages.map((p) =>
        p.id === packageId
          ? {
              ...p,
              questions: questions.map((q, idx) => ({ ...q, order: idx + 1 })),
              questionsCount: questions.length,
            }
          : p
      ),
    }));
  },
}));
