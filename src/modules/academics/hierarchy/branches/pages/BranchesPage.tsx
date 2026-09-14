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
import { Branch, BranchStatus } from '../types/branches.types';

export const BranchesPage: React.FC = () => {
  const { branches, addBranch, updateBranch, toggleBranchStatus, archiveBranch } = useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<BranchStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredBranches = branches.filter((b) => {
    const matchesSearch =
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = branches.length;
  const activeCount = branches.filter((b) => b.status === 'ACTIVE').length;
  const inactiveCount = branches.filter((b) => b.status === 'INACTIVE').length;
  const archivedCount = branches.filter((b) => b.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingId(b.id);
    setCode(b.code);
    setName(b.name);
    setStatus(b.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (b: Branch) => {
    setSelectedBranch(b);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim() || !name.trim()) {
      setErrorMsg('Branch code and name are required.');
      return;
    }

    if (editingId) {
      const res = updateBranch(editingId, { code: code.trim().toUpperCase(), name: name.trim(), status });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update branch.');
        return;
      }
    } else {
      const res = addBranch({ code: code.trim().toUpperCase(), name: name.trim(), status, order: branches.length + 1 });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add branch.');
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
            <span>Branches</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">VTU Engineering Branches</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage academic discipline codes (CSE, ISE, ECE, AIML, EEE, CIVIL, MECH).
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Engineering Branch
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Branches</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Disciplines
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Branches</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Enabled
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Inactive Branches</span>
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

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search Branch Code or Name..."
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

      {/* Data Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Code</TableHead>
            <TableHead>Branch Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredBranches.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-bold text-foreground">
                <div className="h-7 w-16 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">
                  {b.code}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">{b.name}</TableCell>
              <TableCell>
                {b.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <XCircle className="h-3 w-3" /> {b.status}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  status={b.status}
                  onView={() => handleOpenView(b)}
                  onEdit={() => handleOpenEdit(b)}
                  onToggleStatus={() => toggleBranchStatus(b.id)}
                  onDelete={() => archiveBranch(b.id)}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredBranches.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No engineering branches found matching filters. Click "+ Add Engineering Branch" to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Engineering Branch' : 'Add Engineering Branch'}
        subtitle="Manage VTU discipline code and descriptor"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="Branch Code *"
            placeholder="e.g. CSE"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Input
            label="Branch Name *"
            placeholder="e.g. Computer Science & Engineering"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as BranchStatus)}
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
              {editingId ? 'Save Changes' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedBranch && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Branch Overview: ${selectedBranch.code}`}
          subtitle={selectedBranch.name}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-lg">
                {selectedBranch.code}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedBranch.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">VTU Engineering Discipline Code</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedBranch.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedBranch.status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Branch Code</span>
                <span className="font-black text-foreground">{selectedBranch.code}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
