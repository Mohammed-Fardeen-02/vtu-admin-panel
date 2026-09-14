import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  Plus,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Archive,
  CheckSquare,
  FileCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { ConfirmationModal } from '../../shared/components/ui/ConfirmationModal';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { CustomDropdown, CustomDropdownOption } from '../../shared/components/ui/CustomDropdown';
import { ActionDropdown } from '../../shared/components/ui/ActionDropdown';

import { PaperFormModal } from './components/PaperFormModal';
import { ReplacePaperFileModal } from './components/ReplacePaperFileModal';
import { PaperPreviewModal } from './components/PaperPreviewModal';
import { BulkReassignPaperModal } from './components/BulkReassignPaperModal';

import { usePaperStore } from '../../store/usePaperStore';
import { useAcademicStore } from '../../store/useAcademicStore';
import { AdminQuestionPaper } from '../../shared/types/papers.types';

export const QuestionPapersPage: React.FC = () => {
  const {
    papers,
    fetchPapers,
    addPaper,
    updatePaper,
    replacePaperFile,
    publishPaper,
    unpublishPaper,
    archivePaper,
    deletePaper,
    bulkPublishPapers,
    bulkUnpublishPapers,
    bulkArchivePapers,
    bulkDeletePapers,
    bulkReassignSubject,
  } = usePaperStore();

  const { branches, schemes, semesters, subjects } = useAcademicStore();

  React.useEffect(() => {
    fetchPapers();
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [semFilter, setSemFilter] = useState<number | 'ALL'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [paperTypeFilter, setPaperTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selection state for Bulk operations
  const [selectedPaperIds, setSelectedPaperIds] = useState<Set<string>>(new Set());

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<AdminQuestionPaper | null>(null);

  const [isReplaceFileModalOpen, setIsReplaceFileModalOpen] = useState(false);
  const [paperForReplaceFile, setPaperForReplaceFile] = useState<AdminQuestionPaper | null>(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<AdminQuestionPaper | null>(null);

  const [isBulkReassignOpen, setIsBulkReassignOpen] = useState(false);

  // Confirmation modal dialog state
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

  // Handlers for Modals
  const handleOpenCreatePaper = () => {
    setEditingPaper(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditPaper = (p: AdminQuestionPaper) => {
    setEditingPaper(p);
    setIsFormModalOpen(true);
  };

  const handleSavePaper = (data: any) => {
    if (editingPaper) {
      return updatePaper(editingPaper.id, data);
    } else {
      return addPaper(data);
    }
  };

  const handleOpenReplaceFile = (p: AdminQuestionPaper) => {
    setPaperForReplaceFile(p);
    setIsReplaceFileModalOpen(true);
  };

  const handleOpenPreview = (p: AdminQuestionPaper) => {
    setPreviewPaper(p);
    setIsPreviewModalOpen(true);
  };

  // Filtered dataset
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          p.title.toLowerCase().includes(q) ||
          p.subjectCode.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q) ||
          p.year.toString().includes(q) ||
          (p.uploadedBy || '').toLowerCase().includes(q);
      }

      const matchesBranch = branchFilter === 'ALL' || p.branchCode === branchFilter;
      const matchesScheme = schemeFilter === 'ALL' || p.schemeYear === schemeFilter;
      const matchesSem = semFilter === 'ALL' || p.semester === semFilter;
      const matchesSubject = subjectFilter === 'ALL' || p.subjectId === subjectFilter;
      const matchesPaperType = paperTypeFilter === 'ALL' || p.paperType === paperTypeFilter;
      const matchesCategory = categoryFilter === 'ALL' || p.examCategory === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesScheme &&
        matchesSem &&
        matchesSubject &&
        matchesPaperType &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    papers,
    searchQuery,
    branchFilter,
    schemeFilter,
    semFilter,
    subjectFilter,
    paperTypeFilter,
    categoryFilter,
    statusFilter,
  ]);

  // Aggregate Metrics
  const totalDownloads = useMemo(() => papers.reduce((acc, p) => acc + (p.downloads || 0), 0), [papers]);
  const regularCount = useMemo(() => papers.filter((p) => p.examCategory === 'REGULAR').length, [papers]);
  const makeupCount = useMemo(() => papers.filter((p) => p.examCategory === 'MAKEUP').length, [papers]);
  const modelCount = useMemo(() => papers.filter((p) => p.examCategory === 'MODEL').length, [papers]);

  // Select Handlers
  const handleToggleSelectAll = () => {
    if (selectedPaperIds.size === filteredPapers.length) {
      setSelectedPaperIds(new Set());
    } else {
      setSelectedPaperIds(new Set(filteredPapers.map((p) => p.id)));
    }
  };

  const handleToggleSelectPaper = (id: string) => {
    const next = new Set(selectedPaperIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPaperIds(next);
  };

  const requestDeletePaper = (p: AdminQuestionPaper) => {
    setConfirmModal({
      isOpen: true,
      title: `Permanently Delete Question Paper?`,
      message: `Are you sure you want to delete '${p.title}' (${p.subjectCode})? This action cannot be undone.`,
      action: () => deletePaper(p.id),
    });
  };

  const requestArchivePaper = (p: AdminQuestionPaper) => {
    setConfirmModal({
      isOpen: true,
      title: `Archive Question Paper '${p.subjectCode}'?`,
      message: `Archiving this paper will hide it from student paper search while retaining historical download statistics.`,
      action: () => archivePaper(p.id),
    });
  };

  // CustomDropdown Options for Filters
  const branchFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: `All Branches (${branches.length})` },
    ...branches.map((b) => ({ value: b.code, label: `${b.code} - ${b.name}`, badge: b.code })),
  ];

  const schemeFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: `All Schemes (${schemes.length})` },
    ...schemes.map((s) => ({ value: s.year, label: s.title, badge: `${s.year}` })),
  ];

  const semFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: 'All Semesters' },
    ...semesters.map((s) => ({ value: s.semesterNumber, label: s.title, badge: `Sem ${s.semesterNumber}` })),
  ];

  const paperTypeFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: 'All Paper Types' },
    { value: 'SEE_THEORY', label: 'SEE Theory Paper', badge: 'SEE' },
    { value: 'IA_1', label: 'Internal Test (IA-1)', badge: 'IA-1' },
    { value: 'IA_2', label: 'Internal Test (IA-2)', badge: 'IA-2' },
    { value: 'IA_3', label: 'Internal Test (IA-3)', badge: 'IA-3' },
    { value: 'LAB_EXAM', label: 'Lab Practical', badge: 'LAB' },
  ];

  const categoryFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: 'All Sessions' },
    { value: 'REGULAR', label: 'Regular Main Exam', badge: 'Regular' },
    { value: 'MAKEUP', label: 'Makeup Exam', badge: 'Makeup' },
    { value: 'MODEL', label: 'VTU Model Paper', badge: 'Model' },
  ];

  const statusFilterOptions: CustomDropdownOption[] = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'UNPUBLISHED', label: 'Unpublished' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Previous Year Question Paper Management (ADMIN-FR-04)"
          description="Upload, metadata validation, solution key management, replace file, preview, publish, archive, and bulk paper reassignments."
        />
        <Button
          variant="primary"
          onClick={handleOpenCreatePaper}
          icon={<Plus className="h-4 w-4" />}
          className="flex-shrink-0"
        >
          Create / Upload Question Paper
        </Button>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-primary" /> Total Papers
          </span>
          <p className="text-2xl font-black text-foreground">{papers.length}</p>
          <span className="text-[10px] text-muted-foreground">SEE & IA papers</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <FileCheck className="h-3.5 w-3.5 text-emerald-500" /> Regular Exams
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{regularCount}</p>
          <span className="text-[10px] text-emerald-600/80">Main SEE papers</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Makeup / Supp
          </span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{makeupCount}</p>
          <span className="text-[10px] text-amber-600/80">Supplementary exams</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-purple-500" /> Model Papers
          </span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{modelCount}</p>
          <span className="text-[10px] text-purple-600/80">VTU Sample papers</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> With Solution Keys
          </span>
          <p className="text-2xl font-black text-foreground">
            {papers.filter((p) => p.hasSolutionKey).length}
          </p>
          <span className="text-[10px] text-muted-foreground">Answer keys attached</span>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-rose-500" /> Total Downloads
          </span>
          <p className="text-2xl font-black text-foreground">{totalDownloads.toLocaleString()}</p>
          <span className="text-[10px] text-muted-foreground">Student downloads</span>
        </div>
      </div>

      {/* Controls & Custom Filter Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full xl:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, subject, code, year..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-purple-500 outline-none font-medium"
            />
          </div>

          {/* Custom Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full xl:w-auto">
            <CustomDropdown
              size="sm"
              options={branchFilterOptions}
              value={branchFilter}
              onChange={(val) => setBranchFilter(val)}
            />

            <CustomDropdown
              size="sm"
              options={schemeFilterOptions}
              value={schemeFilter}
              onChange={(val) => setSchemeFilter(val)}
            />

            <CustomDropdown
              size="sm"
              options={semFilterOptions}
              value={semFilter}
              onChange={(val) => setSemFilter(val)}
            />

            <CustomDropdown
              size="sm"
              options={paperTypeFilterOptions}
              value={paperTypeFilter}
              onChange={(val) => setPaperTypeFilter(val)}
            />

            <CustomDropdown
              size="sm"
              options={categoryFilterOptions}
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
            />

            <CustomDropdown
              size="sm"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedPaperIds.size > 0 && (
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 animate-fadeIn text-xs">
            <span className="font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4" />
              <span>{selectedPaperIds.size} Question Papers Selected</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  bulkPublishPapers(Array.from(selectedPaperIds));
                  setSelectedPaperIds(new Set());
                }}
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
              >
                Bulk Publish
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  bulkUnpublishPapers(Array.from(selectedPaperIds));
                  setSelectedPaperIds(new Set());
                }}
                icon={<XCircle className="h-3.5 w-3.5" />}
              >
                Bulk Unpublish
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkReassignOpen(true)}
                icon={<Layers className="h-3.5 w-3.5" />}
              >
                Bulk Reassign Subject
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  bulkArchivePapers(Array.from(selectedPaperIds));
                  setSelectedPaperIds(new Set());
                }}
                icon={<Archive className="h-3.5 w-3.5" />}
              >
                Bulk Archive
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table View */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-accent/40 text-muted-foreground uppercase text-[10px] font-black border-b border-border">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredPapers.length > 0 && selectedPaperIds.size === filteredPapers.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded border-border text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="p-3.5">Question Paper & Academic Mapping</th>
                <th className="p-3.5">Branch / Scheme / Sem</th>
                <th className="p-3.5">Paper Type & Session</th>
                <th className="p-3.5 text-center">Solution Key</th>
                <th className="p-3.5 text-center">Downloads</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPapers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
                      <p className="font-extrabold text-sm text-foreground">No Question Papers found</p>
                      <p className="text-xs">Adjust your search or filter parameters above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPapers.map((paper) => {
                  const isSelected = selectedPaperIds.has(paper.id);
                  const isDigital = paper.contentType === 'DIGITAL_TYPED' || (paper.modulesData && paper.modulesData.length > 0);
                  return (
                    <tr
                      key={paper.id}
                      className={`hover:bg-accent/30 transition-colors ${
                        isSelected ? 'bg-purple-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectPaper(paper.id)}
                          className="rounded border-border text-purple-600 focus:ring-purple-500"
                        />
                      </td>

                      {/* Title & Subject */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-purple-500 font-mono text-[11px]">
                              {paper.subjectCode}
                            </span>
                            <span className="font-bold text-foreground truncate max-w-xs">
                              {paper.subjectName}
                            </span>
                            {isDigital ? (
                              <Badge variant="success" className="text-[9px]">📝 Digital</Badge>
                            ) : (
                              <Badge variant="warning" className="text-[9px]">📄 PDF</Badge>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-muted-foreground truncate max-w-md">
                            {paper.title}
                          </p>
                        </div>
                      </td>

                      {/* Hierarchy */}
                      <td className="p-3.5 whitespace-nowrap font-bold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="primary" className="text-[10px]">
                            {paper.branchCode}
                          </Badge>
                          <span>Sem {paper.semester}</span>
                          <span className="text-muted-foreground text-[11px]">({paper.schemeYear} Scheme)</span>
                        </div>
                      </td>

                      {/* Paper Type */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground block">
                            {paper.paperType}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {paper.month || ''} {paper.year} ({paper.examCategory})
                          </span>
                        </div>
                      </td>

                      {/* Solution Key */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {paper.hasSolutionKey ? (
                          <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />} className="text-[9px]">
                            Solution Key
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-[9px]">
                            Paper Only
                          </Badge>
                        )}
                      </td>

                      {/* Downloads */}
                      <td className="p-3.5 text-center font-extrabold text-blue-600 dark:text-blue-400">
                        <div className="flex items-center justify-center gap-1">
                          <Download className="h-3.5 w-3.5" />
                          <span>{(paper.downloads || 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            paper.status === 'PUBLISHED'
                              ? 'success'
                              : paper.status === 'UNPUBLISHED'
                              ? 'warning'
                              : 'neutral'
                          }
                          className="text-[10px]"
                        >
                          {paper.status}
                        </Badge>
                      </td>

                      {/* Actions Menu Dropdown */}
                      <td className="p-3.5 text-right">
                        <ActionDropdown
                          status={paper.status}
                          onPreview={() => handleOpenPreview(paper)}
                          onEdit={() => handleOpenEditPaper(paper)}
                          onReplaceFile={() => handleOpenReplaceFile(paper)}
                          onToggleStatus={() => {
                            if (paper.status === 'PUBLISHED') unpublishPaper(paper.id);
                            else publishPaper(paper.id);
                          }}
                          onArchive={() => requestArchivePaper(paper)}
                          onDelete={() => requestDeletePaper(paper)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}

      {/* Form Modal (Create / Edit) */}
      <PaperFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePaper}
        initialPaper={editingPaper}
      />

      {/* Replace File Modal */}
      {paperForReplaceFile && (
        <ReplacePaperFileModal
          isOpen={isReplaceFileModalOpen}
          onClose={() => {
            setIsReplaceFileModalOpen(false);
            setPaperForReplaceFile(null);
          }}
          paper={paperForReplaceFile}
          onReplaceFile={replacePaperFile}
        />
      )}

      {/* Paper Previewer Modal */}
      {previewPaper && (
        <PaperPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setPreviewPaper(null);
          }}
          paper={previewPaper}
        />
      )}

      {/* Bulk Reassign Modal */}
      <BulkReassignPaperModal
        isOpen={isBulkReassignOpen}
        onClose={() => setIsBulkReassignOpen(false)}
        selectedCount={selectedPaperIds.size}
        onConfirmReassign={(
          targetSubId: string,
          subCode: string,
          subName: string,
          branchCode: string,
          schemeYear: string,
          sem: number
        ) => {
          bulkReassignSubject(
            Array.from(selectedPaperIds),
            targetSubId,
            subCode,
            subName,
            branchCode,
            schemeYear,
            sem
          );
          setSelectedPaperIds(new Set());
        }}
      />

      {/* Confirmation Action Dialog */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        variant="danger"
        confirmText="Proceed"
      />
    </div>
  );
};
