import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  noteTitle: string;
}

const REJECTION_PRESETS = [
  'Low scan clarity / unreadable handwriting',
  'Incorrect VTU subject or scheme mapping',
  'Contains copyrighted textbook content / publisher PDF',
  'Incomplete notes missing essential modules',
  'Duplicate submission already present in repository',
  'Inappropriate or non-academic content included',
];

export const RejectionReasonModal: React.FC<RejectionReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
}) => {
  const [reason, setReason] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setReason(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-rose-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between bg-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Reject Student Upload</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[280px]">{noteTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground">
            A mandatory rejection reason must be provided. This feedback will be sent directly to the student contributor and recorded in the audit history.
          </p>

          {/* Presets */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-muted-foreground">Quick Rejection Presets:</label>
            <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {REJECTION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                    selectedPreset === preset
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40'
                      : 'bg-accent/30 text-foreground border-border hover:bg-accent'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Detailed Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this note submission was rejected..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={!reason.trim()}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
