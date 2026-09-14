import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, FileText, Video } from 'lucide-react';
import { useAcademicStore } from '../../../../../store/useAcademicStore';
import {
  Input,
  Select,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  ActionDropdown,
} from '../../../../../shared/components/ui';
import { Topic, TopicStatus } from '../types/topics.types';

export const TopicsPage: React.FC = () => {
  const { topics, units, modules, subjects, branches, schemes, semesters, addTopic, updateTopic, toggleTopicStatus, archiveTopic } =
    useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');
  const [selectedUnitId, setSelectedUnitId] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [unitId, setUnitId] = useState('');
  const [topicNumber, setTopicNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TopicStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  // Available subjects based on branch, scheme, semester
  const availableSubjects = subjects.filter(
    (s) =>
      (selectedBranch === 'ALL' || s.branchCode === selectedBranch) &&
      (selectedScheme === 'ALL' || s.schemeYear === selectedScheme) &&
      (selectedSemester === 0 || s.semester === selectedSemester)
  );

  const availableModules =
    selectedSubjectId === 'ALL'
      ? modules
      : modules.filter((m) => m.subjectId === selectedSubjectId);

  const availableUnits =
    selectedModuleId === 'ALL'
      ? units
      : units.filter((u) => u.moduleId === selectedModuleId);

  const filteredTopics = topics.filter((t) => {
    const parentUnit = units.find((u) => u.id === t.unitId);
    const parentModule = parentUnit ? modules.find((m) => m.id === parentUnit.moduleId) : null;
    const parentSubject = parentModule ? subjects.find((s) => s.id === parentModule.subjectId) : null;

    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (parentUnit && parentUnit.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (parentSubject && parentSubject.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesUnit = selectedUnitId === 'ALL' || t.unitId === selectedUnitId;
    const matchesModule = selectedModuleId === 'ALL' || (parentUnit && parentUnit.moduleId === selectedModuleId);
    const matchesSubject = selectedSubjectId === 'ALL' || (parentModule && parentModule.subjectId === selectedSubjectId);
    const matchesBranch = selectedBranch === 'ALL' || (parentSubject && parentSubject.branchCode === selectedBranch);
    const matchesScheme = selectedScheme === 'ALL' || (parentSubject && parentSubject.schemeYear === selectedScheme);
    const matchesSemester = selectedSemester === 0 || (parentSubject && parentSubject.semester === selectedSemester);

    return matchesSearch && matchesUnit && matchesModule && matchesSubject && matchesBranch && matchesScheme && matchesSemester;
  });

  const totalCount = topics.length;
  const activeCount = topics.filter((t) => t.status === 'ACTIVE').length;
  const inactiveCount = topics.filter((t) => t.status === 'INACTIVE').length;
  const archivedCount = topics.filter((t) => t.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setUnitId(units[0]?.id || '');
    setTopicNumber((topics.length % 10) + 1);
    setTitle('');
    setDescription('');
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Topic) => {
    setEditingId(t.id);
    setUnitId(t.unitId);
    setTopicNumber(t.topicNumber || 1);
    setTitle(t.title);
    setDescription(t.description || '');
    setStatus(t.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (t: Topic) => {
    setSelectedTopic(t);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!unitId || !title.trim() || topicNumber < 1) {
      setErrorMsg('Parent topic unit, topic number, and title are required.');
      return;
    }

    if (editingId) {
      const res = updateTopic(editingId, {
        topicNumber: Number(topicNumber),
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update topic.');
        return;
      }
    } else {
      const res = addTopic({
        unitId,
        topicNumber: Number(topicNumber),
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        order: Number(topicNumber),
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add topic.');
        return;
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <span>Course Structure</span>
            <span>/</span>
            <span>Topics Master</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Syllabus Topics Master</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Micro-topic definitions within units (e.g. Entity Sets, Relational Algebra Operators, ACID Properties, OSI Layers).
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Syllabus Topic
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Micro-Topics</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Topics
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Topics</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Published
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Inactive / Draft</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{inactiveCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Pending
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Archived</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-500">{archivedCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500">
              Historical
            </span>
          </div>
        </div>
      </div>

      {/* Cascading Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search Topic Title, Concept or Unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full sm:w-auto">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.code}>
                  {b.code}
                </option>
              ))}
            </select>

            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
            >
              <option value="ALL">All Schemes</option>
              {schemes.map((s) => (
                <option key={s.id} value={s.year}>
                  {s.year} Scheme
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
            >
              <option value={0}>All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.semesterNumber}>
                  Sem {sem.semesterNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Subject Entity</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedModuleId('ALL');
                setSelectedUnitId('ALL');
              }}
              className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
            >
              <option value="ALL">All Subjects</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Parent Module</label>
            <select
              value={selectedModuleId}
              onChange={(e) => {
                setSelectedModuleId(e.target.value);
                setSelectedUnitId('ALL');
              }}
              className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs cursor-pointer outline-none"
            >
              <option value="ALL">All Modules</option>
              {availableModules.map((m) => (
                <option key={m.id} value={m.id}>
                  Mod {m.moduleNumber}: {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Parent Unit</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs cursor-pointer outline-none"
            >
              <option value="ALL">All Units</option>
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Parent Unit & Subject</TableHead>
            <TableHead>Topic #</TableHead>
            <TableHead>Topic Title & Descriptor</TableHead>
            <TableHead>Content Mapping</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredTopics.map((t) => {
            const parentUnit = units.find((u) => u.id === t.unitId);
            const parentMod = parentUnit ? modules.find((m) => m.id === parentUnit.moduleId) : null;
            const parentSubj = parentMod ? subjects.find((s) => s.id === parentMod.subjectId) : null;

            return (
              <TableRow key={t.id}>
                <TableCell className="font-bold text-foreground">
                  <div className="text-xs">
                    <span className="text-primary font-black">{parentSubj ? parentSubj.code : ''}</span>
                    <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                      Unit {parentUnit ? parentUnit.unitNumber : 1}: {parentUnit?.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-extrabold text-foreground">Topic #{t.topicNumber || 1}</TableCell>
                <TableCell className="font-semibold text-foreground">
                  <div>
                    <span className="font-extrabold text-foreground">{t.title}</span>
                    {t.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 font-normal mt-0.5">
                        {t.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="p-1 rounded bg-blue-500/10 text-blue-500" title="Notes Available"><FileText className="h-3 w-3" /></span>
                    <span className="p-1 rounded bg-indigo-500/10 text-indigo-500" title="Micro Topic Video"><Video className="h-3 w-3" /></span>
                  </div>
                </TableCell>
                <TableCell>
                  {t.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                      <XCircle className="h-3 w-3" /> {t.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    status={t.status}
                    onView={() => handleOpenView(t)}
                    onEdit={() => handleOpenEdit(t)}
                    onToggleStatus={() => toggleTopicStatus(t.id)}
                    onDelete={() => archiveTopic(t.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredTopics.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No micro-topics found matching criteria. Click "+ Add Syllabus Topic" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Syllabus Topic' : 'Add Syllabus Topic'}
        subtitle="Define micro-topic concept within a topic unit"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Parent Topic Unit *"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              disabled={!!editingId}
              options={units.map((u) => {
                const parentMod = modules.find((m) => m.id === u.moduleId);
                const parentSubj = parentMod ? subjects.find((s) => s.id === parentMod.subjectId) : null;
                return {
                  label: `${parentSubj ? `${parentSubj.code} - ` : ''}Unit ${u.unitNumber}: ${u.title}`,
                  value: u.id,
                };
              })}
            />

            <Input
              label="Topic Sequence Number *"
              type="number"
              value={topicNumber}
              onChange={(e) => setTopicNumber(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Topic Title *"
            placeholder="e.g. Entity Sets, Key Attributes & Composite Attributes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">Concept Summary & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of concept coverage, exam importance, or formula notes..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none text-xs"
            />
          </div>

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as TopicStatus)}
            options={[
              { label: 'ACTIVE (Published)', value: 'ACTIVE' },
              { label: 'INACTIVE (Draft)', value: 'INACTIVE' },
            ]}
          />

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedTopic && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Topic Overview: Topic #${selectedTopic.topicNumber}`}
          subtitle={selectedTopic.title}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                #{selectedTopic.topicNumber}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedTopic.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Micro Syllabus Topic</p>
              </div>
            </div>

            {selectedTopic.description && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground leading-relaxed">
                {selectedTopic.description}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedTopic.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedTopic.status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Topic ID</span>
                <span className="font-mono text-foreground font-bold">{selectedTopic.id}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
