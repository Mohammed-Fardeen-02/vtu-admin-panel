import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  UserCheck,
  ShieldAlert,
  Award,
  Eye,
  Edit,
  ShieldCheck,
  Crown,
  Lock,
  RotateCcw,
  Ban,
  CheckCircle2,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Badge } from '../../shared/components/ui/Badge';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { UserProfileModal } from './components/UserProfileModal';
import { SuspendUserModal } from './components/SuspendUserModal';
import { AuditLogModal } from './components/AuditLogModal';

import { useUserAdminStore } from '../../store/useUserAdminStore';
import { DetailedUserProfile, AdminRole } from '../../shared/types/userAdmin.types';

export const StudentsListPage: React.FC = () => {
  const {
    users,
    auditLogs,
    currentAdminRole,
    isLoadingUsers,
    fetchUsers,
    setAdminRole,
    activateUser,
    deactivateUser,
    suspendUser,
    restoreUser,
  } = useUserAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState('ALL');

  // Modals State
  const [selectedUser, setSelectedUser] = useState<DetailedUserProfile | null>(null);
  const [userForSuspend, setUserForSuspend] = useState<DetailedUserProfile | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.usn.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.college.toLowerCase().includes(search.toLowerCase());

      const matchesBranch = selectedBranch === 'ALL' || u.branch === selectedBranch;
      const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;
      const matchesPlan = selectedPlan === 'ALL' || u.subscriptionPlan === selectedPlan;

      return matchesSearch && matchesBranch && matchesStatus && matchesPlan;
    });
  }, [users, search, selectedBranch, selectedStatus, selectedPlan]);

  const activeCount = users.filter((u) => u.status === 'VERIFIED' || u.status === 'ACTIVE').length;
  const suspendedCount = users.filter((u) => u.status === 'SUSPENDED').length;
  const premiumCount = users.filter((u) => u.subscriptionPlan === 'PREMIUM_PRO').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="User Governance & Student Directory (ADMIN-FR-06)"
          description="Manage student account permissions, contribution reputation, suspensions, role-based controls, and security audit logs."
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers()}
            disabled={isLoadingUsers}
            icon={<RefreshCw className={`h-4 w-4 text-primary ${isLoadingUsers ? 'animate-spin' : ''}`} />}
          >
            {isLoadingUsers ? 'Syncing...' : 'Refresh'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAuditModalOpen(true)}
            icon={<ShieldCheck className="h-4 w-4 text-primary" />}
          >
            Audit Logs ({auditLogs.length})
          </Button>

          {/* Admin Role Selector Switcher */}
          <select
            value={currentAdminRole}
            onChange={(e) => setAdminRole(e.target.value as AdminRole)}
            className="px-3 py-2 text-xs rounded-xl border border-primary/40 bg-primary/10 text-primary font-black cursor-pointer focus:ring-2 focus:ring-primary/40 outline-none"
          >
            <option value="SUPER_ADMIN">Role: Super Admin</option>
            <option value="EXAM_CONTROLLER">Role: Exam Controller</option>
            <option value="CONTENT_MODERATOR">Role: Content Moderator</option>
            <option value="AUDITOR">Role: Auditor</option>
          </select>
        </div>
      </div>

      {/* Security Compliance Banner */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <span>
            <strong className="text-foreground">Credential Privacy Shield Enabled:</strong> Passwords, OAuth tokens, and auth secrets are strictly redacted across all admin views.
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
          <span>Active Users: <strong className="text-emerald-600 dark:text-emerald-400">{activeCount}</strong></span>
          <span>Suspended: <strong className="text-rose-600 dark:text-rose-400">{suspendedCount}</strong></span>
          <span>Premium PRO: <strong className="text-amber-600 dark:text-amber-400">{premiumCount}</strong></span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col xl:flex-row items-center justify-between gap-3">
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by USN (e.g. 1VA21CS042), Name, or College..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
            {/* Branch */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="AIML">AIML</option>
              <option value="EEE">EEE</option>
              <option value="CIVIL">CIVIL</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="VERIFIED">Verified / Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PROVISIONAL">Provisional</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>

            {/* Subscription */}
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
            >
              <option value="ALL">All Subscription Plans</option>
              <option value="PREMIUM_PRO">Premium PRO</option>
              <option value="FREE_STUDENT">Free Student</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-table-header-bg text-table-header-text">
                  <th className="p-4 font-extrabold rounded-tl-2xl">USN & Student Name</th>
                  <th className="p-4 font-extrabold">College Name & Region</th>
                  <th className="p-4 font-extrabold">Branch & Sem</th>
                  <th className="p-4 font-extrabold">Scheme</th>
                  <th className="p-4 font-extrabold text-center">CGPA</th>
                  <th className="p-4 font-extrabold text-center">Subscription</th>
                  <th className="p-4 font-extrabold text-center">Account Status</th>
                  <th className="p-4 font-extrabold text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-muted-foreground">
                      <UserCheck className="h-10 w-10 text-primary mx-auto mb-2 opacity-50" />
                      <p className="font-bold">No Students Found</p>
                      <p className="text-[11px] mt-0.5">Try resetting search filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-accent/40 transition-colors">
                      <td className="p-4 space-y-0.5">
                        <span className="font-black text-primary block text-sm">{user.usn}</span>
                        <span className="font-extrabold text-foreground">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground block">{user.email}</span>
                      </td>

                      <td className="p-4 text-muted-foreground max-w-xs truncate">
                        <span className="font-bold text-foreground block truncate">{user.college}</span>
                        <span className="text-[10px] font-semibold">{user.collegeCity} • {user.region}</span>
                      </td>

                      <td className="p-4 font-extrabold space-y-1">
                        <Badge variant="primary" className="text-[10px]">
                          {user.branch}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground block">Sem {user.semester}</span>
                      </td>

                      <td className="p-4 font-semibold text-foreground">{user.scheme} Scheme</td>

                      <td className="p-4 text-center font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {user.cgpa.toFixed(2)}
                      </td>

                      <td className="p-4 text-center">
                        <Badge
                          variant={user.subscriptionPlan === 'PREMIUM_PRO' ? 'primary' : 'neutral'}
                          className="text-[9px]"
                        >
                          {user.subscriptionPlan}
                        </Badge>
                      </td>

                      <td className="p-4 text-center">
                        <Badge
                          variant={
                            user.status === 'VERIFIED' || user.status === 'ACTIVE'
                              ? 'success'
                              : user.status === 'SUSPENDED'
                              ? 'error'
                              : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {user.status}
                        </Badge>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye className="h-3.5 w-3.5 text-primary" />}
                            onClick={() => setSelectedUser(user)}
                          >
                            Inspect Profile
                          </Button>

                          {user.status === 'SUSPENDED' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<RotateCcw className="h-3.5 w-3.5" />}
                              onClick={() => restoreUser(user.id, 'Dr. K. V. Suresh')}
                            >
                              Restore
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              icon={<ShieldAlert className="h-3.5 w-3.5" />}
                              onClick={() => setUserForSuspend(user)}
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedUser && (
        <UserProfileModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onActivate={(id) => activateUser(id, 'Dr. K. V. Suresh')}
          onDeactivate={(id) => deactivateUser(id, 'Dr. K. V. Suresh')}
          onOpenSuspend={(u) => setUserForSuspend(u)}
          onRestore={(id) => restoreUser(id, 'Dr. K. V. Suresh')}
        />
      )}

      {userForSuspend && (
        <SuspendUserModal
          isOpen={!!userForSuspend}
          onClose={() => setUserForSuspend(null)}
          user={userForSuspend}
          onConfirmSuspend={(id, reason) => suspendUser(id, reason, 'Dr. K. V. Suresh')}
        />
      )}

      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
};
