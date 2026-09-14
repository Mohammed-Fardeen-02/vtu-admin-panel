import { create } from 'zustand';
import { InAppNotification, NotificationAuditLog, NotificationType, NotificationStatus, AudienceType } from '../shared/types/notification.types';

interface NotificationStoreState {
  notifications: InAppNotification[];
  auditLogs: NotificationAuditLog[];
  filterType: NotificationType | 'ALL';
  filterStatus: NotificationStatus | 'ALL';
  filterAudience: AudienceType | 'ALL';
  searchQuery: string;

  // Setters
  setFilterType: (type: NotificationType | 'ALL') => void;
  setFilterStatus: (status: NotificationStatus | 'ALL') => void;
  setFilterAudience: (aud: AudienceType | 'ALL') => void;
  setSearchQuery: (query: string) => void;

  // Actions
  createNotification: (data: Omit<InAppNotification, 'id' | 'createdAt' | 'stats'>) => string;
  updateNotification: (id: string, updates: Partial<InAppNotification>) => void;
  sendImmediately: (id: string) => void;
  scheduleNotification: (id: string, scheduledFor: string) => void;
  cancelScheduledNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-201',
    title: 'VTU Odd Semester Revaluation Results Announced',
    body: 'Revaluation results for 5th and 7th Semester B.E. examinations held in June/July 2026 are now available on the VTU Results Portal.',
    type: 'RESULT',
    audience: 'ALL_STUDENTS',
    targetBranch: 'ALL',
    targetSemester: 'ALL',
    targetScheme: '2022',
    targetCollege: 'ALL',
    status: 'SENT',
    sentAt: '2026-09-01 14:30',
    createdBy: 'Registrar (Evaluation)',
    createdAt: '2026-09-01 14:00',
    actionUrl: 'https://results.vtu.ac.in',
    stats: {
      recipientsCount: 45200,
      deliveredCount: 44100,
      openedCount: 38950,
    },
  },
  {
    id: 'notif-202',
    title: 'Revised Time Table for IA-1 Continuous Assessment',
    body: 'Internal Assessment Test 1 timetable has been updated for Computer Science & Engineering department for 5th semester.',
    type: 'EXAM',
    audience: 'BRANCH_SPECIFIC',
    targetBranch: 'CSE',
    targetSemester: 5,
    targetScheme: '2022',
    targetCollege: 'ALL',
    status: 'SCHEDULED',
    scheduledFor: '2026-09-10 09:00',
    createdBy: 'HOD CSE Dept',
    createdAt: '2026-09-05 11:20',
    stats: {
      recipientsCount: 14200,
      deliveredCount: 0,
      openedCount: 0,
    },
  },
  {
    id: 'notif-203',
    title: 'VTU Official Circular: Submission of Examination Application Forms',
    body: 'All eligible regular and backlog students must complete exam form submission by September 25, 2026 without late fee.',
    type: 'CIRCULAR',
    audience: 'ALL_STUDENTS',
    targetBranch: 'ALL',
    targetSemester: 'ALL',
    targetScheme: 'ALL',
    targetCollege: 'ALL',
    status: 'SENT',
    sentAt: '2026-08-28 10:15',
    createdBy: 'VTU Central Admin',
    createdAt: '2026-08-28 09:30',
    attachmentUrl: 'https://vtu.ac.in/pdf/circulars/exam_form_2026.pdf',
    stats: {
      recipientsCount: 125000,
      deliveredCount: 121500,
      openedCount: 98400,
    },
  },
  {
    id: 'notif-204',
    title: 'Draft Announcement: VTU State Level Coding Competition 2026',
    body: 'Join the annual inter-collegiate hackathon. Registration opens on September 15th with cash prizes up to INR 2,00,000.',
    type: 'COMMUNITY',
    audience: 'BRANCH_SPECIFIC',
    targetBranch: 'CSE',
    targetSemester: 'ALL',
    targetScheme: 'ALL',
    targetCollege: 'ALL',
    status: 'DRAFT',
    createdBy: 'Student Activity Coordinator',
    createdAt: '2026-09-06 16:45',
    stats: {
      recipientsCount: 18500,
      deliveredCount: 0,
      openedCount: 0,
    },
  },
  {
    id: 'notif-205',
    title: 'Scheduled System Maintenance Notification',
    body: 'VTU Student Application and Notes Library services will undergo scheduled database maintenance on Sunday between 02:00 AM and 05:00 AM.',
    type: 'SYSTEM',
    audience: 'ALL_STUDENTS',
    targetBranch: 'ALL',
    targetSemester: 'ALL',
    targetScheme: 'ALL',
    targetCollege: 'ALL',
    status: 'SCHEDULED',
    scheduledFor: '2026-09-13 20:00',
    createdBy: 'DevOps System Admin',
    createdAt: '2026-09-06 18:00',
    stats: {
      recipientsCount: 150000,
      deliveredCount: 0,
      openedCount: 0,
    },
  },
];

const INITIAL_LOGS: NotificationAuditLog[] = [
  {
    id: 'nlog-1',
    notificationId: 'notif-201',
    notificationTitle: 'VTU Odd Semester Revaluation Results Announced',
    action: 'SENT',
    triggeredBy: 'Registrar (Evaluation)',
    role: 'EXAM_CONTROLLER',
    timestamp: '2026-09-01 14:30',
    recipients: 45200,
    details: 'Broadcasted instant push notification to 45,200 eligible students.',
  },
];

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_LOGS,
  filterType: 'ALL',
  filterStatus: 'ALL',
  filterAudience: 'ALL',
  searchQuery: '',

  setFilterType: (type) => set({ filterType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterAudience: (aud) => set({ filterAudience: aud }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  createNotification: (data) => {
    const id = `notif-${Date.now()}`;
    const now = new Date().toLocaleString();
    
    // Estimate recipients based on audience
    let estRecipients = 150000;
    if (data.audience === 'BRANCH_SPECIFIC') estRecipients = 24000;
    if (data.audience === 'SEMESTER_SPECIFIC') estRecipients = 18000;
    if (data.audience === 'SCHEME_SPECIFIC') estRecipients = 45000;

    const newNotif: InAppNotification = {
      ...data,
      id,
      createdAt: now,
      stats: {
        recipientsCount: estRecipients,
        deliveredCount: data.status === 'SENT' ? Math.round(estRecipients * 0.96) : 0,
        openedCount: data.status === 'SENT' ? Math.round(estRecipients * 0.72) : 0,
      },
      sentAt: data.status === 'SENT' ? now : undefined,
    };

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: data.title,
      action: data.status === 'SENT' ? 'SENT' : data.status === 'SCHEDULED' ? 'SCHEDULED' : 'CREATED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: estRecipients,
      details: `Created notification of type "${data.type}" with status "${data.status}". Target: Branch=${data.targetBranch}, Sem=${data.targetSemester}, Scheme=${data.targetScheme}.`,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      auditLogs: [newLog, ...state.auditLogs],
    }));

    return id;
  },

  updateNotification: (id, updates) => {
    const now = new Date().toLocaleString();
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: updates.title || target.title,
      action: 'UPDATED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: target.stats.recipientsCount,
      details: `Updated notification parameters.`,
    };

    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  sendImmediately: (id) => {
    const now = new Date().toLocaleString();
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const delivered = Math.round(target.stats.recipientsCount * 0.96);
    const opened = Math.round(target.stats.recipientsCount * 0.74);

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: target.title,
      action: 'SENT',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: target.stats.recipientsCount,
      details: `Dispatched immediate broadcast push notification to ${target.stats.recipientsCount.toLocaleString()} devices.`,
    };

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'SENT',
              sentAt: now,
              scheduledFor: undefined,
              stats: { ...n.stats, deliveredCount: delivered, openedCount: opened },
            }
          : n
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  scheduleNotification: (id, scheduledFor) => {
    const now = new Date().toLocaleString();
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: target.title,
      action: 'SCHEDULED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: target.stats.recipientsCount,
      details: `Scheduled notification for delivery at ${scheduledFor}.`,
    };

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'SCHEDULED', scheduledFor } : n
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  cancelScheduledNotification: (id) => {
    const now = new Date().toLocaleString();
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: target.title,
      action: 'CANCELLED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: target.stats.recipientsCount,
      details: `Cancelled scheduled notification delivery.`,
    };

    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'CANCELLED', scheduledFor: undefined } : n
      ),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  deleteNotification: (id) => {
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: target.title,
      action: 'DELETED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: new Date().toLocaleString(),
      recipients: target.stats.recipientsCount,
      details: `Deleted notification record.`,
    };

    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },
}));
