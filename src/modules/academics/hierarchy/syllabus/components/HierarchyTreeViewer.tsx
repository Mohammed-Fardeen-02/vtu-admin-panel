import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  FileCode,
  AlertTriangle,
  Power,
} from 'lucide-react';
import { Badge, Button, ConfirmationModal } from '../../../../../shared/components/ui';
import { useAcademicStore } from '../../../../../store/useAcademicStore';
import { AcademicSubject } from '../../../../../shared/types/academic.types';

export interface HierarchyTreeViewerProps {
  onSelectSubjectForModules?: (subject: AcademicSubject) => void;
}

export const HierarchyTreeViewer: React.FC<HierarchyTreeViewerProps> = ({
  onSelectSubjectForModules,
}) => {
  const {
    branches,
    schemes,
    semesters,
    subjects,
    modules,
    units,
    topics,
    toggleSubjectStatus,
  } = useAcademicStore();

  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.code || 'CSE');
  const [selectedScheme, setSelectedScheme] = useState<string>(schemes[0]?.year || '2022');
  const [selectedSem, setSelectedSem] = useState<number>(5);

  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

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

  const toggleSubjectExpand = (id: string) => {
    const next = new Set(expandedSubjects);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSubjects(next);
  };

  const toggleModuleExpand = (id: string) => {
    const next = new Set(expandedModules);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedModules(next);
  };

  const activeBranchObj = branches.find((b) => b.code === selectedBranch);

  const activeSubjects = subjects.filter(
    (s) =>
      s.branchCode === selectedBranch &&
      s.schemeYear === selectedScheme &&
      s.semester === selectedSem
  );

  return (
    <div className="space-y-6">
      {/* Visual Hierarchy Flow Banner */}
      <div className="p-4 rounded-2xl border border-primary/20 bg-card shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span>Central Source of Truth Hierarchy Pipeline</span>
          </h3>
          <span className="text-[11px] font-bold text-muted-foreground">
            Shared by Notes, PYQs, Passing Packages, Community Notes, Formulas & Video Learning
          </span>
        </div>

        {/* Pipeline Step Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {/* Step 1: Branch */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">1. Branch</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              {activeBranchObj ? activeBranchObj.code : selectedBranch}
            </span>
          </div>

          {/* Step 2: Scheme */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <GraduationCap className="h-4 w-4 text-purple-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">2. Scheme</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              {selectedScheme} Scheme
            </span>
          </div>

          {/* Step 3: Semester */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">3. Semester</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              Semester {selectedSem}
            </span>
          </div>

          {/* Step 4: Subject */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <BookOpen className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">4. Subject</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              {activeSubjects.length} Registered
            </span>
          </div>

          {/* Step 5: Module */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">5. Module</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              Modules 1-5
            </span>
          </div>

          {/* Step 6: Unit */}
          <div className="p-2.5 rounded-xl border border-border bg-accent/20 flex flex-col items-center text-center space-y-1">
            <FileCode className="h-4 w-4 text-rose-500" />
            <span className="text-[10px] font-black text-muted-foreground uppercase">6. Unit</span>
            <span className="text-xs font-bold text-foreground truncate w-full">
              Subtopic Units
            </span>
          </div>
        </div>
      </div>

      {/* Hierarchy Selector Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Branch Selector */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>Select Engineering Branch</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-black cursor-pointer focus:ring-2 focus:ring-primary/40 outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.code}>
                {b.code} - {b.name} ({b.status})
              </option>
            ))}
          </select>
        </div>

        {/* Scheme Selector */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            <span>Select VTU Scheme</span>
          </label>
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-black cursor-pointer focus:ring-2 focus:ring-primary/40 outline-none"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.year}>
                {s.year} Scheme - {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selector */}
        <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
          <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Select Academic Semester</span>
          </label>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(Number(e.target.value))}
            className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-card text-foreground font-black cursor-pointer focus:ring-2 focus:ring-primary/40 outline-none"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.semesterNumber}>
                Sem {sem.semesterNumber} - {sem.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tree Content Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-foreground flex items-center gap-2">
            <span>Hierarchy Tree Breakdown</span>
            <Badge variant="primary" className="text-[10px]">
              {selectedBranch} • {selectedScheme} Scheme • Sem {selectedSem}
            </Badge>
          </h4>
          <span className="text-xs text-muted-foreground font-semibold">
            {activeSubjects.length} Subject Nodes found
          </span>
        </div>

        {activeSubjects.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-extrabold text-foreground">No Subjects Mapped to this Hierarchy</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              There are currently no subject entities registered for {selectedBranch} under the {selectedScheme} Scheme for Semester {selectedSem}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSubjects.map((subject) => {
              const isSubjExpanded = expandedSubjects.has(subject.id);
              const subjectModules = modules
                .filter((m) => m.subjectId === subject.id)
                .sort((a, b) => a.moduleNumber - b.moduleNumber);

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden transition-all"
                >
                  {/* Subject Node Bar */}
                  <div
                    onClick={() => toggleSubjectExpand(subject.id)}
                    className="p-4 bg-accent/20 hover:bg-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button className="text-muted-foreground hover:text-foreground">
                        {isSubjExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      <span className="px-2.5 py-1 rounded-lg bg-primary text-white font-black text-xs">
                        {subject.code}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-extrabold text-foreground truncate">
                            {subject.name}
                          </h5>
                          <Badge variant={subject.status === 'ACTIVE' ? 'success' : 'neutral'} className="text-[9px]">
                            {subject.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {subject.category} • {subject.credits} Credits • {subjectModules.length} Syllabus Modules
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onSelectSubjectForModules && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onSelectSubjectForModules(subject)}
                          icon={<Layers className="h-3.5 w-3.5" />}
                        >
                          Manage Modules
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSubjectStatus(subject.id)}
                        icon={<Power className="h-3.5 w-3.5" />}
                      >
                        {subject.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>

                  {/* Modules & Units Sub-tree */}
                  {isSubjExpanded && (
                    <div className="p-4 border-t border-border/80 bg-card space-y-3 pl-6 sm:pl-10">
                      {subjectModules.length === 0 ? (
                        <div className="p-4 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                          No modules created for {subject.code} yet.
                        </div>
                      ) : (
                        subjectModules.map((mod) => {
                          const isModExpanded = expandedModules.has(mod.id);
                          const moduleUnits = units
                            .filter((u) => u.moduleId === mod.id)
                            .sort((a, b) => a.unitNumber - b.unitNumber);

                          return (
                            <div
                              key={mod.id}
                              className="rounded-xl border border-border/70 bg-accent/10 overflow-hidden"
                            >
                              {/* Module Node Bar */}
                              <div
                                onClick={() => toggleModuleExpand(mod.id)}
                                className="p-3 hover:bg-accent/30 transition-colors flex items-center justify-between gap-3 cursor-pointer text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <button className="text-muted-foreground hover:text-foreground">
                                    {isModExpanded ? (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                  <span className="font-black text-primary">Module {mod.moduleNumber}</span>
                                  <span className="font-extrabold text-foreground truncate">{mod.title}</span>
                                </div>

                                <div
                                  className="flex items-center gap-2 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Badge variant={mod.status === 'ACTIVE' ? 'success' : 'neutral'} className="text-[9px]">
                                    {mod.status}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground font-semibold">
                                    {moduleUnits.length} Units
                                  </span>
                                </div>
                              </div>

                              {/* Units Sub-list */}
                              {isModExpanded && (
                                <div className="p-3 border-t border-border/60 bg-card/60 space-y-2 pl-6 sm:pl-8">
                                  {moduleUnits.length === 0 ? (
                                    <p className="text-[11px] text-muted-foreground italic">No subtopic units added.</p>
                                  ) : (
                                    moduleUnits.map((u) => {
                                      const unitTopics = topics.filter((t) => t.unitId === u.id);
                                      return (
                                        <div key={u.id} className="space-y-1">
                                          <div className="p-2 rounded-lg border border-border/40 bg-accent/5 flex items-center justify-between text-[11px]">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <FileCode className="h-3 w-3 text-primary flex-shrink-0" />
                                              <span className="font-bold text-foreground truncate">{u.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                              <span className="text-[10px] text-muted-foreground">{unitTopics.length || u.topicsCount} Topics</span>
                                              <Badge variant={u.status === 'ACTIVE' ? 'success' : 'neutral'} className="text-[8px]">
                                                {u.status}
                                              </Badge>
                                            </div>
                                          </div>

                                          {/* Micro-topics pill list */}
                                          {unitTopics.length > 0 && (
                                            <div className="pl-4 flex flex-wrap gap-1 pt-0.5">
                                              {unitTopics.map((tp) => (
                                                <span
                                                  key={tp.id}
                                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400"
                                                >
                                                  #{tp.topicNumber}: {tp.title}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
