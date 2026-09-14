import React, { useState } from 'react';
import { X, Layers, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { useAcademicStore } from '../../../store/useAcademicStore';

export interface BulkReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirmReassign: (
    targetSubjectId: string,
    subjectCode: string,
    subjectName: string,
    branchCode: string,
    schemeYear: string,
    semester: number
  ) => void;
}

export const BulkReassignModal: React.FC<BulkReassignModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onConfirmReassign,
}) => {
  const { branches, schemes, semesters, subjects } = useAcademicStore();

  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState<number>(5);
  const [targetSubjectId, setTargetSubjectId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableSubjects = subjects.filter(
    (s) =>
      s.branchCode === branchCode &&
      s.schemeYear === schemeYear &&
      s.semester === semester
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSubj = subjects.find((s) => s.id === targetSubjectId);
    if (!targetSubj) {
      setErrorMsg('Please select a target subject.');
      return;
    }

    onConfirmReassign(
      targetSubj.id,
      targetSubj.code,
      targetSubj.name,
      branchCode,
      schemeYear,
      semester
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-black text-foreground">Bulk Reassign Academic Subject</h3>
            <p className="text-xs text-muted-foreground">
              Reassign {selectedCount} selected notes to a central Academic Subject entity.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-foreground mb-1">Branch</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.code}>
                    {b.code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Scheme</label>
              <select
                value={schemeYear}
                onChange={(e) => setSchemeYear(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.year}>
                    {s.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.semesterNumber}>
                    Sem {sem.semesterNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Target Subject Entity *</label>
            <select
              value={targetSubjectId}
              onChange={(e) => setTargetSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
              required
            >
              <option value="">-- Select Target Subject --</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<Layers className="h-4 w-4" />}>
              Reassign {selectedCount} Notes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
