import { create } from 'zustand';
import { InAppNotification, NotificationAuditLog, NotificationType, NotificationStatus, AudienceType } from '../shared/types/notification.types';
import { apiClient } from '../shared/api/apiClient';

interface NotificationStoreState {
  notifications: InAppNotification[];
  auditLogs: NotificationAuditLog[];
  filterType: NotificationType | 'ALL';
  filterStatus: NotificationStatus | 'ALL';
  filterAudience: AudienceType | 'ALL';
  searchQuery: string;
  isLoading: boolean;

  // Setters
  setFilterType: (type: NotificationType | 'ALL') => void;
  setFilterStatus: (status: NotificationStatus | 'ALL') => void;
  setFilterAudience: (aud: AudienceType | 'ALL') => void;
  setSearchQuery: (query: string) => void;

  // Actions
  fetchNotifications: () => Promise<void>;
  createNotification: (data: Omit<InAppNotification, 'id' | 'createdAt' | 'stats'>) => string;
  updateNotification: (id: string, updates: Partial<InAppNotification>) => void;
  sendImmediately: (id: string) => Promise<void>;
  scheduleNotification: (id: string, scheduledFor: string) => void;
  cancelScheduledNotification: (id: string) => void;
  deleteNotification: (id: string) => Promise<void>;
}

const INITIAL_NOTIFICATIONS: InAppNotification[] = [];

const INITIAL_LOGS: NotificationAuditLog[] = [];

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  auditLogs: INITIAL_LOGS,
  filterType: 'ALL',
  filterStatus: 'ALL',
  filterAudience: 'ALL',
  searchQuery: '',
  isLoading: false,

  setFilterType: (type) => set({ filterType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterAudience: (aud) => set({ filterAudience: aud }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const [resNotifs, resLogs]: any = await Promise.all([
        apiClient.get('/notifications'),
        apiClient.get('/notifications/audit-logs').catch(() => ({ data: [] })),
      ]);

      const body = resNotifs.data?.data || resNotifs.data || resNotifs;
      const rawList = Array.isArray(body) ? body : body.items || body.data || [];

      if (Array.isArray(rawList) && rawList.length > 0) {
        const mappedNotifs: InAppNotification[] = rawList.map((n: any) => ({
          id: n.id,
          title: n.title,
          body: n.body || n.fullMessage || '',
          type: (n.type as NotificationType) || 'CIRCULAR',
          audience: (n.audience as AudienceType) || 'ALL_STUDENTS',
          targetBranch: n.targetBranch || 'ALL',
          targetSemester: n.targetSemester === 'ALL' ? 'ALL' : Number(n.targetSemester) || 'ALL',
          targetScheme: n.targetScheme || 'ALL',
          targetCollege: n.targetCollege || 'ALL',
          status: (n.status as NotificationStatus) || 'SENT',
          scheduledFor: n.scheduledFor,
          sentAt: n.sentAt || n.createdAt,
          createdBy: n.createdBy || 'VTU Admin Panel',
          createdAt: n.createdAt || new Date().toISOString(),
          attachmentUrl: n.attachmentUrl,
          actionUrl: n.actionUrl,
          stats: {
            recipientsCount: n.stats?.recipientsCount ?? n.recipientsCount ?? 1,
            deliveredCount: n.stats?.deliveredCount ?? n.deliveredCount ?? 0,
            openedCount: n.stats?.openedCount ?? n.openedCount ?? 0,
          },
        }));

        set({ notifications: mappedNotifs });
      }

      const logBody = resLogs.data?.data || resLogs.data || resLogs;
      const rawLogs = Array.isArray(logBody) ? logBody : logBody.items || [];
      if (Array.isArray(rawLogs) && rawLogs.length > 0) {
        const mappedLogs: NotificationAuditLog[] = rawLogs.map((l: any) => ({
          id: l.id,
          notificationId: l.notificationId,
          notificationTitle: l.notificationTitle,
          action: l.action,
          triggeredBy: l.triggeredBy,
          role: l.role,
          timestamp: l.timestamp || l.createdAt,
          recipients: l.recipients,
          details: l.details || '',
        }));
        set({ auditLogs: mappedLogs });
      }
    } catch (err) {
      console.warn('Could not fetch notifications from backend API, using cached state:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  createNotification: (data) => {
    const id = `notif-${Date.now()}`;
    const now = new Date().toLocaleString();
    const isSent = data.status === 'SENT';

    const newNotif: InAppNotification = {
      ...data,
      id,
      createdAt: now,
      stats: {
        recipientsCount: 1,
        deliveredCount: isSent ? 1 : 0,
        openedCount: 0,
      },
      sentAt: isSent ? now : undefined,
    };

    const newLog: NotificationAuditLog = {
      id: `nlog-${Date.now()}`,
      notificationId: id,
      notificationTitle: data.title,
      action: isSent ? 'SENT' : data.status === 'SCHEDULED' ? 'SCHEDULED' : 'CREATED',
      triggeredBy: 'Super Admin',
      role: 'SUPER_ADMIN',
      timestamp: now,
      recipients: 1,
      details: `Created notification of type "${data.type}" with status "${data.status}". Target: Branch=${data.targetBranch}, Sem=${data.targetSemester}, Scheme=${data.targetScheme}.`,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      auditLogs: [newLog, ...state.auditLogs],
    }));

    // Post to backend database & broadcast live
    apiClient
      .post('/notifications/broadcast', {
        title: data.title,
        body: data.body,
        type: data.type,
        category: data.type === 'EXAM' ? 'Exams' : data.type === 'RESULT' ? 'Results' : 'Academic',
        priority: 'Normal',
        audience: data.audience,
        targetBranch: data.targetBranch,
        targetSemester: String(data.targetSemester),
        targetScheme: data.targetScheme,
        targetCollege: data.targetCollege,
        status: data.status,
        scheduledFor: data.scheduledFor,
        attachmentUrl: data.attachmentUrl,
        actionUrl: data.actionUrl,
        createdBy: data.createdBy || 'Super Admin',
      })
      .then((response: any) => {
        const savedData = response.data?.data || response.data;
        if (savedData?.id) {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id
                ? {
                    ...n,
                    id: savedData.id,
                    stats: {
                      recipientsCount: savedData.recipientsCount ?? n.stats.recipientsCount,
                      deliveredCount: savedData.deliveredCount ?? n.stats.deliveredCount,
                      openedCount: savedData.openedCount ?? n.stats.openedCount,
                    },
                  }
                : n
            ),
          }));
          get().fetchNotifications();
        }
      })
      .catch((err) => {
        console.error('Error posting notification to backend API:', err);
      });

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

  sendImmediately: async (id) => {
    const now = new Date().toLocaleString();
    const target = get().notifications.find((n) => n.id === id);
    if (!target) return;

    const delivered = target.stats.recipientsCount;
    const opened = target.stats.openedCount;

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

    try {
      await apiClient.post('/notifications/broadcast', {
        title: target.title,
        body: target.body,
        type: target.type,
        category: target.type === 'EXAM' ? 'Exams' : target.type === 'RESULT' ? 'Results' : 'Academic',
        priority: 'Normal',
        audience: target.audience,
        targetBranch: target.targetBranch,
        targetSemester: String(target.targetSemester),
        targetScheme: target.targetScheme,
        targetCollege: target.targetCollege,
        status: 'SENT',
        attachmentUrl: target.attachmentUrl,
        actionUrl: target.actionUrl,
        createdBy: target.createdBy,
      });
    } catch (err) {
      console.warn('Failed to send immediate notification via API:', err);
    }
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

  deleteNotification: async (id) => {
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

    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn('Failed to delete notification on backend:', err);
    }
  },
}));
