import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, BookOpen, AlertCircle, FileText, CheckCircle2, Folder, Layers, Eye } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { useAcademicStore } from '../../../store/useAcademicStore';
import { AdminNote, NoteFormat, NoteStatus, AuthorRole } from '../../../shared/types/notes.types';

export interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  initialNote?: AdminNote | null;
}

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNote,
}) => {
  const {
    branches,
    schemes,
    semesters,
    subjects,
    modules,
    units,
    topics,
    getModulesForSubject,
    getUnitsForModule,
    getTopicsForUnit,
  } = useAcademicStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState<number>(5);
  const [subjectId, setSubjectId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [format, setFormat] = useState<NoteFormat>('PDF');
  const [status, setStatus] = useState<NoteStatus>('PUBLISHED');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(19);
  const [freePreviewPages, setFreePreviewPages] = useState<number>(2);
  const [authorName, setAuthorName] = useState('VTU Faculty Panel');
  const [authorRole, setAuthorRole] = useState<AuthorRole>('FACULTY');
  const [authorUsn, setAuthorUsn] = useState('');
  const [fileUrl, setFileUrl] = useState('s3://vtu-notes-prod/official_note.pdf');
  const [fileSize, setFileSize] = useState('5.4 MB');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(5400000);
  const [pageCount, setPageCount] = useState<number>(24);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [rawSelectedFile, setRawSelectedFile] = useState<File | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter subjects based on active branch, scheme, semester
  const availableSubjects = subjects.filter(
    (s) =>
      s.branchCode === branchCode &&
      s.schemeYear === schemeYear &&
      s.semester === semester
  );

  const availableModules = subjectId ? getModulesForSubject(subjectId) : [];
  const availableUnits = moduleId ? getUnitsForModule(moduleId) : [];
  const availableTopics = unitId ? getTopicsForUnit(unitId) : [];

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setDescription(initialNote.description || '');

      // Find matching subject in store by ID or Code
      const matchedSubject = subjects.find(
        (s) =>
          s.id === initialNote.subjectId ||
          (initialNote.subjectCode && s.code.toUpperCase() === initialNote.subjectCode.toUpperCase())
      );

      const targetBranch = matchedSubject?.branchCode || initialNote.branchCode || 'CSE';
      const targetScheme = matchedSubject?.schemeYear || initialNote.schemeYear || '2022';
      const targetSem = Number(matchedSubject?.semester || initialNote.semester || 5);
      const targetSubjId = matchedSubject?.id || initialNote.subjectId;

      setBranchCode(targetBranch);
      setSchemeYear(targetScheme);
      setSemester(targetSem);
      setSubjectId(targetSubjId);

      // Match module in store by ID or module number
      const subjectModules = targetSubjId ? getModulesForSubject(targetSubjId) : [];
      const matchedModule = subjectModules.find(
        (m) =>
          m.id === initialNote.moduleId ||
          (initialNote.moduleId && m.moduleNumber === Number(initialNote.moduleId))
      );
      const resolvedModuleId = matchedModule ? matchedModule.id : (initialNote.moduleId || '');
      setModuleId(resolvedModuleId);

      // Match unit in store by ID or unit number
      const moduleUnits = resolvedModuleId ? getUnitsForModule(resolvedModuleId) : [];
      const matchedUnit = moduleUnits.find(
        (u) =>
          u.id === initialNote.unitId ||
          (initialNote.unitId && u.unitNumber === Number(initialNote.unitId))
      );
      const resolvedUnitId = matchedUnit ? matchedUnit.id : (initialNote.unitId || '');
      setUnitId(resolvedUnitId);

      // Match topic in store by ID or topic number
      const unitTopics = resolvedUnitId ? getTopicsForUnit(resolvedUnitId) : [];
      const matchedTopic = unitTopics.find(
        (t) =>
          t.id === initialNote.topicId ||
          (initialNote.topicId && t.topicNumber === Number(initialNote.topicId))
      );
      const resolvedTopicId = matchedTopic ? matchedTopic.id : (initialNote.topicId || '');
      setTopicId(resolvedTopicId);

      setFormat(initialNote.format);
      setStatus(initialNote.status);
      setIsPaid(Boolean(initialNote.isPaid));
      setPrice(initialNote.price || 19);
      setFreePreviewPages(initialNote.freePreviewPages || 2);
      setAuthorName(initialNote.authorName);
      setAuthorRole(initialNote.authorRole);
      setAuthorUsn(initialNote.authorUsn || '');
      setFileUrl(initialNote.fileUrl);
      setFileSize(initialNote.fileSize);
      setFileSizeBytes(initialNote.fileSizeBytes || 5000000);
      setPageCount(initialNote.pageCount);
      setSelectedFileName(initialNote.fileUrl.split('/').pop() || '');
    } else {
      setTitle('');
      setDescription('');
      setIsPaid(false);
      setPrice(19);
      setFreePreviewPages(2);
      setSelectedFileName('');
      setRawSelectedFile(null);
      setTopicId('');
      setModuleId('');
      setUnitId('');
      if (availableSubjects.length > 0) {
        setSubjectId(availableSubjects[0].id);
      }
    }
  }, [initialNote, subjects]);

  // Set default subject if branch/scheme/semester changes manually (and not editing initial note)
  useEffect(() => {
    if (!initialNote && availableSubjects.length > 0 && !availableSubjects.some((s) => s.id === subjectId)) {
      setSubjectId(availableSubjects[0].id);
      setModuleId('');
      setUnitId('');
      setTopicId('');
    }
  }, [branchCode, schemeYear, semester]);

  if (!isOpen) return null;

  // Handle system file selection (Supports Any File Size)
  const handleSystemFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRawSelectedFile(file);
    setSelectedFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(objectUrl);
    setShowLivePreview(true);

    const bytes = file.size;
    setFileSizeBytes(bytes);
    const formattedSize =
      bytes >= 1024 * 1024 * 1024
        ? `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;
    setFileSize(formattedSize);
    setFileUrl(`s3://vtu-notes-prod/uploads/${file.name}`);

    // Auto-fill title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }

    // Auto-detect format type
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'ppt' || ext === 'pptx') {
      setFormat('PPT');
    } else if (ext === 'pdf') {
      setFormat('PDF');
    } else if (ext === 'doc' || ext === 'docx') {
      setFormat('DOCX');
    } else if (ext === 'zip' || ext === 'rar') {
      setFormat('ZIP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Note Title is required.');
      return;
    }
    const targetSubject = subjects.find((s) => s.id === subjectId);
    if (!targetSubject) {
      setErrorMsg('Please select a valid subject entity from the Central Academic Structure.');
      return;
    }

    const selectedTopicObj = topics.find((t) => t.id === topicId);

    setIsUploading(true);
    try {
      const payload: any = {
        file: rawSelectedFile,
        title: title.trim(),
        description: description.trim() || undefined,
        branchCode,
        schemeYear,
        semester,
        courseId: subjectId,
        subjectId,
        subjectCode: targetSubject.code,
        subjectName: targetSubject.name,
        moduleId: moduleId || undefined,
        unitId: unitId || undefined,
        topicId: topicId || undefined,
        topicTitle: selectedTopicObj?.title || undefined,
        format,
        status,
        isPaid,
        price: isPaid ? Number(price) : 0,
        freePreviewPages: Number(freePreviewPages),
        authorName: authorName.trim(),
        authorRole,
        authorUsn: authorUsn.trim() || undefined,
        fileUrl: fileUrl.trim(),
        fileSize: fileSize.trim(),
        fileSizeBytes,
        pageCount: Number(pageCount),
      };

      const res = await Promise.resolve(onSave(payload));
      if (res && !res.success) {
        setErrorMsg(res.error || 'Failed to save note.');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while uploading note.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-lg font-black text-foreground">
              {initialNote ? 'Edit Notes Metadata' : 'Add Note to Library (ADMIN-FR-03)'}
            </h3>
            <p className="text-xs text-muted-foreground">
              Map note entity down to Subject, Module, Unit, or Micro-Topic level.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1: Note Title & Summary Description (At the top) */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Note Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DBMS Module 1-5 Complete Handwritten Revision Notes"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Summary Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of topic coverage, diagrams, formulas, and exam relevance..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>
          </div>

          {/* STEP 2: Central Academic Structure Mapping */}
          <div className="p-4 rounded-xl border border-primary/20 bg-accent/20 space-y-3">
            <span className="font-black text-primary text-xs flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Central Academic Structure Mapping</span>
            </span>

            {/* Row 1: Branch, Scheme, Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-foreground mb-1">Branch *</label>
                <select
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Scheme *</label>
                <select
                  value={schemeYear}
                  onChange={(e) => setSchemeYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      {s.year} Scheme
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Semester *</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  {semesters.map((sem) => (
                    <option key={sem.id} value={sem.semesterNumber}>
                      Sem {sem.semesterNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Subject (Required), Module (Optional), Unit (Optional), Topic (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div>
                <label className="block font-bold text-foreground mb-1">Subject Entity *</label>
                <select
                  value={subjectId}
                  onChange={(e) => {
                    setSubjectId(e.target.value);
                    setModuleId('');
                    setUnitId('');
                    setTopicId('');
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground font-bold cursor-pointer"
                  required
                >
                  {availableSubjects.length === 0 && !subjectId ? (
                    <option value="">No subjects found for path</option>
                  ) : (
                    <>
                      {availableSubjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} - {s.name}
                        </option>
                      ))}
                      {subjectId && !availableSubjects.some((s) => s.id === subjectId) && (
                        <option value={subjectId}>
                          {initialNote?.subjectCode ? `${initialNote.subjectCode} - ${initialNote.subjectName || 'Selected Subject'}` : subjectId}
                        </option>
                      )}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Module (Optional)</label>
                <select
                  value={moduleId}
                  onChange={(e) => {
                    setModuleId(e.target.value);
                    setUnitId('');
                    setTopicId('');
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer"
                >
                  <option value="">All Modules (Subject-level Note)</option>
                  {availableModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      Mod {m.moduleNumber}: {m.title}
                    </option>
                  ))}
                  {moduleId && !availableModules.some((m) => m.id === moduleId) && (
                    <option value={moduleId}>
                      {initialNote?.moduleId ? `Module (${initialNote.moduleId})` : `Module ID: ${moduleId}`}
                    </option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div>
                <label className="block font-bold text-foreground mb-1">Unit (Optional)</label>
                <select
                  value={unitId}
                  onChange={(e) => {
                    setUnitId(e.target.value);
                    setTopicId('');
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer"
                >
                  <option value="">All Units (Module-level Note)</option>
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber}: {u.title}
                    </option>
                  ))}
                  {unitId && !availableUnits.some((u) => u.id === unitId) && (
                    <option value={unitId}>
                      {initialNote?.unitId ? `Unit (${initialNote.unitId})` : `Unit ID: ${unitId}`}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Topic (Optional)</label>
                <select
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground cursor-pointer"
                >
                  <option value="">All Topics (Unit-level Note)</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      Topic #{t.topicNumber}: {t.title}
                    </option>
                  ))}
                  {topicId && !availableTopics.some((t) => t.id === topicId) && (
                    <option value={topicId}>
                      {initialNote?.topicTitle ? initialNote.topicTitle : `Topic ID: ${topicId}`}
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* STEP 3: Format, Status, Role & Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Format Type *</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as NoteFormat)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                <option value="PDF">PDF Document</option>
                <option value="PPT">PPT Slide Presentation</option>
                <option value="HANDWRITTEN">Handwritten Notes</option>
                <option value="TYPED">Typed Digital Notes</option>
                <option value="SHORT_NOTES">Short Notes</option>
                <option value="REVISION_NOTES">Revision Notes</option>
                <option value="DOCX">Microsoft Word (DOCX)</option>
                <option value="ZIP">Archive Bundle (ZIP)</option>
                <option value="URL_LINK">External Drive Link</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Publishing Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NoteStatus)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                <option value="PUBLISHED">Published (Live to Students)</option>
                <option value="UNPUBLISHED">Unpublished (Draft)</option>
                <option value="PENDING_REVIEW">Pending Moderation</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Author Role *</label>
              <select
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value as AuthorRole)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
              >
                <option value="FACULTY">Faculty Member</option>
                <option value="STUDENT">Student Contributor</option>
                <option value="ADMIN">VTU Content Admin</option>
                <option value="VTU_OFFICIAL">VTU Official Board</option>
              </select>
            </div>
          </div>

          {/* STEP 3.5: Monetization & Preview Limit Settings */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Note Monetization & Preview DRM Settings
              </span>
              <span className="text-[11px] font-bold text-muted-foreground">In-App Offline Access Only</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-foreground text-xs mb-1">Access Model *</label>
                <select
                  value={isPaid ? 'PAID' : 'FREE'}
                  onChange={(e) => setIsPaid(e.target.value === 'PAID')}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-extrabold text-xs cursor-pointer"
                >
                  <option value="FREE">FREE (Unrestricted)</option>
                  <option value="PAID">PAID NOTE (In-App Purchase)</option>
                </select>
              </div>

              {isPaid && (
                <div>
                  <label className="block font-bold text-foreground text-xs mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="e.g. 19"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none text-xs font-black text-emerald-600"
                    required={isPaid}
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-foreground text-xs mb-1">Free Preview Limit (Pages) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={freePreviewPages}
                  onChange={(e) => setFreePreviewPages(Number(e.target.value))}
                  placeholder="e.g. 2 pages / slides"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none text-xs font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Author Name *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Prof. Suresh K. or Fardeen Khan"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Author USN / ID (Optional)</label>
              <input
                type="text"
                value={authorUsn}
                onChange={(e) => setAuthorUsn(e.target.value)}
                placeholder="e.g. 1VA21CS042 or FACULTY-CS09"
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none uppercase font-semibold"
              />
            </div>
          </div>

          {/* STEP 4: File Upload Section (AT THE BOTTOM as requested) */}
          <div className="p-4 border-2 border-dashed border-primary/40 rounded-2xl bg-primary/5 space-y-3">
            <div className="text-center space-y-1">
              <Upload className="h-7 w-7 text-primary mx-auto" />
              <h4 className="text-xs font-black text-foreground">Upload Note File from Computer / Device</h4>
              <p className="text-[11px] text-muted-foreground">
                Supports PDF, PPT, PPTX, DOCX, ZIP, PNG, JPG format. <strong>No file size limit.</strong>
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSystemFileSelect}
              accept=".pdf,.ppt,.pptx,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
              className="hidden"
            />

            <div className="flex justify-center">
              <Button
                variant="primary"
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                icon={<Folder className="h-4 w-4" />}
              >
                Browse & Select File from Device
              </Button>
            </div>

            {selectedFileName && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">Selected File: {selectedFileName} ({fileSize})</span>
                  </div>
                  {previewObjectUrl && (
                    <button
                      type="button"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showLivePreview ? 'Hide Preview' : 'Inspect & Scroll Document'}
                    </button>
                  )}
                </div>

                {showLivePreview && previewObjectUrl && (
                  <div className="h-80 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-lg">
                    <iframe
                      src={`${previewObjectUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                      title="Selected Document Live Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Storage Path & File Size Details */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-primary/20">
              <div className="col-span-2">
                <label className="block font-bold text-foreground mb-1">Storage File Key / URL *</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="s3://vtu-notes-prod/notes_file.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">File Size *</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="e.g. 18.4 MB"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isUploading} icon={<Upload className={`h-4 w-4 ${isUploading ? 'animate-spin' : ''}`} />}>
              {isUploading ? 'Saving Note to System...' : 'Save Note to Library'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
