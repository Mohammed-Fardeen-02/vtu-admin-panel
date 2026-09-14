import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { CalendarEvent, CalendarEventCategory, CalendarEventStatus } from '../../../shared/types/calendar.types';
import { useCalendarStore } from '../../../store/useCalendarStore';
import { useAcademicStore } from '../../../store/useAcademicStore';

interface CalendarEventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CalendarEvent | null;
}

export const CalendarEventFormModal: React.FC<CalendarEventFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addEvent, updateEvent } = useCalendarStore();
  const { branches, schemes } = useAcademicStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CalendarEventCategory>('INTERNAL_EXAM');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branchId, setBranchId] = useState('ALL');
  const [schemeId, setSchemeId] = useState('ALL');
  const [semester, setSemester] = useState<string>('ALL');
  const [status, setStatus] = useState<CalendarEventStatus>('PUBLISHED');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setBranchId(initialData.branchId);
      setSchemeId(initialData.schemeId);
      setSemester(String(initialData.semester));
      setStatus(initialData.status);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setCategory('INTERNAL_EXAM');
      setStartDate(today);
      setEndDate(today);
      setBranchId('ALL');
      setSchemeId('ALL');
      setSemester('ALL');
      setStatus('PUBLISHED');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    if (startDate && endDate && endDate < startDate) {
      errs.endDate = 'End date cannot be before start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const semVal = semester === 'ALL' ? 'ALL' : parseInt(semester, 10);

    if (initialData) {
      updateEvent(initialData.id, {
        title,
        description,
        category,
        startDate,
        endDate,
        branchId,
        schemeId,
        semester: semVal,
        status,
      });
    } else {
      addEvent({
        title,
        description,
        category,
        startDate,
        endDate,
        branchId,
        schemeId,
        semester: semVal,
        status,
        createdBy: 'Admin',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                {initialData ? 'Edit Academic Event' : 'Create Academic Calendar Event'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure official VTU semester dates, exam cycles, or academic events.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Commencement of Odd Semester / IA-1 Test Cycle"
              error={errors.title}
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Event Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CalendarEventCategory)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="SEMESTER_START">Semester Start</option>
                <option value="SEMESTER_END">Semester End</option>
                <option value="INTERNAL_EXAM">Internal Exam (IA)</option>
                <option value="LAB_EXAM">Lab / Practical Exam</option>
                <option value="VTU_EXAM">VTU Exam (SEE Theory)</option>
                <option value="RESULT_DATE">Result Date</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="ACADEMIC_EVENT">Important Academic Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Workflow State <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CalendarEventStatus)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PUBLISHED">Published (Sync to Mobile)</option>
                <option value="DRAFT">Save as Draft</option>
                <option value="ARCHIVED">Archive</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                error={errors.startDate}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                error={errors.endDate}
              />
            </div>
          </div>

          {/* Targeting: Branch, Scheme, Semester */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
            <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-primary" /> Audience Targeting Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Branch</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Scheme</label>
                <select
                  value={schemeId}
                  onChange={(e) => setSchemeId(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Schemes</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      Scheme {s.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Description & Mobile Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description or circular references displayed on student calendar modal..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
              {initialData ? 'Update Event' : 'Save & Publish Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
