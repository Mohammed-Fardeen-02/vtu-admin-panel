import { useAcademicStore } from '../../../store/useAcademicStore';
import { Course, Scheme, Branch, Semester } from '../types/type';

export const useAcademic = () => {
  const store = useAcademicStore();

  const schemes: Scheme[] = store.schemes.map((s) => ({
    id: s.id,
    schemeYear: s.year,
    year: s.year,
    title: s.title,
    name: s.title,
    status: s.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
  }));

  const branches: Branch[] = store.branches.map((b) => ({
    id: b.id,
    code: b.code,
    name: b.name,
    status: b.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
  }));

  const semesters: Semester[] = store.semesters.map((sem) => ({
    id: sem.id,
    number: sem.semesterNumber,
    semesterNumber: sem.semesterNumber,
    title: sem.title,
    label: sem.title,
    status: sem.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
  }));

  const courses: Course[] = store.subjects.map((s) => ({
    id: s.id,
    subjectCode: s.code,
    title: s.name,
    schemeId: s.schemeYear,
    branchId: s.branchCode,
    semesterId: String(s.semester),
    credits: s.credits,
    status: s.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
    syllabusModules: store.modules
      .filter((m) => m.subjectId === s.id)
      .map((m) => ({
        id: m.id,
        moduleNumber: m.moduleNumber,
        title: m.title,
        description: m.description,
        units: store.units
          .filter((u) => u.moduleId === m.id)
          .map((u) => ({
            id: u.id,
            unitNumber: String(u.unitNumber),
            title: u.title,
            topics: `${u.topicsCount || 5} topics`,
          })),
      })),
  }));

  return {
    schemes,
    branches,
    semesters,
    courses,
    subjects: store.subjects,
    modules: store.modules,
    units: store.units,
    colleges: [],
    isLoading: false,
    error: null,
    refreshData: async () => {},
    updateModules: async (courseId: string, modules: any[]) => ({ success: true }),
    addBranch: (data: any) => store.addBranch(data),
    editBranch: (id: string, updates: any) => store.updateBranch(id, updates),
    deactivateBranch: (id: string) => store.archiveBranch(id),
    addCollege: (data: any) => ({ success: true }),
    editCollege: (id: string, data: any) => ({ success: true }),
    deactivateCollege: (id: string) => ({ success: true }),
  };
};
