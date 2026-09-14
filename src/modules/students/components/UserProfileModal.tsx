import React from 'react';
import {
  X,
  UserCheck,
  ShieldAlert,
  Award,
  BookOpen,
  HelpCircle,
  FileText,
  Lock,
  Crown,
  AlertOctagon,
  Calendar,
  Building2,
  CheckCircle2,
  Ban,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { DetailedUserProfile } from '../../../shared/types/userAdmin.types';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: DetailedUserProfile;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onOpenSuspend: (user: DetailedUserProfile) => void;
  onRestore: (id: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onActivate,
  onDeactivate,
  onOpenSuspend,
  onRestore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary text-white font-black text-xl flex items-center justify-center border-2 border-primary/40 shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-primary text-sm">{user.usn}</span>
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
              </div>
              <h3 className="text-lg font-black text-foreground">{user.name}</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security & Privacy Banner */}
        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <span>Sensitive auth credentials (password hashes & tokens) are strictly hidden for admin security compliance.</span>
          </div>
          <Badge variant="primary" className="text-[9px]">
            Redacted
          </Badge>
        </div>

        {/* Basic Academic Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-border bg-accent/20">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">College</span>
            <span className="font-extrabold text-foreground">{user.college}</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-accent/20">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">Branch & Sem</span>
            <span className="font-extrabold text-foreground">{user.branch} • Sem {user.semester}</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-accent/20">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">Scheme</span>
            <span className="font-extrabold text-foreground">{user.scheme} Scheme</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-accent/20">
            <span className="font-bold text-muted-foreground block text-[10px] uppercase">CGPA</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{user.cgpa.toFixed(2)}</span>
          </div>
        </div>

        {/* Subscription & Reputation Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Subscription Card */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Crown className="h-4 w-4" />
                <span>Subscription Plan Status</span>
              </span>
              <Badge variant={user.subscriptionPlan === 'PREMIUM_PRO' ? 'primary' : 'neutral'} className="text-[10px]">
                {user.subscriptionPlan}
              </Badge>
            </div>
            <p className="text-xs text-foreground font-bold">
              Plan: {user.subscriptionPlan === 'PREMIUM_PRO' ? 'VTU Super App Premium PRO' : 'Free Student Plan'}
            </p>
            {user.subscriptionExpiry && (
              <p className="text-[11px] text-muted-foreground font-semibold">
                Valid until: <strong className="text-foreground">{user.subscriptionExpiry}</strong>
              </p>
            )}
          </div>

          {/* Reputation & Badges Card */}
          <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>Reputation & Karma Info</span>
              </span>
              <Badge variant="success" className="text-[10px]">
                {user.reputation.reputationLevel} Rank
              </Badge>
            </div>
            <p className="text-xs text-foreground font-bold">
              Title: {user.reputation.rankTitle} ({user.reputation.karmaPoints} Karma Points)
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold">
              Badges Earned: <strong className="text-foreground">{user.reputation.badgesCount} Community Badges</strong>
            </p>
          </div>
        </div>

        {/* Contribution Telemetry */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
          <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>Student Contribution Statistics</span>
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Notes Uploaded</span>
              <span className="text-base font-black text-foreground">{user.contributions.notesUploaded}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">PYQs Shared</span>
              <span className="text-base font-black text-foreground">{user.contributions.pyqsShared}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Forum Answers</span>
              <span className="text-base font-black text-foreground">{user.contributions.forumAnswersCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Verified Items</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{user.contributions.verifiedContributions}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-accent/20 border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Upvotes Received</span>
              <span className="text-base font-black text-purple-600 dark:text-purple-400">{user.contributions.totalUpvotes}</span>
            </div>
          </div>
        </div>

        {/* Suspension Reason Warning if Suspended */}
        {user.status === 'SUSPENDED' && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-black">
              <AlertOctagon className="h-4 w-4" />
              <span>Account Suspended on {user.suspendedAt}</span>
            </div>
            <p className="font-semibold">{user.suspensionReason}</p>
          </div>
        )}

        {/* Account Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Profile
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {user.status === 'SUSPENDED' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRestore(user.id)}
                icon={<RotateCcw className="h-4 w-4" />}
              >
                Restore Account Access
              </Button>
            ) : (
              <>
                {user.status === 'DEACTIVATED' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onActivate(user.id)}
                    icon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Activate Account
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeactivate(user.id)}
                    icon={<Ban className="h-4 w-4 text-amber-500" />}
                  >
                    Deactivate Account
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onOpenSuspend(user)}
                  icon={<ShieldAlert className="h-4 w-4" />}
                >
                  Suspend Account
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
