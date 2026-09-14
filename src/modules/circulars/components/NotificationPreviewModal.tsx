import React from 'react';
import { X, Smartphone, Bell, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { InAppNotification } from '../../../shared/types/notification.types';

interface NotificationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Partial<InAppNotification> | null;
}

export const NotificationPreviewModal: React.FC<NotificationPreviewModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-foreground">Mobile Push Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Smartphone Shell Representation */}
        <div className="p-6 bg-slate-950 flex flex-col items-center">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[28px] border-4 border-slate-800 p-4 shadow-2xl text-slate-100 space-y-4">
            {/* Status bar mock */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 font-mono">
              <span>09:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Notification Card (iOS / Android banner style) */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px]">
                    VTU
                  </div>
                  <span className="font-bold text-slate-200 text-xs">VTU Student Portal</span>
                </div>
                <span className="text-[10px] text-slate-400">now</span>
              </div>

              <h4 className="font-black text-sm text-slate-100 leading-snug">
                {data.title || 'Notification Title'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {data.body || 'Notification message description text will appear here.'}
              </p>

              {data.attachmentUrl && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-700/50 border border-slate-600/50 text-[11px] text-primary">
                  <FileText className="h-3.5 w-3.5" /> PDF Circular Attached
                </div>
              )}

              {data.actionUrl && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-sky-400">
                    Tap to open portal <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              )}
            </div>

            {/* Scope Badge */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block">Target Audience</span>
              <span className="text-xs font-bold text-slate-200 block">
                Audience: {data.audience || 'ALL_STUDENTS'}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Branch: {data.targetBranch || 'ALL'} | Sem: {data.targetSemester || 'ALL'} | Scheme: {data.targetScheme || 'ALL'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end bg-card">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done Previewing
          </Button>
        </div>
      </div>
    </div>
  );
};
