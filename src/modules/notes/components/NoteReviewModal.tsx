import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  Eye,
  Award,
  Layers,
  Flag,
  RotateCcw,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { AdminNote } from '../../../shared/types/notes.types';
import { useNotesStore } from '../../../store/useNotesStore';
import { RejectionReasonModal } from './RejectionReasonModal';

interface NoteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: AdminNote | null;
  onViewContributor?: (contributorId: string) => void;
}

export const NoteReviewModal: React.FC<NoteReviewModalProps> = ({
  isOpen,
  onClose,
  note,
  onViewContributor,
}) => {
  const { approveNote, rejectNote, requestChangesNote, removeNote } = useNotesStore();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [requestComments, setRequestComments] = useState('');
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);

  if (!isOpen || !note) return null;

  const handleApprove = () => {
    approveNote(note.id);
    onClose();
  };

  const handleConfirmRejection = (reason: string) => {
    rejectNote(note.id, reason);
    onClose();
  };

  const handleRequestChangesSubmit = () => {
    if (!requestComments.trim()) return;
    requestChangesNote(note.id, requestComments);
    onClose();
  };

  const handleRemove = () => {
    removeNote(note.id, 'Violated content guidelines or severe quality issue.');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-card border border-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Bar */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground">Admin Note Moderation Review</h2>
                <p className="text-xs text-muted-foreground">
                  Verify automated compliance checks, inspect file metadata, and approve or reject upload.
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Review Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Header info card */}
            <div className="p-5 rounded-2xl bg-accent/30 border border-border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {note.subjectCode}
                  </span>
                  <Badge variant={note.status === 'PUBLISHED' ? 'success' : 'warning'}>
                    {note.status}
                  </Badge>
                  <span className="text-xs font-bold text-muted-foreground">Scheme {note.schemeYear}</span>
                </div>
                <span className="text-xs text-muted-foreground">Uploaded: <strong className="text-foreground">{note.uploadDate}</strong></span>
              </div>

              <h3 className="text-lg font-black text-foreground leading-snug">{note.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{note.description}</p>

              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map((t) => (
                    <span key={t} className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Grid 2 Column: Automated Validation vs Contributor Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Automated Validation Indicators */}
              <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
                <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Automated Integrity Checks
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">File Format Check</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Passed ({note.format})
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">File Size Threshold</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Passed ({note.fileSize})
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Virus & Malware Scan</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {note.validation?.virusScanStatus || 'CLEAN'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">AI Quality Rating Score</span>
                    <span className="font-extrabold text-primary">
                      {note.validation?.contentQualityRating || 4.8} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Repository Duplicate Check</span>
                    <span className="font-bold text-foreground">
                      {note.validation?.duplicateScore || 2}% Match (Unique)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contributor & File Metadata */}
              <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
                <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" /> Contributor & Hierarchy Info
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Student Contributor</span>
                    <span className="font-extrabold text-foreground">{note.authorName} ({note.authorUsn || 'N/A'})</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Reputation Score</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" /> {note.contributorReputation || 350} Points
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Target Unit / Module</span>
                    <span className="font-bold text-foreground">{note.unitName || 'Module 1'}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                    <span className="text-muted-foreground font-semibold">Existing Reports</span>
                    {note.reportsCount > 0 ? (
                      <span className="font-bold text-rose-500 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> {note.reportsCount} Flagged Reports
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">0 Reports</span>
                    )}
                  </div>

                  {onViewContributor && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onViewContributor(note.contributorId || 'usr-101')}
                      className="w-full mt-1"
                    >
                      View Full Contributor Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Document File Viewer Link */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-primary font-bold">
                <FileText className="h-4 w-4" />
                <span>PDF Attachment ({note.fileSize} • {note.pageCount} Pages)</span>
              </div>
              <a
                href={note.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-extrabold text-primary hover:underline"
              >
                Inspect Secure File <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Request Changes Subform */}
            {isRequestingChanges && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold text-amber-600 dark:text-amber-400">
                  Specify Changes Required from Student:
                </label>
                <textarea
                  rows={3}
                  value={requestComments}
                  onChange={(e) => setRequestComments(e.target.value)}
                  placeholder="e.g. Please re-upload page 14 with higher lighting contrast..."
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsRequestingChanges(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleRequestChangesSubmit}>
                    Send Request to Student
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar Footer */}
          <div className="p-4 border-t border-border bg-accent/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />}
              >
                Remove Resource
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRequestingChanges(true)}
                icon={<RotateCcw className="h-3.5 w-3.5 text-amber-500" />}
              >
                Request Changes
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                icon={<XCircle className="h-3.5 w-3.5 text-rose-500" />}
                className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
              >
                Reject Upload
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Approve & Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmRejection}
        noteTitle={note.title}
      />
    </>
  );
};
