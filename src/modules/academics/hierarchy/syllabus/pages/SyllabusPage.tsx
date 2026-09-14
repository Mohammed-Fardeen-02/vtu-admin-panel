import React from 'react';
import { HierarchyTreeViewer } from '../components/HierarchyTreeViewer';
import { AcademicSubject } from '../../../../../shared/types/academic.types';
import { useNavigate } from 'react-router-dom';

export const SyllabusPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <span>Academic Hierarchy</span>
            <span>/</span>
            <span>Syllabus</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Syllabus & Curriculum Pipeline</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Visual cascade viewer linking Engineering Branch → Academic Scheme → Semester → Subject → Syllabus Modules.
          </p>
        </div>
      </div>

      {/* Main Hierarchy Tree Breakdown */}
      <HierarchyTreeViewer
        onSelectSubjectForModules={(subject: AcademicSubject) => {
          navigate(`/academics/course-structure/modules?subjectId=${subject.id}`);
        }}
      />
    </div>
  );
};
