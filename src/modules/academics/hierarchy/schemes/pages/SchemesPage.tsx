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
import { Scheme, SchemeStatus } from '../types/schemes.types';

export const SchemesPage: React.FC = () => {
  const { schemes, addScheme, updateScheme, toggleSchemeStatus, archiveScheme } = useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [totalCredits, setTotalCredits] = useState(160);
  const [status, setStatus] = useState<SchemeStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = schemes.length;
  const activeCount = schemes.filter((s) => s.status === 'ACTIVE').length;
  const draftCount = schemes.filter((s) => s.status === 'INACTIVE').length;
  const archivedCount = schemes.filter((s) => s.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setYear('');
    setTitle('');
    setTotalCredits(160);
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Scheme) => {
    setEditingId(s.id);
    setYear(s.year);
    setTitle(s.title);
    setTotalCredits(s.totalCreditsRequired || 160);
    setStatus(s.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (s: Scheme) => {
    setSelectedScheme(s);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!year.trim() || !title.trim()) {
      setErrorMsg('Scheme year and title are required.');
      return;
    }

    if (editingId) {
      const res = updateScheme(editingId, {
        year: year.trim(),
        title: title.trim(),
        totalCreditsRequired: Number(totalCredits),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update scheme.');
        return;
      }
    } else {
      const res = addScheme({
        year: year.trim(),
        title: title.trim(),
        totalCreditsRequired: Number(totalCredits),
        isDefault: false,
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add scheme.');
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
            <span>Schemes</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">VTU Academic Schemes</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage VTU curriculum schemes (2025 NEP, 2022 CBCS, 2021 OBE, 2018 Legacy).
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Academic Scheme
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Schemes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Curriculums
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Schemes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Current
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Draft / Inactive</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{draftCount}</span>
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
              Legacy
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search Scheme Year or Title..."
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
            <TableHead>Scheme Year</TableHead>
            <TableHead>Scheme Title</TableHead>
            <TableHead>Total Credits</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredSchemes.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-bold text-foreground">
                <div className="h-7 w-20 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                  {s.year} Scheme
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                {s.title} {s.isDefault && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
              </TableCell>
              <TableCell className="font-bold text-foreground">{s.totalCreditsRequired || 160} Credits</TableCell>
              <TableCell>
                {s.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <XCircle className="h-3 w-3" /> {s.status}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  status={s.status}
                  onView={() => handleOpenView(s)}
                  onEdit={() => handleOpenEdit(s)}
                  onToggleStatus={() => toggleSchemeStatus(s.id)}
                  onDelete={() => archiveScheme(s.id)}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredSchemes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                No academic schemes found matching filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Academic Scheme' : 'Add Academic Scheme'}
        subtitle="Manage VTU curriculum regulation schemes"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="Scheme Year *"
            placeholder="e.g. 2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <Input
            label="Scheme Title *"
            placeholder="e.g. 2025 NEP Model Scheme"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Total Credits Required *"
            type="number"
            value={totalCredits}
            onChange={(e) => setTotalCredits(Number(e.target.value))}
            required
          />

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as SchemeStatus)}
            options={[
              { label: 'ACTIVE (Current Scheme)', value: 'ACTIVE' },
              { label: 'INACTIVE (Draft/Legacy)', value: 'INACTIVE' },
            ]}
          />

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Create Scheme'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedScheme && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Scheme Overview: ${selectedScheme.year}`}
          subtitle={selectedScheme.title}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                {selectedScheme.year}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedScheme.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">VTU Academic Curriculum Scheme</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedScheme.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedScheme.status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Total Credits</span>
                <span className="font-black text-foreground">{selectedScheme.totalCreditsRequired || 160} Credits</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
