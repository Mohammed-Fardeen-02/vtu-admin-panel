import React, { useState, useEffect } from 'react';
import { X, Bell, Send, Clock, Eye, AlertTriangle, Link2, FileText, Layers } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import {
  InAppNotification,
  NotificationType,
  AudienceType,
  NotificationStatus,
} from '../../../shared/types/notification.types';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { useAcademicStore } from '../../../store/useAcademicStore';

interface NotificationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InAppNotification | null;
  onOpenPreview: (data: Partial<InAppNotification>) => void;
  onTriggerMassSend: (data: Partial<InAppNotification>) => void;
}

export const NotificationFormModal: React.FC<NotificationFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onOpenPreview,
  onTriggerMassSend,
}) => {
  const { createNotification, updateNotification } = useNotificationStore();
  const { branches, schemes } = useAcademicStore();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState<NotificationType>('CIRCULAR');
  const [audience, setAudience] = useState<AudienceType>('ALL_STUDENTS');
  const [targetBranch, setTargetBranch] = useState('ALL');
  const [targetSemester, setTargetSemester] = useState<string>('ALL');
  const [targetScheme, setTargetScheme] = useState('ALL');
  const [targetCollege, setTargetCollege] = useState('ALL');
  const [scheduledFor, setScheduledFor] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [sendMode, setSendMode] = useState<'NOW' | 'SCHEDULE' | 'DRAFT'>('NOW');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setType(initialData.type);
      setAudience(initialData.audience);
      setTargetBranch(initialData.targetBranch);
      setTargetSemester(String(initialData.targetSemester));
      setTargetScheme(initialData.targetScheme);
      setTargetCollege(initialData.targetCollege);
      setScheduledFor(initialData.scheduledFor || '');
      setAttachmentUrl(initialData.attachmentUrl || '');
      setActionUrl(initialData.actionUrl || '');
      setSendMode(initialData.status === 'SCHEDULED' ? 'SCHEDULE' : initialData.status === 'DRAFT' ? 'DRAFT' : 'NOW');
    } else {
      setTitle('');
      setBody('');
      setType('CIRCULAR');
      setAudience('ALL_STUDENTS');
      setTargetBranch('ALL');
      setTargetSemester('ALL');
      setTargetScheme('ALL');
      setTargetCollege('ALL');
      setScheduledFor('');
      setAttachmentUrl('');
      setActionUrl('');
      setSendMode('NOW');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Notification title is required';
    if (!body.trim()) errs.body = 'Notification body content is required';
    if (sendMode === 'SCHEDULE' && !scheduledFor) {
      errs.scheduledFor = 'Please select scheduled date and time';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getFormDataPayload = (): Partial<InAppNotification> => {
    const semVal = targetSemester === 'ALL' ? 'ALL' : parseInt(targetSemester, 10);
    const status: NotificationStatus =
      sendMode === 'NOW' ? 'SENT' : sendMode === 'SCHEDULE' ? 'SCHEDULED' : 'DRAFT';

    return {
      title,
      body,
      type,
      audience,
      targetBranch,
      targetSemester: semVal,
      targetScheme,
      targetCollege,
      status,
      scheduledFor: sendMode === 'SCHEDULE' ? scheduledFor : undefined,
      attachmentUrl: attachmentUrl.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      createdBy: 'VTU Central Administrator',
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = getFormDataPayload();

    if (sendMode === 'NOW') {
      // Require mass confirmation
      onTriggerMassSend(payload);
      return;
    }

    if (initialData) {
      updateNotification(initialData.id, payload as any);
    } else {
      createNotification(payload as any);
    }
    onClose();
  };

  const handlePreviewClick = () => {
    const payload = getFormDataPayload();
    onOpenPreview(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                {initialData ? 'Edit Broadcast Notification' : 'Create Push Notification Alert'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure notification content, audience targeting, attachments, and delivery schedule.
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Notification Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Notification Header Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VTU Odd Semester Results Published / IA Test Schedule Released"
              error={errors.title}
            />
          </div>

          {/* Type & Audience Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Notification Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NotificationType)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="RESULT">Result Alert</option>
                <option value="CIRCULAR">Official Circular</option>
                <option value="EXAM">Exam Timetable</option>
                <option value="ACADEMIC">Academic Calendar Notice</option>
                <option value="COMMUNITY">Community / Hackathon</option>
                <option value="SYSTEM">System Maintenance</option>
                <option value="PROMOTIONAL">Promotional / Resource</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Audience Scope <span className="text-rose-500">*</span>
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL_STUDENTS">All VTU Students (Mass Broadcast)</option>
                <option value="BRANCH_SPECIFIC">Branch Specific</option>
                <option value="SEMESTER_SPECIFIC">Semester Specific</option>
                <option value="SCHEME_SPECIFIC">Scheme Specific</option>
                <option value="COLLEGE_SPECIFIC">College Specific</option>
              </select>
            </div>
          </div>

          {/* Targeting Controls */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
            <h4 className="text-xs font-black text-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" /> Target Audience Filtering
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Branch</label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Branches</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Scheme</label>
                <select
                  value={targetScheme}
                  onChange={(e) => setTargetScheme(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Schemes</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      {s.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">Semester</label>
                <select
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>
                      Sem {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">College</label>
                <select
                  value={targetCollege}
                  onChange={(e) => setTargetCollege(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs focus:outline-none"
                >
                  <option value="ALL">All Colleges</option>
                  <option value="1RV">RVCE Bangalore (1RV)</option>
                  <option value="1MS">BMSCE Bangalore (1MS)</option>
                  <option value="1PE">PESIT Bangalore (1PE)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Notification Message Body <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Detailed notification message text displayed on student mobile device lock screen and in-app feed..."
              className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.body && <p className="text-[11px] text-rose-500 mt-1 font-bold">{errors.body}</p>}
          </div>

          {/* Optional Links / PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" /> PDF Circular Attachment URL
              </label>
              <Input
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://vtu.ac.in/circulars/doc.pdf"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" /> Action / Redirection URL
              </label>
              <Input
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="https://results.vtu.ac.in"
              />
            </div>
          </div>

          {/* Schedule vs Immediate Dispatch Selector */}
          <div className="p-4 rounded-xl bg-accent/30 border border-border space-y-3">
            <label className="block text-xs font-black text-foreground">
              Delivery Execution Strategy
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSendMode('NOW')}
                className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  sendMode === 'NOW'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                <Send className="h-3.5 w-3.5" /> Send Immediately
              </button>

              <button
                type="button"
                onClick={() => setSendMode('SCHEDULE')}
                className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  sendMode === 'SCHEDULE'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                <Clock className="h-3.5 w-3.5" /> Schedule Delivery
              </button>

              <button
                type="button"
                onClick={() => setSendMode('DRAFT')}
                className={`py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  sendMode === 'DRAFT'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent'
                }`}
              >
                Save as Draft
              </button>
            </div>

            {sendMode === 'SCHEDULE' && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                  Scheduled Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  error={errors.scheduledFor}
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewClick}
              icon={<Eye className="h-4 w-4" />}
            >
              Preview Notification
            </Button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<Send className="h-4 w-4" />}>
                {sendMode === 'NOW'
                  ? 'Send Broadcast Now'
                  : sendMode === 'SCHEDULE'
                  ? 'Schedule Notification'
                  : 'Save Draft'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
