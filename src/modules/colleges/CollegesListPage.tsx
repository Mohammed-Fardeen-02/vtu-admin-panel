import React, { useState } from 'react';
import { Building2, Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
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
} from '../../shared/components/ui';

export interface College {
  id: string;
  code: string;
  name: string;
  region: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const INITIAL_COLLEGES: College[] = [
  { id: 'c-1', code: '1VA', name: 'Sai Vidya Institute of Technology', region: 'Bengaluru', type: 'AFFILIATED', status: 'ACTIVE' },
  { id: 'c-2', code: '1RV', name: 'R. V. College of Engineering', region: 'Bengaluru', type: 'AUTONOMOUS', status: 'ACTIVE' },
  { id: 'c-3', code: '1BMS', name: 'B.M.S. College of Engineering', region: 'Bengaluru', type: 'AUTONOMOUS', status: 'ACTIVE' },
  { id: 'c-4', code: '2GI', name: 'KLS Gogte Institute of Technology', region: 'Belagavi', type: 'AUTONOMOUS', status: 'ACTIVE' },
  { id: 'c-5', code: '3PG', name: 'VTU PG Centre Kalaburagi', region: 'Kalaburagi', type: 'CONSTITUENT', status: 'ACTIVE' },
];

export const CollegesListPage: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Bengaluru');
  const [type, setType] = useState('AFFILIATED');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'ALL' || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const totalCount = colleges.length;
  const activeCount = colleges.filter((c) => c.status === 'ACTIVE').length;
  const autonomousCount = colleges.filter((c) => c.type === 'AUTONOMOUS').length;
  const affiliatedCount = colleges.filter((c) => c.type === 'AFFILIATED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setRegion('Bengaluru');
    setType('AFFILIATED');
    setStatus('ACTIVE');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: College) => {
    setEditingId(c.id);
    setCode(c.code);
    setName(c.name);
    setRegion(c.region);
    setType(c.type);
    setStatus(c.status);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (c: College) => {
    setSelectedCollege(c);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    setColleges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c))
    );
  };

  const handleDelete = (id: string) => {
    setColleges((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim() || !name.trim()) {
      setErrorMsg('College code and name are required.');
      return;
    }

    if (editingId) {
      setColleges((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, code: code.trim().toUpperCase(), name: name.trim(), region, type, status } : c
        )
      );
    } else {
      const newCol: College = {
        id: `c-${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        region,
        type,
        status,
      };
      setColleges((prev) => [...prev, newCol]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <span>System</span>
            <span>/</span>
            <span>Colleges</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">VTU Affiliated Colleges Directory</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Master registry of engineering colleges across Bengaluru, Mysuru, Belagavi, and Kalaburagi regions.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add VTU College
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Colleges</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Institutions
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Colleges</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Autonomous</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{autonomousCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Autonomous
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Affiliated</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{affiliatedCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Affiliated
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search College Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
          >
            <option value="ALL">All Regions</option>
            <option value="Bengaluru">Bengaluru Region</option>
            <option value="Belagavi">Belagavi Region</option>
            <option value="Mysuru">Mysuru Region</option>
            <option value="Kalaburagi">Kalaburagi Region</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>College Code</TableHead>
            <TableHead>Institution Name</TableHead>
            <TableHead>VTU Region</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredColleges.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-bold text-foreground">
                <div className="h-7 w-16 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">
                  {c.code}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">{c.name}</TableCell>
              <TableCell className="font-bold text-muted-foreground">{c.region}</TableCell>
              <TableCell className="font-bold text-foreground">{c.type}</TableCell>
              <TableCell>
                {c.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <XCircle className="h-3 w-3" /> INACTIVE
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ActionDropdown
                  status={c.status}
                  onView={() => handleOpenView(c)}
                  onEdit={() => handleOpenEdit(c)}
                  onToggleStatus={() => handleToggleStatus(c.id)}
                  onDelete={() => handleDelete(c.id)}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredColleges.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No engineering colleges found matching filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit College Details' : 'Add VTU College'}
        subtitle="Manage VTU institution code, region, and affiliation type"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Input
            label="College Code (e.g. 1VA) *"
            placeholder="e.g. 1VA"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Input
            label="College Full Name *"
            placeholder="e.g. Sai Vidya Institute of Technology"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Region *"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              options={[
                { label: 'Bengaluru', value: 'Bengaluru' },
                { label: 'Belagavi', value: 'Belagavi' },
                { label: 'Mysuru', value: 'Mysuru' },
                { label: 'Kalaburagi', value: 'Kalaburagi' },
              ]}
            />

            <Select
              label="Affiliation Type *"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { label: 'AFFILIATED', value: 'AFFILIATED' },
                { label: 'AUTONOMOUS', value: 'AUTONOMOUS' },
                { label: 'CONSTITUENT', value: 'CONSTITUENT' },
              ]}
            />
          </div>

          <Select
            label="Status *"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
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
              {editingId ? 'Save Changes' : 'Create College'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedCollege && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`College Overview: ${selectedCollege.code}`}
          subtitle={selectedCollege.name}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-lg">
                {selectedCollege.code}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedCollege.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedCollege.region} Region • {selectedCollege.type}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
