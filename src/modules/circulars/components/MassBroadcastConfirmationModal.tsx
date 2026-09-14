import React from 'react';
import { AlertTriangle, Send, Users, ShieldAlert, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { InAppNotification } from '../../../shared/types/notification.types';

interface MassBroadcastConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: Partial<InAppNotification> | null;
}

export const MassBroadcastConfirmationModal: React.FC<MassBroadcastConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
}) => {
  if (!isOpen || !data) return null;

  // Calculate estimated recipients
  let estRecipients = 150000;
  if (data.audience === 'BRANCH_SPECIFIC') estRecipients = 24000;
  if (data.audience === 'SEMESTER_SPECIFIC') estRecipients = 18000;
  if (data.audience === 'SCHEME_SPECIFIC') estRecipients = 45000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-rose-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Mass Broadcast Confirmation Required</h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                High-Impact Operational Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            You are about to trigger an instant push notification broadcast across the VTU mobile ecosystem. Please confirm target specifications before dispatching:
          </p>

          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Notification Header:</span>
              <span className="font-extrabold text-foreground">{data.title}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Category Type:</span>
              <span className="font-extrabold text-primary">{data.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Audience Scope:</span>
              <span className="font-extrabold text-foreground">{data.audience}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">Targeting:</span>
              <span className="font-bold text-foreground">
                Branch: {data.targetBranch} | Sem: {data.targetSemester} | Scheme: {data.targetScheme}
              </span>
            </div>
          </div>

          {/* Impact Stats Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Users className="h-7 w-7 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">Estimated Audience Reach</span>
              <span className="text-lg font-black text-foreground block">
                {estRecipients.toLocaleString()} Registered Active Mobile Devices
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground italic">
            Note: Once triggered, push notifications will be queued immediately in Firebase Cloud Messaging (FCM) and cannot be recalled.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-accent/20">
          <Button variant="outline" onClick={onClose}>
            Cancel Action
          </Button>
          <Button
            variant="primary"
            className="bg-rose-600 hover:bg-rose-700 text-white"
            icon={<Send className="h-4 w-4" />}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm & Broadcast Now
          </Button>
        </div>
      </div>
    </div>
  );
};
