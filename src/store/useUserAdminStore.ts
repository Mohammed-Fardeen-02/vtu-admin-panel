import { create } from 'zustand';
import {
  DetailedUserProfile,
  AuditLogEntry,
  AdminRole,
  UserAccountStatus,
} from '../shared/types/userAdmin.types';
import { apiClient } from '../shared/api/apiClient';

const mapBackendUserToDetailedProfile = (u: any): DetailedUserProfile => {
  const collegeMap: Record<string, { name: string; city: string; region: any }> = {
    '1VA': { name: 'Sai Vidya Institute of Technology', city: 'Bengaluru', region: 'BENGALURU' },
    '1RV': { name: 'RV College of Engineering', city: 'Bengaluru', region: 'BENGALURU' },
    '1BM': { name: 'BMS College of Engineering', city: 'Bengaluru', region: 'BENGALURU' },
    '1BMS': { name: 'BMS College of Engineering', city: 'Bengaluru', region: 'BENGALURU' },
    '1MS': { name: 'Ramaiah Institute of Technology', city: 'Bengaluru', region: 'BENGALURU' },
  };

  const collegeInfo = collegeMap[u.collegeCode] || {
    name: u.collegeCode ? `${u.collegeCode} Affiliated College` : 'Sai Vidya Institute of Technology',
    city: 'Bengaluru',
    region: 'BENGALURU',
  };

  const createdDate = u.createdAt ? new Date(u.createdAt) : new Date();
  const joinedYear = createdDate.getFullYear();
  const formattedDate = createdDate.toISOString().replace('T', ' ').substring(0, 16);

  return {
    id: u.id,
    usn: u.usn || u.studentProfile?.usn || '1VA21CS001',
    name: u.name || 'Student User',
    email: u.email || '',
    phone: u.phone || '+91 98765 00000',
    college: collegeInfo.name,
    collegeCity: collegeInfo.city,
    region: collegeInfo.region,
    branch: u.branchCode || u.studentProfile?.branchCode || 'CSE',
    semester: u.semester || u.studentProfile?.semester || 1,
    scheme: u.schemeYear || u.studentProfile?.schemeYear || '2022',
    cgpa: u.targetCgpa || u.studentProfile?.targetCgpa || 8.5,
    status: (u.status === 'ACTIVE' || u.status === 'VERIFIED' ? 'VERIFIED' : u.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE') as UserAccountStatus,
    joinedYear,
    subscriptionPlan: 'FREE_STUDENT',
    lastLoginDate: formattedDate,
    contributions: {
      notesUploaded: 0,
      pyqsShared: 0,
      forumAnswersCount: 0,
      verifiedContributions: 0,
      totalUpvotes: 0,
    },
    reputation: {
      karmaPoints: 100,
      reputationLevel: 'BRONZE',
      badgesCount: 1,
      rankTitle: 'Student Member',
    },
    reports: [],
  };
};

const INITIAL_USERS: DetailedUserProfile[] = [];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2026-09-02 14:10',
    adminName: 'Dr. K. V. Suresh',
    adminRole: 'EXAM_CONTROLLER',
    actionType: 'USER_SUSPENDED',
    targetEntityId: 's-103',
    targetEntityName: 'Rohan Kulkarni (1RV20ME089)',
    details: 'Account suspended due to copyright violation report on MECH textbook upload.',
    ipAddress: '14.139.155.2',
  },
];

interface UserAdminStore {
  users: DetailedUserProfile[];
  auditLogs: AuditLogEntry[];
  currentAdminRole: AdminRole;
  isLoadingUsers: boolean;
  userError: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  setAdminRole: (role: AdminRole) => void;
  activateUser: (userId: string, adminName: string) => void;
  deactivateUser: (userId: string, adminName: string) => void;
  suspendUser: (userId: string, reason: string, adminName: string) => void;
  restoreUser: (userId: string, adminName: string) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export const useUserAdminStore = create<UserAdminStore>((set, get) => ({
  users: INITIAL_USERS,
  auditLogs: INITIAL_AUDIT_LOGS,
  currentAdminRole: 'SUPER_ADMIN',
  isLoadingUsers: false,
  userError: null,

  fetchUsers: async () => {
    set({ isLoadingUsers: true, userError: null });
    try {
      const response = await apiClient.get('/users?limit=100');
      const payload = response.data?.data || response.data;
      const data = payload?.items || (Array.isArray(payload) ? payload : []);
      if (Array.isArray(data)) {
        const liveUsers = data
          .filter((u: any) => u.role === 'STUDENT' || u.role?.code === 'STUDENT' || !u.role)
          .map(mapBackendUserToDetailedProfile);
        set({ users: liveUsers, isLoadingUsers: false });
      } else {
        set({ users: [], isLoadingUsers: false });
      }
    } catch (err: any) {
      console.warn('[UserAdminStore] Fetch users warning:', err?.message);
      set({ isLoadingUsers: false, userError: err?.message || 'Failed to fetch live users' });
    }
  },

  setAdminRole: (role) => set({ currentAdminRole: role }),

  addAuditLog: (entry) => {
    const { auditLogs } = get();
    const newLog: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    set({ auditLogs: [newLog, ...auditLogs] });
  },

  activateUser: (userId, adminName) => {
    const { users, currentAdminRole, addAuditLog } = get();
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, status: 'VERIFIED' } : u)),
    }));

    addAuditLog({
      adminName,
      adminRole: currentAdminRole,
      actionType: 'USER_STATUS_CHANGE',
      targetEntityId: userId,
      targetEntityName: `${target.name} (${target.usn})`,
      details: 'Account activated/verified by administrator.',
      ipAddress: '14.139.155.2',
    });
  },

  deactivateUser: (userId, adminName) => {
    const { users, currentAdminRole, addAuditLog } = get();
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, status: 'DEACTIVATED' } : u)),
    }));

    addAuditLog({
      adminName,
      adminRole: currentAdminRole,
      actionType: 'USER_STATUS_CHANGE',
      targetEntityId: userId,
      targetEntityName: `${target.name} (${target.usn})`,
      details: 'Account deactivated by administrator.',
      ipAddress: '14.139.155.2',
    });
  },

  suspendUser: (userId, reason, adminName) => {
    const { users, currentAdminRole, addAuditLog } = get();
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'SUSPENDED',
              suspensionReason: reason,
              suspendedAt: new Date().toISOString().split('T')[0],
            }
          : u
      ),
    }));

    addAuditLog({
      adminName,
      adminRole: currentAdminRole,
      actionType: 'USER_SUSPENDED',
      targetEntityId: userId,
      targetEntityName: `${target.name} (${target.usn})`,
      details: `Suspended account: ${reason}`,
      ipAddress: '14.139.155.2',
    });
  },

  restoreUser: (userId, adminName) => {
    const { users, currentAdminRole, addAuditLog } = get();
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: 'VERIFIED',
              suspensionReason: undefined,
              suspendedAt: undefined,
            }
          : u
      ),
    }));

    addAuditLog({
      adminName,
      adminRole: currentAdminRole,
      actionType: 'USER_RESTORED',
      targetEntityId: userId,
      targetEntityName: `${target.name} (${target.usn})`,
      details: 'Account restored from suspension state.',
      ipAddress: '14.139.155.2',
    });
  },
}));
