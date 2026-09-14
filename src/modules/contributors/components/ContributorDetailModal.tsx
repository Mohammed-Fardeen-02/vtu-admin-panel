import React, { useState } from 'react';
import { X, User, Award, ShieldAlert, CheckCircle2, Ban, RefreshCcw, Download, ThumbsUp, FileText } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Badge } from '../../../shared/components/ui/Badge';
import { ContributorProfile } from '../../../shared/types/reward.types';
import { useRewardStore } from '../../../store/useRewardStore';

interface ContributorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributor: ContributorProfile | null;
}

export const ContributorDetailModal: React.FC<ContributorDetailModalProps> = ({
  isOpen,
  onClose,
  contributor,
}) => {
  const { adjustContributorReputation, suspendContributionPrivileges, restoreContributionPrivileges } = useRewardStore();

  const [isAdjustRepOpen, setIsAdjustRepOpen] = useState(false);
  const [newReputation, setNewReputation] = useState(contributor?.reputationScore || 0);
  const [repReason, setRepReason] = useState('');

  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  if (!isOpen || !contributor) return null;

  const handleSaveReputation = () => {
    if (!repReason.trim()) return;
    adjustContributorReputation(contributor.id, newReputation, repReason, 'Dr. K. V. Suresh (SuperAdmin)');
    setIsAdjustRepOpen(false);
    onClose();
  };

  const handleConfirmSuspend = () => {
    if (!suspendReason.trim()) return;
    suspendContributionPrivileges(contributor.id, suspendReason, 'Dr. K. V. Suresh (SuperAdmin)');
    setIsSuspendOpen(false);
    onClose();
  };

  const handleRestore = () => {
    restoreContributionPrivileges(contributor.id, 'Dr. K. V. Suresh (SuperAdmin)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Contributor Profile & Governance</h3>
              <p className="text-xs text-muted-foreground">{contributor.name} ({contributor.usn})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status banner */}
          {contributor.isContributionSuspended && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs">
              <Ban className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block">
                  Contribution Privileges Suspended
                </span>
                <p className="text-muted-foreground mt-0.5">{contributor.suspensionReason}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Uploads</span>
              <p className="text-lg font-black text-foreground">{contributor.uploadCount}</p>
              <span className="text-[10px] text-emerald-600 font-bold">{contributor.publishedCount} Published</span>
            </div>

            <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Downloads</span>
              <p className="text-lg font-black text-primary">{contributor.downloadsCount.toLocaleString()}</p>
              <span className="text-[10px] text-muted-foreground">{contributor.usefulVotes} Useful Votes</span>
            </div>

            <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Reputation Score</span>
              <p className="text-lg font-black text-amber-500">{contributor.reputationScore}</p>
              <span className="text-[10px] text-muted-foreground">{contributor.totalXp} XP</span>
            </div>

            <div className="p-3 rounded-xl bg-accent/40 border border-border space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Reports Received</span>
              <p className="text-lg font-black text-rose-500">{contributor.reportsReceived}</p>
              <span className="text-[10px] text-muted-foreground">{contributor.rejectedCount} Rejected Notes</span>
            </div>
          </div>

          {/* Badges */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Earned Badges & Milestones</label>
            <div className="flex flex-wrap gap-1.5">
              {contributor.badges.map((b) => (
                <Badge key={b} variant="primary" className="text-[11px]">
                  🏆 {b}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reputation Adjust Form */}
          {isAdjustRepOpen && (
            <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3 animate-in fade-in">
              <h4 className="text-xs font-black text-foreground">Adjust Contributor Reputation Score</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1">New Score</label>
                  <Input
                    type="number"
                    value={newReputation}
                    onChange={(e) => setNewReputation(parseInt(e.target.value, 10))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1">Mandatory Justification</label>
                  <Input
                    value={repReason}
                    onChange={(e) => setRepReason(e.target.value)}
                    placeholder="Reason for reputation adjustment..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsAdjustRepOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveReputation}>
                  Save & Log Audit
                </Button>
              </div>
            </div>
          )}

          {/* Suspension Form */}
          {isSuspendOpen && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-black text-rose-600 dark:text-rose-400">Suspend Contribution Privileges</h4>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">Suspension Reason</label>
                <textarea
                  rows={2}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Specify violation or quality issue..."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsSuspendOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleConfirmSuspend}>
                  Confirm Privilege Suspension
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-accent/20">
          <Button variant="outline" size="sm" onClick={() => setIsAdjustRepOpen(true)} icon={<Award className="h-3.5 w-3.5" />}>
            Adjust Reputation
          </Button>

          <div className="flex items-center gap-2">
            {contributor.isContributionSuspended ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRestore}
                icon={<RefreshCcw className="h-3.5 w-3.5" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Restore Contribution Privileges
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSuspendOpen(true)}
                icon={<Ban className="h-3.5 w-3.5 text-rose-500" />}
                className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
              >
                Suspend Contribution Privileges
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
