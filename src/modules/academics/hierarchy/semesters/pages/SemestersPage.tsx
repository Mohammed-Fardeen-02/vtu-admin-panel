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
import { Semester, SemesterStatus } from '../types/semesters.types';

export const SemestersPage: React.FC = () => {
  const { semesters, addSemester, updateSemester, toggleSemesterStatus, archiveSemester } = useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [semesterNumber, setSemesterNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<SemesterStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredSemesters = semesters.filter((sem) => {
    const matchesSearch =
      sem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sem.semesterNumber.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || sem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = semesters.length;
  const activeCount = semesters.filter((s) => s.status === 'ACTIVE').length;
  const inactiveCount = semesters.filter((s) => s.status === 'INACTIVE').length;
  const archivedCount = semesters.filter((s) => s.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setSemesterNumber(semesters.length + 1);
    setTitle(`Semester ${semesters.length + 1}`);
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sem: Semester) => {
    setEditingId(sem.id);
    setSemesterNumber(sem.semesterNumber);
    setTitle(sem.title);
    setStatus(sem.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (sem: Semester) => {
    setSelectedSemester(sem);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!title.trim() || semesterNumber < 1) {
      setErrorMsg('Valid semester number and title are required.');
      return;
    }

    if (editingId) {
      const res = updateSemester(editingId, {
        semesterNumber: Number(semesterNumber),
        title: title.trim(),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update semester.');
        return;
      }
    } else {
      const res = addSemester({
        semesterNumber: Number(semesterNumber),
        title: title.trim(),
        order: Number(semesterNumber),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add semester.');
        return;
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <span>Academic Hierarchy</span>
            <span>/</span>
            <span>Semesters</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">VTU Academic Semesters</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure Academic Semesters 1 through 8 across B.E. / B.Tech engineering programs.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Academic Semester
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Semesters</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Terms 1 - 8
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Semesters</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Enabled
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Inactive Semesters</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{inactiveCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Disabled
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

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search Semester Title or Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
            <option value="ARCHIVED">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Sem #</TableHead>
            <TableHead>Semester Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredSemesters.map((sem) => (
            <TableRow key={sem.id}>
              <TableCell className="font-bold text-foreground">
                <div className="h-7 w-16 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs">
                  Sem {sem.semesterNumber}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">{sem.title}</TableCell>
              <TableCell>
                {sem.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <XCircle className="h-3 w-3" /> {sem.status}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  status={sem.status}
                  onView={() => handleOpenView(sem)}
                  onEdit={() => handleOpenEdit(sem)}
                  onToggleStatus={() => toggleSemesterStatus(sem.id)}
                  onDelete={() => archiveSemester(sem.id)}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredSemesters.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No academic semesters found matching filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Academic Semester' : 'Add Academic Semester'}
        subtitle="Manage VTU term number and descriptor"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="Semester Number (1-8) *"
            type="number"
            value={semesterNumber}
            onChange={(e) => setSemesterNumber(Number(e.target.value))}
            required
          />

          <Input
            label="Semester Title Descriptor *"
            placeholder="e.g. 5th Semester (Professional Core & Electives)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as SemesterStatus)}
            options={[
              { label: 'ACTIVE (Enabled)', value: 'ACTIVE' },
              { label: 'INACTIVE (Disabled)', value: 'INACTIVE' },
            ]}
          />

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Create Semester'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedSemester && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Semester Overview: Sem ${selectedSemester.semesterNumber}`}
          subtitle={selectedSemester.title}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg">
                Sem {selectedSemester.semesterNumber}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedSemester.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">VTU Academic Program Term</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedSemester.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedSemester.status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Term Number</span>
                <span className="font-black text-foreground">Semester {selectedSemester.semesterNumber}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
