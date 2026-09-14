import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, FileText, Video, HelpCircle } from 'lucide-react';
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
import { Unit, UnitStatus } from '../types/units.types';

export const UnitsPage: React.FC = () => {
  const { units, modules, subjects, addUnit, updateUnit, toggleUnitStatus, archiveUnit } = useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [moduleId, setModuleId] = useState('');
  const [unitNumber, setUnitNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [topicsCount, setTopicsCount] = useState<number>(5);
  const [status, setStatus] = useState<UnitStatus>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredUnits = units.filter((u) => {
    const parentModule = modules.find((m) => m.id === u.moduleId);
    const parentSubject = parentModule ? subjects.find((s) => s.id === parentModule.subjectId) : null;

    const matchesSearch =
      u.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parentModule && parentModule.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (parentSubject && parentSubject.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesModule = selectedModuleId === 'ALL' || u.moduleId === selectedModuleId;
    return matchesSearch && matchesModule;
  });

  const totalCount = units.length;
  const activeCount = units.filter((u) => u.status === 'ACTIVE').length;
  const inactiveCount = units.filter((u) => u.status === 'INACTIVE').length;
  const archivedCount = units.filter((u) => u.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setModuleId(modules[0]?.id || '');
    setUnitNumber(1);
    setTitle('');
    setTopicsCount(5);
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: Unit) => {
    setEditingId(u.id);
    setModuleId(u.moduleId);
    setUnitNumber(u.unitNumber);
    setTitle(u.title);
    setTopicsCount(u.topicsCount || 5);
    setStatus(u.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (u: Unit) => {
    setSelectedUnit(u);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!moduleId || !title.trim() || unitNumber < 1) {
      setErrorMsg('Parent module, unit number, and title are required.');
      return;
    }

    if (editingId) {
      const res = updateUnit(editingId, {
        unitNumber: Number(unitNumber),
        title: title.trim(),
        topicsCount: Number(topicsCount),
        status,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update unit.');
        return;
      }
    } else {
      const res = addUnit({
        moduleId,
        unitNumber: Number(unitNumber),
        title: title.trim(),
        topicsCount: Number(topicsCount),
        status,
        order: Number(unitNumber),
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add unit.');
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
            <span>Units</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Syllabus Topic Units</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Subtopic Units within Modules linked directly to Notes, Question Papers, Formulas, and Video Content.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Topic Unit
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Units</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Units
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Units</span>
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
            placeholder="Search Unit Title or Module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none max-w-xs"
          >
            <option value="ALL">All Modules</option>
            {modules.map((m) => {
              const subj = subjects.find((s) => s.id === m.subjectId);
              return (
                <option key={m.id} value={m.id}>
                  {subj ? `${subj.code} - ` : ''}Mod {m.moduleNumber}: {m.title}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Parent Module</TableHead>
            <TableHead>Unit #</TableHead>
            <TableHead>Unit Title</TableHead>
            <TableHead>Sub-topics</TableHead>
            <TableHead>Linked Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredUnits.map((u) => {
            const parentMod = modules.find((m) => m.id === u.moduleId);
            const parentSubj = parentMod ? subjects.find((s) => s.id === parentMod.subjectId) : null;
            return (
              <TableRow key={u.id}>
                <TableCell className="font-bold text-foreground">
                  <div className="text-xs">
                    <span className="text-primary font-black">{parentSubj ? parentSubj.code : ''}</span>
                    <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                      Module {parentMod ? parentMod.moduleNumber : 1}: {parentMod?.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-extrabold text-foreground">Unit {u.unitNumber}</TableCell>
                <TableCell className="font-semibold text-foreground">{u.title}</TableCell>
                <TableCell className="font-bold text-foreground">{u.topicsCount || 5} Topics</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="p-1 rounded bg-blue-500/10 text-blue-500" title="Notes"><FileText className="h-3 w-3" /></span>
                    <span className="p-1 rounded bg-purple-500/10 text-purple-500" title="Videos"><Video className="h-3 w-3" /></span>
                    <span className="p-1 rounded bg-amber-500/10 text-amber-500" title="Question Papers"><HelpCircle className="h-3 w-3" /></span>
                  </div>
                </TableCell>
                <TableCell>
                  {u.status === 'ACTIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                      <XCircle className="h-3 w-3" /> {u.status}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionDropdown
                    status={u.status}
                    onView={() => handleOpenView(u)}
                    onEdit={() => handleOpenEdit(u)}
                    onToggleStatus={() => toggleUnitStatus(u.id)}
                    onDelete={() => archiveUnit(u.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredUnits.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                No syllabus units found matching filters. Click "+ Add Topic Unit" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Topic Unit' : 'Add Topic Unit'}
        subtitle="Specify unit descriptor and syllabus topic coverage count"
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
              label="Parent Module *"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              disabled={!!editingId}
              options={modules.map((m) => {
                const subj = subjects.find((s) => s.id === m.subjectId);
                return {
                  label: `${subj ? `${subj.code} - ` : ''}Mod ${m.moduleNumber}: ${m.title}`,
                  value: m.id,
                };
              })}
            />

            <Input
              label="Unit Number *"
              type="number"
              value={unitNumber}
              onChange={(e) => setUnitNumber(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Unit Title *"
            placeholder="e.g. Database System Concepts & Architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Topics Count *"
              type="number"
              value={topicsCount}
              onChange={(e) => setTopicsCount(Number(e.target.value))}
              required
            />

            <Select
              label="Status *"
              value={status}
              onChange={(e) => setStatus(e.target.value as UnitStatus)}
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
              {editingId ? 'Save Changes' : 'Create Unit'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedUnit && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Unit Overview: Unit ${selectedUnit.unitNumber}`}
          subtitle={selectedUnit.title}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
                Unit {selectedUnit.unitNumber}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedUnit.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Syllabus Topic Unit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Sub-topics</span>
                <span className="font-black text-foreground">{selectedUnit.topicsCount || 5} Topics</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedUnit.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedUnit.status}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
