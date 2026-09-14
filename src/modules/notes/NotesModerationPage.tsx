import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit2,
  Upload,
  Eye,
  Download,
  Bookmark,
  Archive,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  RefreshCcw,
  Layers,
  BookOpen,
  ShieldCheck,
  CheckSquare,
  Square,
  BarChart3,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  History,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { ConfirmationModal } from '../../shared/components/ui/ConfirmationModal';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  ActionDropdown,
} from '../../shared/components/ui';
import { NoteFormModal } from './components/NoteFormModal';
import { ReplaceFileModal } from './components/ReplaceFileModal';
import { NotePreviewModal } from './components/NotePreviewModal';
import { BulkReassignModal } from './components/BulkReassignModal';
import { NoteReviewModal } from './components/NoteReviewModal';

import { useNotesStore } from '../../store/useNotesStore';
import { useAcademicStore } from '../../store/useAcademicStore';
import { AdminNote } from '../../shared/types/notes.types';

export const NotesModerationPage: React.FC = () => {
  const {
    notes,
    isLoadingNotes,
    fetchNotes,
    moderationLogs,
    addNote,
    updateNote,
    replaceNoteFile,
    publishNote,
    unpublishNote,
    archiveNote,
    deleteNote,
    reorderNotes,
    bulkPublishNotes,
    bulkUnpublishNotes,
    bulkArchiveNotes,
    bulkDeleteNotes,
    bulkReassignSubject,
  } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const { branches, schemes, semesters, subjects } = useAcademicStore();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'ALL_NOTES' | 'PENDING_REVIEW' | 'MODERATION_LOGS'>('ALL_NOTES');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [semFilter, setSemFilter] = useState<number | 'ALL'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Bulk Selection State
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null);

  const [isReplaceFileModalOpen, setIsReplaceFileModalOpen] = useState(false);
  const [noteForReplaceFile, setNoteForReplaceFile] = useState<AdminNote | null>(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<AdminNote | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState<AdminNote | null>(null);

  const [isBulkReassignOpen, setIsBulkReassignOpen] = useState(false);

  // Destructive Action Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  // Filtered Notes Calculation
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          n.title.toLowerCase().includes(q) ||
          n.subjectCode.toLowerCase().includes(q) ||
          n.subjectName.toLowerCase().includes(q) ||
          n.authorName.toLowerCase().includes(q) ||
          (n.authorUsn || '').toLowerCase().includes(q);
      }

      const matchesBranch = branchFilter === 'ALL' || n.branchCode === branchFilter;
      const matchesScheme = schemeFilter === 'ALL' || n.schemeYear === schemeFilter;
      const matchesSem = semFilter === 'ALL' || n.semester === semFilter;
      const matchesSubject = subjectFilter === 'ALL' || n.subjectId === subjectFilter;
      const matchesFormat = formatFilter === 'ALL' || n.format === formatFilter;
      const matchesStatus =
        activeTab === 'PENDING_REVIEW'
          ? n.status === 'PENDING_REVIEW' || n.status === 'STUDENT_UPLOAD'
          : statusFilter === 'ALL' || n.status === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesScheme &&
        matchesSem &&
        matchesSubject &&
        matchesFormat &&
        matchesStatus
      );
    });
  }, [
    notes,
    searchQuery,
    branchFilter,
    schemeFilter,
    semFilter,
    subjectFilter,
    formatFilter,
    statusFilter,
    activeTab,
  ]);

  const pendingReviewCount = useMemo(
    () => notes.filter((n) => n.status === 'PENDING_REVIEW' || n.status === 'STUDENT_UPLOAD').length,
    [notes]
  );
  const publishedCount = useMemo(
    () => notes.filter((n) => n.status === 'PUBLISHED').length,
    [notes]
  );

  const handleOpenReviewModal = (n: AdminNote) => {
    setReviewNote(n);
    setIsReviewModalOpen(true);
  };

  const handleOpenCreateNote = () => {
    setEditingNote(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditNote = (n: AdminNote) => {
    setEditingNote(n);
    setIsAddEditModalOpen(true);
  };

  const handleOpenReplaceFile = (n: AdminNote) => {
    setNoteForReplaceFile(n);
    setIsReplaceFileModalOpen(true);
  };

  const handleOpenPreview = (n: AdminNote) => {
    setPreviewNote(n);
    setIsPreviewModalOpen(true);
  };

  const requestDeleteNote = (n: AdminNote) => {
    setConfirmModal({
      isOpen: true,
      title: `Permanently Delete Note?`,
      message: `Are you sure you want to delete '${n.title}' (${n.subjectCode})? This action cannot be undone.`,
      action: () => deleteNote(n.id),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            VTU Notes Library & Community Moderation (ADMIN-FR-11)
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approve student uploads, inspect automated integrity checks, manage file replacements, and audit governance rules.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreateNote}
          icon={<Plus className="h-4 w-4" />}
          className="flex-shrink-0"
        >
          Add Official Notes
        </Button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('PENDING_REVIEW')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'PENDING_REVIEW'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Pending Review Uploads
          {pendingReviewCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
              {pendingReviewCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ALL_NOTES')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'ALL_NOTES'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          All Notes Library ({notes.length})
        </button>

        <button
          onClick={() => setActiveTab('MODERATION_LOGS')}
          className={`pb-3 px-4 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'MODERATION_LOGS'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          Moderation History Logs ({moderationLogs.length})
        </button>
      </div>

      {activeTab !== 'MODERATION_LOGS' && (
        <>
          {/* Advanced Controls & Multi-Filter Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full xl:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, subject, code, author USN..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              {/* Multi-Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  <option value="ALL">All Branches ({branches.length})</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.code}>
                      {b.code}
                    </option>
                  ))}
                </select>

                <select
                  value={schemeFilter}
                  onChange={(e) => setSchemeFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  <option value="ALL">All Schemes ({schemes.length})</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.year}>
                      {s.year} Scheme
                    </option>
                  ))}
                </select>

                <select
                  value={semFilter}
                  onChange={(e) =>
                    setSemFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                  }
                  className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>

                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-bold cursor-pointer"
                >
                  <option value="ALL">All Formats</option>
                  <option value="PDF">PDF</option>
                  <option value="PPT">PPT</option>
                  <option value="HANDWRITTEN">Handwritten</option>
                  <option value="TYPED">Typed</option>
                  <option value="SHORT_NOTES">Short Notes</option>
                  <option value="REVISION_NOTES">Revision Notes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Notes List Data Table */}
          <Table>
            <TableHeader>
              <tr>
                <TableHead>Subject Code</TableHead>
                <TableHead>Note Details</TableHead>
                <TableHead>Academic Path</TableHead>
                <TableHead>Author & Specs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-bold text-foreground">
                    <div className="h-7 w-20 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">
                      {note.subjectCode}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-foreground">{note.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                        {note.format}
                      </span>
                      {note.isPaid ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                          PAID ₹{note.price} ({note.freePreviewPages || 2} Pgs Free)
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          FREE
                        </span>
                      )}
                    </div>
                    {note.description && (
                      <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">{note.description}</p>
                    )}
                  </TableCell>

                  <TableCell className="text-xs font-bold text-muted-foreground">
                    <span className="text-foreground">{note.branchCode}</span> • {note.schemeYear} Scheme • Sem {note.semester}
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    <div className="text-foreground font-bold">{note.authorName}</div>
                    <div className="text-[11px] text-primary font-bold">{note.fileSize} ({note.pageCount} Pgs)</div>
                  </TableCell>

                  <TableCell>
                    {note.status === 'PUBLISHED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3" /> PUBLISHED
                      </span>
                    ) : note.status === 'PENDING_REVIEW' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        <AlertTriangle className="h-3 w-3" /> PENDING
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {note.status}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPreview(note)}
                        icon={<Eye className="h-3.5 w-3.5 text-primary" />}
                        title="Read / Scroll Document"
                      >
                        Read Document
                      </Button>
                      <ActionDropdown
                        status={note.status === 'PUBLISHED' ? 'ACTIVE' : 'INACTIVE'}
                        onView={() => handleOpenPreview(note)}
                        onEdit={() => handleOpenEditNote(note)}
                        onToggleStatus={() =>
                          note.status === 'PUBLISHED' ? unpublishNote(note.id) : publishNote(note.id)
                        }
                        onDelete={() => requestDeleteNote(note)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredNotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No notes found matching the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}

      {activeTab === 'MODERATION_LOGS' && (
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Moderation Audit Log History
            </h3>
            <div className="space-y-2">
              {moderationLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No moderation logs recorded.</p>
              ) : (
                moderationLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl border border-border bg-accent/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-foreground">{log.noteTitle}</span>
                      <Badge variant={log.action === 'APPROVED' ? 'success' : 'error'} className="text-[10px]">
                        {log.action}
                      </Badge>
                    </div>
                    {log.rejectionReason && (
                      <p className="text-rose-600 dark:text-rose-400 font-bold">Reason: {log.rejectionReason}</p>
                    )}
                    {log.comments && <p className="text-muted-foreground">{log.comments}</p>}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>Reviewer: {log.reviewer} ({log.reviewerRole})</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Note Review Modal */}
      <NoteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        note={reviewNote}
      />

      {/* Add / Edit Note Modal */}
      <NoteFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={async (data) => {
          setActiveTab('ALL_NOTES');
          if (editingNote) {
            return updateNote(editingNote.id, data);
          } else {
            return addNote(data);
          }
        }}
        initialNote={editingNote}
      />

      {/* Replace File Modal */}
      {noteForReplaceFile && (
        <ReplaceFileModal
          isOpen={isReplaceFileModalOpen}
          onClose={() => {
            setIsReplaceFileModalOpen(false);
            setNoteForReplaceFile(null);
          }}
          note={noteForReplaceFile}
          onReplaceFile={replaceNoteFile}
        />
      )}

      {/* Note Preview Reader Modal */}
      {previewNote && (
        <NotePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setPreviewNote(null);
          }}
          note={previewNote}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => {
          confirmModal.action();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
