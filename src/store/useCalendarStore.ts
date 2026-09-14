import { create } from 'zustand';
import { CalendarEvent, CalendarAuditLog, CalendarEventCategory, CalendarEventStatus } from '../shared/types/calendar.types';

interface CalendarStoreState {
  events: CalendarEvent[];
  auditLogs: CalendarAuditLog[];
  filterCategory: CalendarEventCategory | 'ALL';
  filterStatus: CalendarEventStatus | 'ALL';
  filterBranch: string;
  filterScheme: string;
  filterSemester: string;
  searchQuery: string;
  
  // Actions
  setFilterCategory: (category: CalendarEventCategory | 'ALL') => void;
  setFilterStatus: (status: CalendarEventStatus | 'ALL') => void;
  setFilterBranch: (branch: string) => void;
  setFilterScheme: (scheme: string) => void;
  setFilterSemester: (sem: string) => void;
  setSearchQuery: (query: string) => void;

  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'isMobileSynced'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  publishEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  deleteEvent: (id: string) => void;
  publishAllDrafts: () => void;
  syncMobileApp: () => void;
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

  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterBranch: (branch) => set({ filterBranch: branch }),
  setFilterScheme: (scheme) => set({ filterScheme: scheme }),
  setFilterSemester: (sem) => set({ filterSemester: sem }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addEvent: (data) => {
    const newId = `evt-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    const newEvent: CalendarEvent = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
      isMobileSynced: data.status === 'PUBLISHED',
    };

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: newId,
      eventTitle: data.title,
      action: 'CREATED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Created calendar event category "${data.category}" with status "${data.status}".`,
    };

    set((state) => ({
      events: [newEvent, ...state.events],
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  updateEvent: (id, updates) => {
    const now = new Date().toISOString().split('T')[0];
    const targetEvent = get().events.find((e) => e.id === id);
    if (!targetEvent) return;

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: id,
      eventTitle: updates.title || targetEvent.title,
      action: 'UPDATED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Updated event details. Updated fields: ${Object.keys(updates).join(', ')}`,
    };

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
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  publishEvent: (id) => {
    const targetEvent = get().events.find((e) => e.id === id);
    if (!targetEvent) return;

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: id,
      eventTitle: targetEvent.title,
      action: 'PUBLISHED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Published calendar event to mobile application.`,
    };

    set((state) => ({
      events: state.events.map((evt) =>
        evt.id === id
          ? { ...evt, status: 'PUBLISHED', isMobileSynced: true, updatedAt: new Date().toISOString().split('T')[0] }
          : evt
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  archiveEvent: (id) => {
    const targetEvent = get().events.find((e) => e.id === id);
    if (!targetEvent) return;

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: id,
      eventTitle: targetEvent.title,
      action: 'ARCHIVED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Archived calendar event.`,
    };

    set((state) => ({
      events: state.events.map((evt) =>
        evt.id === id ? { ...evt, status: 'ARCHIVED', updatedAt: new Date().toISOString().split('T')[0] } : evt
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  deleteEvent: (id) => {
    const targetEvent = get().events.find((e) => e.id === id);
    if (!targetEvent) return;

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: id,
      eventTitle: targetEvent.title,
      action: 'DELETED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Deleted calendar event.`,
    };

    set((state) => ({
      events: state.events.filter((evt) => evt.id !== id),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  publishAllDrafts: () => {
    const draftCount = get().events.filter((e) => e.status === 'DRAFT').length;
    if (draftCount === 0) return;

    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: 'BULK',
      eventTitle: `Bulk Published ${draftCount} Draft Events`,
      action: 'PUBLISHED',
      changedBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      details: `Bulk published ${draftCount} draft calendar events to mobile feed.`,
    };

    set((state) => ({
      events: state.events.map((evt) =>
        evt.status === 'DRAFT'
          ? { ...evt, status: 'PUBLISHED', isMobileSynced: true, updatedAt: new Date().toISOString().split('T')[0] }
          : evt
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  syncMobileApp: () => {
    const newLog: CalendarAuditLog = {
      id: `log-${Date.now()}`,
      eventId: 'SYSTEM',
      eventTitle: 'Mobile App Sync Handshake',
      action: 'MOBILE_SYNC',
      changedBy: 'System AutoSync',
      role: 'SYSTEM',
      timestamp: new Date().toLocaleString(),
      details: `Synced active calendar schedule with mobile app remote endpoint.`,
    };

    set((state) => ({
      events: state.events.map((evt) =>
        evt.status === 'PUBLISHED' ? { ...evt, isMobileSynced: true } : evt
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },
}));
