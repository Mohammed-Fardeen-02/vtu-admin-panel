import React from 'react';
import { X, ShieldCheck, Clock, User, Terminal } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { AuditLogEntry } from '../../../shared/types/userAdmin.types';

export interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-black text-foreground">Governance Audit Logs (ADMIN-FR-06)</h3>
              <p className="text-xs text-muted-foreground">Immutable administrative action history and security audit trail.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">No audit logs recorded yet.</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-border bg-accent/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>{log.adminName}</span>
                    <Badge variant="primary" className="text-[9px]">
                      {log.adminRole}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">{log.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={log.actionType.includes('SUSPENDED') ? 'error' : 'success'} className="text-[9px]">
                    {log.actionType}
                  </Badge>
                  <span className="font-extrabold text-foreground">{log.targetEntityName}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/40">
                  {log.details}
                </p>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1">
                  <span>IP Address: {log.ipAddress}</span>
                  <span>Entry ID: {log.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Audit Logs
          </Button>
        </div>
      </div>
    </div>
  );
};
