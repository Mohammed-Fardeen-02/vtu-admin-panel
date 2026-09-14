import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
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
import { Module, ModuleStatus } from '../types/modules.types';

export const ModulesPage: React.FC = () => {
  const { modules, subjects, addModule, updateModule, toggleModuleStatus, archiveModule } =
    useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [subjectId, setSubjectId] = useState('');
  const [moduleNumber, setModuleNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teachingHours, setTeachingHours] = useState<number>(8);
  const [status, setStatus] = useState<ModuleStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredModules = modules.filter((m) => {
    const targetSubject = subjects.find((s) => s.id === m.subjectId);
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (targetSubject && targetSubject.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubjectId === 'ALL' || m.subjectId === selectedSubjectId;

    return matchesSearch && matchesSubject;
  });

  const totalCount = modules.length;
  const activeCount = modules.filter((m) => m.status === 'ACTIVE').length;
  const inactiveCount = modules.filter((m) => m.status === 'INACTIVE').length;
  const archivedCount = modules.filter((m) => m.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    const defaultSubj = subjects[0]?.id || '';
    setSubjectId(defaultSubj);
    setModuleNumber(1);
    setTitle('');
    setDescription('');
    setTeachingHours(8);
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Module) => {
    setEditingId(m.id);
    setSubjectId(m.subjectId);
    setModuleNumber(m.moduleNumber);
    setTitle(m.title);
    setDescription(m.description || '');
    setTeachingHours(m.teachingHours || 8);
    setStatus(m.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (m: Module) => {
    setSelectedModule(m);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!subjectId || !title.trim() || moduleNumber < 1) {
      setErrorMsg('Subject entity, module number, and title are required.');
      return;
    }

    if (editingId) {
      const res = updateModule(editingId, {
        moduleNumber: Number(moduleNumber),
        title: title.trim(),
        description: description.trim(),
        teachingHours: Number(teachingHours),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update module.');
        return;
      }
    } else {
      const res = addModule({
        subjectId,
        moduleNumber: Number(moduleNumber),
        title: title.trim(),
        description: description.trim(),
        teachingHours: Number(teachingHours),
        status,
        order: Number(moduleNumber),
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create module.');
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
            <span>Modules</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Syllabus Modules</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure Module 1 through Module 5 syllabus units per subject entity.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Syllabus Module
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Modules</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Modules 1-5
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Modules</span>
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

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search Module Title or Subject Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Subject Code</TableHead>
            <TableHead>Module #</TableHead>
            <TableHead>Module Title & Summary</TableHead>
            <TableHead>Teaching Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredModules.map((m) => {
            const subject = subjects.find((s) => s.id === m.subjectId);
            return (
              <TableRow key={m.id}>
                <TableCell className="font-bold text-foreground">
                  <div className="h-7 px-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                    {subject ? subject.code : 'UNKNOWN'}
                  </div>
                </TableCell>
                <TableCell className="font-extrabold text-foreground">Module {m.moduleNumber}</TableCell>
                <TableCell className="font-semibold text-foreground">
                  <div>{m.title}</div>
                  {m.description && <p className="text-[11px] text-muted-foreground truncate max-w-md">{m.description}</p>}
                </TableCell>
                <TableCell className="font-bold text-foreground">{m.teachingHours || 8} Hours</TableCell>
                <TableCell>
                  {m.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                      <XCircle className="h-3 w-3" /> {m.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    status={m.status}
                    onView={() => handleOpenView(m)}
                    onEdit={() => handleOpenEdit(m)}
                    onToggleStatus={() => toggleModuleStatus(m.id)}
                    onDelete={() => archiveModule(m.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredModules.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No syllabus modules found matching filters. Click "+ Add Syllabus Module" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Syllabus Module' : 'Add Syllabus Module'}
        subtitle="Manage VTU Course Syllabus Module breakdown"
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
              label="Parent Subject Entity *"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              disabled={!!editingId}
              options={subjects.map((s) => ({ label: `${s.code} - ${s.name}`, value: s.id }))}
            />

            <Input
              label="Module Number (1-5) *"
              type="number"
              value={moduleNumber}
              onChange={(e) => setModuleNumber(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Module Title *"
            placeholder="e.g. Module 1: Introduction & Entity Relationship Model"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block font-bold text-foreground text-xs mb-1">Module Overview / Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concepts of Database Systems, Data Abstraction, ER Diagrams & Keys..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Teaching Hours *"
              type="number"
              value={teachingHours}
              onChange={(e) => setTeachingHours(Number(e.target.value))}
              required
            />

            <Select
              label="Status *"
              value={status}
              onChange={(e) => setStatus(e.target.value as ModuleStatus)}
              options={[
                { label: 'ACTIVE (Published)', value: 'ACTIVE' },
                { label: 'INACTIVE (Draft)', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Create Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedModule && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Module Overview: Module ${selectedModule.moduleNumber}`}
          subtitle={selectedModule.title}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                Mod {selectedModule.moduleNumber}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedModule.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Syllabus Module Unit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Teaching Hours</span>
                <span className="font-black text-foreground">{selectedModule.teachingHours || 8} Hours</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedModule.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedModule.status}
                </span>
              </div>
            </div>

            {selectedModule.description && (
              <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                <span className="font-bold text-foreground block mb-1">Description</span>
                {selectedModule.description}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
