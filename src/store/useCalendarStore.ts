import { create } from 'zustand';
import { CalendarEvent, CalendarAuditLog, CalendarEventCategory, CalendarEventStatus } from '../shared/types/calendar.types';
import { apiClient } from '../shared/api/apiClient';

interface CalendarStoreState {
  events: CalendarEvent[];
  auditLogs: CalendarAuditLog[];
  filterCategory: CalendarEventCategory | 'ALL';
  filterStatus: CalendarEventStatus | 'ALL';
  filterBranch: string;
  filterScheme: string;
  filterSemester: string;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  fetchEvents: () => Promise<void>;
  setFilterCategory: (category: CalendarEventCategory | 'ALL') => void;
  setFilterStatus: (status: CalendarEventStatus | 'ALL') => void;
  setFilterBranch: (branch: string) => void;
  setFilterScheme: (scheme: string) => void;
  setFilterSemester: (sem: string) => void;
  setSearchQuery: (query: string) => void;

  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'isMobileSynced'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  publishEvent: (id: string) => Promise<void>;
  archiveEvent: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  publishAllDrafts: () => Promise<void>;
  syncMobileApp: () => Promise<void>;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-101',
    title: 'Commencement of Odd Semester (3rd, 5th, 7th Sem)',
    description: 'Official start of classes for odd semesters across all engineering programs under 2021 & 2022 schemes.',
    category: 'SEMESTER_START',
    startDate: '2026-09-15',
    endDate: '2026-09-15',
    branchId: 'ALL',
    schemeId: 'ALL',
    semester: 'ALL',
    status: 'PUBLISHED',
    createdBy: 'Academic Council Admin',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-15',
    isMobileSynced: true,
  },
  {
    id: 'evt-102',
    title: 'First Internal Assessment Test (IA-1)',
    description: 'First continuous evaluation exam covering Module 1 and Module 2 syllabus.',
    category: 'INTERNAL_EXAM',
    startDate: '2026-10-20',
    endDate: '2026-10-24',
    branchId: 'ALL',
    schemeId: '2022',
    semester: 'ALL',
    status: 'PUBLISHED',
    createdBy: 'Exam Controller Admin',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isMobileSynced: true,
  },
  {
    id: 'evt-103',
    title: 'Second Internal Assessment Test (IA-2)',
    description: 'Mid-term evaluation test for Module 3 and Module 4 topics.',
    category: 'INTERNAL_EXAM',
    startDate: '2026-11-15',
    endDate: '2026-11-19',
    branchId: 'ALL',
    schemeId: 'ALL',
    semester: 'ALL',
    status: 'PUBLISHED',
    createdBy: 'Exam Controller Admin',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    isMobileSynced: true,
  },
  {
    id: 'evt-104',
    title: 'VTU Practical / Lab Examination Cycle',
    description: 'External laboratory exams and viva voce examinations conducted by external examiners.',
    category: 'LAB_EXAM',
    startDate: '2026-12-01',
    endDate: '2026-12-10',
    branchId: 'ALL',
    schemeId: '2022',
    semester: 5,
    status: 'PUBLISHED',
    createdBy: 'Registrar Evaluation',
    createdAt: '2026-08-14',
    updatedAt: '2026-08-14',
    isMobileSynced: true,
  },
  {
    id: 'evt-105',
    title: 'VTU Semester End Examination (SEE Theory)',
    description: 'Final university theory examinations for 2021 & 2022 scheme odd semester students.',
    category: 'VTU_EXAM',
    startDate: '2026-12-15',
    endDate: '2027-01-10',
    branchId: 'ALL',
    schemeId: 'ALL',
    semester: 'ALL',
    status: 'PUBLISHED',
    createdBy: 'Registrar Evaluation',
    createdAt: '2026-08-15',
    updatedAt: '2026-08-15',
    isMobileSynced: true,
  },
  {
    id: 'evt-106',
    title: 'Odd Semester Result Announcement Target Window',
    description: 'Tentative release of SEE theory revaluation and regular exam marksheets.',
    category: 'RESULT_DATE',
    startDate: '2027-02-10',
    endDate: '2027-02-15',
    branchId: 'ALL',
    schemeId: 'ALL',
    semester: 'ALL',
    status: 'DRAFT',
    createdBy: 'System SuperAdmin',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-20',
    isMobileSynced: false,
  },
  {
    id: 'evt-107',
    title: 'Karnataka Rajyotsava Holiday',
    description: 'Official state holiday - no classes or examinations scheduled.',
    category: 'HOLIDAY',
    startDate: '2026-11-01',
    endDate: '2026-11-01',
    branchId: 'ALL',
    schemeId: 'ALL',
    semester: 'ALL',
    status: 'PUBLISHED',
    createdBy: 'VTU Registrar',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-01',
    isMobileSynced: true,
  },
  {
    id: 'evt-108',
    title: 'Annual VTU State Level Project Exhibition & Hackathon',
    description: 'Inter-collegiate project exhibition for final year CSE, ECE, and ISE students.',
    category: 'ACADEMIC_EVENT',
    startDate: '2026-11-25',
    endDate: '2026-11-26',
    branchId: 'CSE',
    schemeId: '2022',
    semester: 7,
    status: 'DRAFT',
    createdBy: 'R&D Cell Head',
    createdAt: '2026-08-25',
    updatedAt: '2026-08-25',
    isMobileSynced: false,
  },
];

const INITIAL_LOGS: CalendarAuditLog[] = [
  {
    id: 'log-c1',
    eventId: 'evt-101',
    eventTitle: 'Commencement of Odd Semester (3rd, 5th, 7th Sem)',
    action: 'PUBLISHED',
    changedBy: 'Academic Council Admin',
    role: 'SUPER_ADMIN',
    timestamp: '2026-08-15 10:30',
    details: 'Published commencement dates for academic year 2026-2027.',
  },
];

export const useCalendarStore = create<CalendarStoreState>((set, get) => ({
  events: INITIAL_EVENTS,
  auditLogs: INITIAL_LOGS,
  filterCategory: 'ALL',
  filterStatus: 'ALL',
  filterBranch: 'ALL',
  filterScheme: 'ALL',
  filterSemester: 'ALL',
  searchQuery: '',
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response: any = await apiClient.get('/academic/events');
      const body = response.data?.data || response.data || response;
      const rawEvents = Array.isArray(body) ? body : body.items || body.data || [];
      if (Array.isArray(rawEvents) && rawEvents.length > 0) {
        const mapped: CalendarEvent[] = rawEvents.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          category: e.category,
          startDate: e.startDate,
          endDate: e.endDate || e.startDate,
          branchId: e.branchId || 'ALL',
          schemeId: e.schemeId || 'ALL',
          semester: e.semester === 'ALL' ? 'ALL' : Number(e.semester) || 'ALL',
          status: e.status || 'PUBLISHED',
          createdBy: e.createdBy || 'VTU Academic Panel',
          createdAt: e.createdAt ? e.createdAt.split('T')[0] : '2026-09-01',
          updatedAt: e.updatedAt ? e.updatedAt.split('T')[0] : '2026-09-01',
          isMobileSynced: Boolean(e.isMobileSynced ?? true),
        }));
        set({ events: mapped });
      }
    } catch (err: any) {
      console.warn('[useCalendarStore] Failed to fetch events from backend:', err?.message || err);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterBranch: (branch) => set({ filterBranch: branch }),
  setFilterScheme: (scheme) => set({ filterScheme: scheme }),
  setFilterSemester: (sem) => set({ filterSemester: sem }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addEvent: async (data) => {
    const now = new Date().toISOString().split('T')[0];
    try {
      const res: any = await apiClient.post('/academic/events', {
        title: data.title,
        description: data.description,
        category: data.category,
        startDate: data.startDate,
        endDate: data.endDate,
        branchId: data.branchId,
        schemeId: data.schemeId,
        semester: String(data.semester),
        status: data.status,
        createdBy: data.createdBy,
        isImportant: true,
      });
      const created = res.data?.data || res.data || res;
      const newEvent: CalendarEvent = {
        ...data,
        id: created.id || `evt-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        isMobileSynced: data.status === 'PUBLISHED',
      };
      set((state) => ({ events: [newEvent, ...state.events] }));
      get().fetchEvents();
    } catch {
      const newId = `evt-${Date.now()}`;
      const newEvent: CalendarEvent = {
        ...data,
        id: newId,
        createdAt: now,
        updatedAt: now,
        isMobileSynced: data.status === 'PUBLISHED',
      };
      set((state) => ({ events: [newEvent, ...state.events] }));
    }
  },

  updateEvent: async (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    try {
      await apiClient.patch(`/academic/events/${id}`, updates);
    } catch {
      // Ignore fallback
    }
    set((state) => ({
      events: state.events.map((evt) =>
        evt.id === id
          ? {
              ...evt,
              ...updates,
              updatedAt: now,
              isMobileSynced: updates.status === 'PUBLISHED' ? true : evt.isMobileSynced,
            }
          : evt
      ),
    }));
  },

  publishEvent: async (id) => {
    try {
      await apiClient.patch(`/academic/events/${id}`, { status: 'PUBLISHED', isMobileSynced: true });
    } catch {
      // Ignore fallback
    }
    set((state) => ({
      events: state.events.map((evt) =>
        evt.id === id
          ? { ...evt, status: 'PUBLISHED', isMobileSynced: true, updatedAt: new Date().toISOString().split('T')[0] }
          : evt
      ),
    }));
  },

  archiveEvent: async (id) => {
    try {
      await apiClient.patch(`/academic/events/${id}`, { status: 'ARCHIVED' });
    } catch {
      // Ignore fallback
    }
    set((state) => ({
      events: state.events.map((evt) =>
        evt.id === id ? { ...evt, status: 'ARCHIVED', updatedAt: new Date().toISOString().split('T')[0] } : evt
      ),
    }));
  },

  deleteEvent: async (id) => {
    try {
      await apiClient.delete(`/academic/events/${id}`);
    } catch {
      // Ignore fallback
    }
    set((state) => ({
      events: state.events.filter((evt) => evt.id !== id),
    }));
  },

  publishAllDrafts: async () => {
    const drafts = get().events.filter((e) => e.status === 'DRAFT');
    for (const d of drafts) {
      try {
        await apiClient.patch(`/academic/events/${d.id}`, { status: 'PUBLISHED', isMobileSynced: true });
      } catch {
        // Continue
      }
    }
    set((state) => ({
      events: state.events.map((evt) =>
        evt.status === 'DRAFT'
          ? { ...evt, status: 'PUBLISHED', isMobileSynced: true, updatedAt: new Date().toISOString().split('T')[0] }
          : evt
      ),
    }));
  },

  syncMobileApp: async () => {
    await get().fetchEvents();
  },
}));
