import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { DetailedUserProfile } from '../../../shared/types/userAdmin.types';

export interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: DetailedUserProfile;
  onConfirmSuspend: (userId: string, reason: string) => void;
}

export const SuspendUserModal: React.FC<SuspendUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmSuspend,
}) => {
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      setErrorMsg('Mandatory suspension reason must be at least 10 characters long.');
      return;
    }

    onConfirmSuspend(user.id, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-base font-black text-foreground">Suspend Student Account</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          You are suspending <strong className="underline">{user.name} ({user.usn})</strong>. This will block student login and mobile access. An audit log entry will be automatically created.
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1">Mandatory Reason for Suspension *</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Uploaded copyrighted textbook or violated VTU community guidelines..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-rose-500/40 outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" type="submit" icon={<ShieldAlert className="h-4 w-4" />}>
              Confirm Account Suspension
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
