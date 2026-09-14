import React, { useState } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Filter } from 'lucide-react';
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
import { Subject, SubjectCategory, SubjectStatus } from '../types/subjects.types';

export const SubjectsPage: React.FC = () => {
  const { subjects, branches, schemes, semesters, addSubject, updateSubject, toggleSubjectStatus, archiveSubject } =
    useAcademicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [semFilter, setSemFilter] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState<number>(5);
  const [credits, setCredits] = useState<number>(4);
  const [category, setCategory] = useState<SubjectCategory>('THEORY');
  const [status, setStatus] = useState<SubjectStatus>('ACTIVE');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'ALL' || s.branchCode === branchFilter;
    const matchesScheme = schemeFilter === 'ALL' || s.schemeYear === schemeFilter;
    const matchesSem = semFilter === 0 || s.semester === semFilter;

    return matchesSearch && matchesBranch && matchesScheme && matchesSem;
  });

  const totalCount = subjects.length;
  const activeCount = subjects.filter((s) => s.status === 'ACTIVE').length;
  const inactiveCount = subjects.filter((s) => s.status === 'INACTIVE').length;
  const archivedCount = subjects.filter((s) => s.status === 'ARCHIVED').length;

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode('');
    setName('');
    setBranchCode(branches[0]?.code || 'CSE');
    setSchemeYear(schemes[0]?.year || '2022');
    setSemester(5);
    setCredits(4);
    setCategory('THEORY');
    setStatus('ACTIVE');
    setDescription('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingId(s.id);
    setCode(s.code);
    setName(s.name);
    setBranchCode(s.branchCode);
    setSchemeYear(s.schemeYear);
    setSemester(s.semester);
    setCredits(s.credits);
    setCategory(s.category);
    setStatus(s.status);
    setDescription(s.description || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenView = (s: Subject) => {
    setSelectedSubject(s);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim() || !name.trim()) {
      setErrorMsg('Subject code and title are required.');
      return;
    }

    if (editingId) {
      const res = updateSubject(editingId, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        branchCode,
        schemeYear,
        semester: Number(semester),
        credits: Number(credits),
        category,
        status,
        description: description.trim(),
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to update subject.');
        return;
      }
    } else {
      const res = addSubject({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        branchCode,
        schemeYear,
        semester: Number(semester),
        credits: Number(credits),
        category,
        status,
        order: subjects.length + 1,
        description: description.trim(),
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to add subject.');
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
            <span>Courses (Subjects)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">VTU Course & Subject Catalog</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Central Course & Subject Entities mapped across Branch, Scheme, Semester, Credits & Category.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} icon={<Plus className="h-4 w-4" />}>
          Add Subject Entity
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Total Subjects</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-foreground">{totalCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Registered
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">Active Courses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              In Syllabus
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

      {/* Search & Cascading Filter Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          <span>Hierarchy Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            placeholder="Search Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.code}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>

          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
          >
            <option value="ALL">All Schemes</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.year}>
                {s.year} Scheme
              </option>
            ))}
          </select>

          <select
            value={semFilter}
            onChange={(e) => setSemFilter(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs cursor-pointer outline-none"
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

      {/* Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Subject Code</TableHead>
            <TableHead>Subject Name</TableHead>
            <TableHead>Branch / Scheme / Sem</TableHead>
            <TableHead>Credits & Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredSubjects.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-bold text-foreground">
                <div className="h-7 w-20 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">
                  {s.code}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                <div>{s.name}</div>
                {s.description && <p className="text-[11px] text-muted-foreground truncate max-w-xs">{s.description}</p>}
              </TableCell>
              <TableCell className="text-xs font-bold text-muted-foreground">
                <span className="text-foreground">{s.branchCode}</span> • {s.schemeYear} Scheme • Sem {s.semester}
              </TableCell>
              <TableCell className="text-xs font-bold text-foreground">
                {s.credits} Credits ({s.category})
              </TableCell>
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
                  onToggleStatus={() => toggleSubjectStatus(s.id)}
                  onDelete={() => archiveSubject(s.id)}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredSubjects.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No subject entities found matching filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Subject Entity' : 'Add Subject Entity'}
        subtitle="Manage VTU Subject Code and Central Academic Mapping"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject Code *"
              placeholder="e.g. 21CS53"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Input
              label="Subject Name *"
              placeholder="e.g. Database Management Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Branch *"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              options={branches.map((b) => ({ label: `${b.code} - ${b.name}`, value: b.code }))}
            />

            <Select
              label="Scheme Year *"
              value={schemeYear}
              onChange={(e) => setSchemeYear(e.target.value)}
              options={schemes.map((s) => ({ label: `${s.year} Scheme`, value: s.year }))}
            />

            <Select
              label="Semester *"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              options={semesters.map((sem) => ({ label: `Sem ${sem.semesterNumber}`, value: sem.semesterNumber }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Credits *"
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />

            <Select
              label="Course Category *"
              value={category}
              onChange={(e) => setCategory(e.target.value as SubjectCategory)}
              options={[
                { label: 'THEORY', value: 'THEORY' },
                { label: 'LAB / PRACTICAL', value: 'LAB' },
                { label: 'INTEGRATED', value: 'INTEGRATED' },
                { label: 'ELECTIVE', value: 'ELECTIVE' },
              ]}
            />

            <Select
              label="Status *"
              value={status}
              onChange={(e) => setStatus(e.target.value as SubjectStatus)}
              options={[
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'INACTIVE', value: 'INACTIVE' },
              ]}
            />
          </div>

          <div>
            <label className="block font-bold text-foreground text-xs mb-1">Description / Syllabus Summary</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief course objectives and overview..."
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary/40 outline-none text-xs"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingId ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Overview Modal */}
      {selectedSubject && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Subject Overview: ${selectedSubject.code}`}
          subtitle={selectedSubject.name}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-lg">
                {selectedSubject.code}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-foreground">{selectedSubject.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedSubject.branchCode} • {selectedSubject.schemeYear} Scheme • Sem {selectedSubject.semester}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Credits & Type</span>
                <span className="font-black text-foreground">{selectedSubject.credits} Credits ({selectedSubject.category})</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Status</span>
                <span className={`font-extrabold ${selectedSubject.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {selectedSubject.status}
                </span>
              </div>
            </div>

            {selectedSubject.description && (
              <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                <span className="font-bold text-foreground block mb-1">Description</span>
                {selectedSubject.description}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
