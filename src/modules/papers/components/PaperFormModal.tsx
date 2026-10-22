import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';
import { CustomDropdown, CustomDropdownOption } from '../../../shared/components/ui/CustomDropdown';
import { useAcademicStore } from '../../../store/useAcademicStore';
import {
  AdminQuestionPaper,
  PaperType,
  ExamCategory,
  PaperStatus,
  PaperContentType,
  PaperModule,
  QuestionSubItem,
  BloomLevel,
} from '../../../shared/types/papers.types';

export interface PaperFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  initialPaper?: AdminQuestionPaper | null;
}

const DEFAULT_MODULES: PaperModule[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: Fundamental Concepts & Architecture',
    mainQuestions: [
      {
        questionNumber: 'Q1',
        choices: [
          {
            choiceId: 'Q1a',
            subQuestions: [
              {
                subCode: 'a',
                text: 'Explain the core principles and design objectives with a neat block diagram.',
                marks: 6,
                bloomLevel: 'L2',
                solution: 'The core principles involve modularity, loose coupling, and high cohesion...',
              },
              {
                subCode: 'b',
                text: 'Compare and contrast the primary approaches used in industry applications.',
                marks: 7,
                bloomLevel: 'L3',
                solution: 'Approach A focuses on low latency while Approach B prioritizes consistency...',
              },
              {
                subCode: 'c',
                text: 'Formulate a mathematical or algorithmic model for the system.',
                marks: 7,
                bloomLevel: 'L4',
                solution: 'Let S be the set of states and T be the transition matrix...',
              },
            ],
          },
          {
            choiceId: 'Q1b',
            isOrOption: true,
            subQuestions: [
              {
                subCode: 'a',
                text: 'Elaborate on requirement analysis techniques with examples.',
                marks: 10,
                bloomLevel: 'L2',
                solution: 'Techniques include interviews, workshops, prototyping, and use-case modeling...',
              },
              {
                subCode: 'b',
                text: 'Critically analyze the security and performance tradeoffs.',
                marks: 10,
                bloomLevel: 'L4',
                solution: 'Encryption overhead increases latency by ~12% but guarantees confidentiality...',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Advanced Design & Implementation',
    mainQuestions: [
      {
        questionNumber: 'Q2',
        choices: [
          {
            choiceId: 'Q2a',
            subQuestions: [
              {
                subCode: 'a',
                text: 'Design a scalable schema and describe the relational structure.',
                marks: 10,
                bloomLevel: 'L3',
                solution: 'Schema design requires 3NF normalization with foreign key constraints...',
              },
              {
                subCode: 'b',
                text: 'Discuss transaction management and ACID properties.',
                marks: 10,
                bloomLevel: 'L2',
                solution: 'Atomicity ensures all-or-nothing execution, Consistency enforces invariants...',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const PaperFormModal: React.FC<PaperFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPaper,
}) => {
  const { branches, schemes, semesters, subjects } = useAcademicStore();
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const solutionPdfInputRef = useRef<HTMLInputElement | null>(null);

  const [contentType, setContentType] = useState<PaperContentType>('DIGITAL_TYPED');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [branchCode, setBranchCode] = useState('CSE');
  const [schemeYear, setSchemeYear] = useState('2022');
  const [semester, setSemester] = useState<number>(5);
  const [subjectId, setSubjectId] = useState('');
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState('Jan/Feb');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [durationHours, setDurationHours] = useState<number>(3.0);
  const [paperType, setPaperType] = useState<PaperType>('SEE_THEORY');
  const [examCategory, setExamCategory] = useState<ExamCategory>('REGULAR');
  const [hasSolutionKey, setHasSolutionKey] = useState<boolean>(true);
  const [status, setStatus] = useState<PaperStatus>('PUBLISHED');
  const [uploadedBy, setUploadedBy] = useState('VTU Exam Cell');

  // PDF Upload specific fields
  const [fileUrl, setFileUrl] = useState('');
  const [solutionPdfUrl, setSolutionPdfUrl] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(2621440);
  const [pageCount, setPageCount] = useState<number>(4);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  // Interactive Typed Paper Data
  const [modulesData, setModulesData] = useState<PaperModule[]>(DEFAULT_MODULES);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Filtering subjects gracefully
  const matchedSubjects = subjects.filter(
    (s) =>
      s.branchCode === branchCode &&
      (s.schemeYear === schemeYear || s.schemeYear === '2022' || !s.schemeYear) &&
      (Number(s.semester) === Number(semester) || !s.semester)
  );

  const activeSubjectsList =
    matchedSubjects.length > 0
      ? matchedSubjects
      : subjects.filter((s) => s.branchCode === branchCode).length > 0
      ? subjects.filter((s) => s.branchCode === branchCode)
      : subjects;

  // Reset or Populate form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialPaper) {
      // PREFILL EDIT MODE
      setContentType(initialPaper.contentType || 'DIGITAL_TYPED');
      setTitle(initialPaper.title);
      setDescription(initialPaper.description || '');
      setBranchCode(initialPaper.branchCode || 'CSE');
      setSchemeYear(initialPaper.schemeYear || '2022');
      setSemester(initialPaper.semester || 5);
      setSubjectId(initialPaper.subjectId || '');
      setYear(initialPaper.year || 2025);
      setMonth(initialPaper.month || 'Jan/Feb');
      setMaxMarks(initialPaper.maxMarks || 100);
      setDurationHours(initialPaper.durationHours || 3.0);
      setPaperType(initialPaper.paperType || 'SEE_THEORY');
      setExamCategory(initialPaper.examCategory || 'REGULAR');
      setHasSolutionKey(initialPaper.hasSolutionKey ?? true);
      setStatus(initialPaper.status || 'PUBLISHED');
      setUploadedBy(initialPaper.uploadedBy || 'VTU Exam Cell');
      setFileUrl(initialPaper.fileUrl || '');
      setSolutionPdfUrl(initialPaper.solutionPdfUrl || '');
      setFileSize(initialPaper.fileSize || '2.5 MB');
      setFileSizeBytes(initialPaper.fileSizeBytes || 2621440);
      setPageCount(initialPaper.pageCount || 4);
      setSelectedFileName(initialPaper.fileUrl ? initialPaper.fileUrl.split('/').pop() || '' : '');
      if (initialPaper.modulesData && Array.isArray(initialPaper.modulesData) && initialPaper.modulesData.length > 0) {
        setModulesData(initialPaper.modulesData);
      } else {
        setModulesData(DEFAULT_MODULES);
      }
      setErrorMsg('');
    } else {
      // CLEAN NEW CREATION MODE
      setContentType('DIGITAL_TYPED');
      setTitle('');
      setDescription('');
      setBranchCode('CSE');
      setSchemeYear('2022');
      setSemester(5);
      setYear(2025);
      setMonth('Jan/Feb');
      setMaxMarks(100);
      setDurationHours(3.0);
      setPaperType('SEE_THEORY');
      setExamCategory('REGULAR');
      setHasSolutionKey(true);
      setStatus('PUBLISHED');
      setUploadedBy('VTU Exam Cell');
      setFileUrl('');
      setSolutionPdfUrl('');
      setFileSize('2.5 MB');
      setFileSizeBytes(2621440);
      setPageCount(4);
      setSelectedFileName('');
      setModulesData(DEFAULT_MODULES);
      setActiveModuleIndex(0);
      setErrorMsg('');

      if (activeSubjectsList.length > 0) {
        setSubjectId(activeSubjectsList[0].id);
      }
    }
  }, [isOpen, initialPaper]);

  useEffect(() => {
    if (activeSubjectsList.length > 0 && !activeSubjectsList.some((s) => s.id === subjectId)) {
      setSubjectId(activeSubjectsList[0].id);
    }
  }, [branchCode, schemeYear, semester]);

  if (!isOpen) return null;

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const bytes = file.size;
    setFileSizeBytes(bytes);
    const formattedSize =
      bytes > 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;
    setFileSize(formattedSize);
    setFileUrl(`s3://vtu-papers-prod/uploads/${file.name}`);

    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(`VTU ${subjectCode ? subjectCode + ' ' : ''}${cleanName}`);
    }
  };

  const handleSolutionPdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSolutionPdfUrl(`s3://vtu-papers-prod/solutions/${file.name}`);
    setHasSolutionKey(true);
  };

  const selectedSubject = activeSubjectsList.find((s) => s.id === subjectId) || activeSubjectsList[0];
  const subjectCode = selectedSubject ? selectedSubject.code : '21CS51';
  const subjectName = selectedSubject ? selectedSubject.name : 'Software Engineering & Project Management';

  // Sub-question helpers
  const updateSubQuestion = (modIdx: number, qIdx: number, choiceIdx: number, subIdx: number, field: keyof QuestionSubItem, val: any) => {
    const updated = [...modulesData];
    const sub = updated[modIdx].mainQuestions[qIdx].choices[choiceIdx].subQuestions[subIdx];
    (sub as any)[field] = val;
    setModulesData(updated);
  };

  const addSubQuestion = (modIdx: number, qIdx: number, choiceIdx: number) => {
    const updated = [...modulesData];
    const subs = updated[modIdx].mainQuestions[qIdx].choices[choiceIdx].subQuestions;
    const nextChar = String.fromCharCode(97 + subs.length);
    subs.push({
      subCode: nextChar,
      text: '',
      marks: 5,
      bloomLevel: 'L2',
      solution: '',
    });
    setModulesData(updated);
  };

  const removeSubQuestion = (modIdx: number, qIdx: number, choiceIdx: number, subIdx: number) => {
    const updated = [...modulesData];
    updated[modIdx].mainQuestions[qIdx].choices[choiceIdx].subQuestions.splice(subIdx, 1);
    setModulesData(updated);
  };

  const addModule = () => {
    const nextNum = modulesData.length + 1;
    if (nextNum > 5) return;
    setModulesData([
      ...modulesData,
      {
        moduleNumber: nextNum,
        title: `Module ${nextNum}: New Syllabus Topic`,
        mainQuestions: [
          {
            questionNumber: `Q${nextNum}`,
            choices: [
              {
                choiceId: `Q${nextNum}a`,
                subQuestions: [
                  { subCode: 'a', text: '', marks: 10, bloomLevel: 'L2', solution: '' },
                  { subCode: 'b', text: '', marks: 10, bloomLevel: 'L3', solution: '' },
                ],
              },
            ],
          },
        ],
      },
    ]);
    setActiveModuleIndex(modulesData.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Paper Title is required.');
      return;
    }

    if (contentType === 'PDF_UPLOAD' && !fileUrl) {
      setErrorMsg('Please select or upload a PDF document for this Question Paper.');
      return;
    }

    const payload = {
      title,
      description,
      contentType,
      branchCode,
      schemeYear,
      semester,
      subjectId: selectedSubject?.id,
      subjectCode,
      subjectName,
      year,
      month,
      maxMarks,
      durationHours,
      paperType,
      examCategory,
      hasSolutionKey,
      status,
      uploadedBy,
      fileUrl: fileUrl || `s3://vtu-papers-prod/${subjectCode}_${year}.pdf`,
      solutionPdfUrl,
      fileSize,
      fileSizeBytes,
      pageCount,
      modulesData: contentType === 'DIGITAL_TYPED' ? modulesData : null,
    };

    const res = await onSave(payload);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save Question Paper.');
    } else {
      onClose();
    }
  };

  // Convert Master Data to CustomDropdown Options
  const branchOptions: CustomDropdownOption[] = branches.map((b) => ({
    value: b.code,
    label: `${b.code} - ${b.name}`,
    badge: b.code,
  }));

  const schemeOptions: CustomDropdownOption[] = schemes.map((s) => ({
    value: s.year,
    label: s.title,
    badge: `${s.year} Scheme`,
  }));

  const semesterOptions: CustomDropdownOption[] = semesters.map((s) => ({
    value: s.semesterNumber,
    label: s.title,
    badge: `Sem ${s.semesterNumber}`,
  }));

  const subjectOptions: CustomDropdownOption[] = activeSubjectsList.map((s) => ({
    value: s.id,
    label: `${s.code} - ${s.name}`,
    sublabel: `${s.branchCode} • Sem ${s.semester}`,
    badge: s.code,
  }));

  const paperTypeOptions: CustomDropdownOption[] = [
    { value: 'SEE_THEORY', label: 'SEE Theory Exam', badge: 'SEE' },
    { value: 'IA_1', label: 'IA-1 Internal Test', badge: 'IA-1' },
    { value: 'IA_2', label: 'IA-2 Internal Test', badge: 'IA-2' },
    { value: 'IA_3', label: 'IA-3 Internal Test', badge: 'IA-3' },
    { value: 'LAB_EXAM', label: 'Lab Practical Exam', badge: 'LAB' },
  ];

  const examCategoryOptions: CustomDropdownOption[] = [
    { value: 'REGULAR', label: 'Regular Exam', badge: 'Regular' },
    { value: 'MAKEUP', label: 'Makeup / Fasttrack', badge: 'Makeup' },
    { value: 'MODEL', label: 'VTU Model Paper', badge: 'Model' },
  ];

  const bloomOptions: CustomDropdownOption[] = [
    { value: 'L1', label: 'L1 - Remember' },
    { value: 'L2', label: 'L2 - Understand' },
    { value: 'L3', label: 'L3 - Apply' },
    { value: 'L4', label: 'L4 - Analyze' },
    { value: 'L5', label: 'L5 - Evaluate' },
    { value: 'L6', label: 'L6 - Create' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 font-black">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">
                {initialPaper ? 'Edit Question Paper' : 'Create VTU Question Paper'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Provision interactive digital papers or upload scanned PDF question papers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Mode Switcher */}
          <div className="p-4 rounded-xl bg-accent/20 border border-border space-y-3">
            <label className="text-xs font-black uppercase text-muted-foreground block">Creation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContentType('DIGITAL_TYPED')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  contentType === 'DIGITAL_TYPED'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-500 shadow-md'
                    : 'bg-card border-border hover:border-accent text-muted-foreground'
                }`}
              >
                <Sparkles className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-foreground">Interactive Digital Builder</div>
                  <div className="text-[11px] opacity-80">Type 5 modules, questions, Bloom levels L1-L6, and solution key</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentType('PDF_UPLOAD')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  contentType === 'PDF_UPLOAD'
                    ? 'bg-purple-500/10 border-purple-500 text-purple-500 shadow-md'
                    : 'bg-card border-border hover:border-accent text-muted-foreground'
                }`}
              >
                <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-extrabold text-sm text-foreground">Scanned PDF Upload</div>
                  <div className="text-[11px] opacity-80">Upload scanned question paper PDF document and solution key file</div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic & Paper Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-purple-500" />
              1. Basic Paper Information & Academic Mapping
            </h3>

            {/* Custom Dropdowns for Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomDropdown
                label="Branch Code"
                options={branchOptions}
                value={branchCode}
                onChange={(val) => setBranchCode(val)}
              />

              <CustomDropdown
                label="Scheme Year"
                options={schemeOptions}
                value={schemeYear}
                onChange={(val) => setSchemeYear(val)}
              />

              <CustomDropdown
                label="Semester"
                options={semesterOptions}
                value={semester}
                onChange={(val) => setSemester(Number(val))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomDropdown
                label="Target Subject / Course"
                options={subjectOptions}
                value={subjectId}
                onChange={(val) => setSubjectId(val)}
                searchable={true}
                placeholder="Select Subject..."
              />

              <div className="grid grid-cols-2 gap-2">
                <CustomDropdown
                  label="Paper Type"
                  options={paperTypeOptions}
                  value={paperType}
                  onChange={(val) => setPaperType(val)}
                />

                <CustomDropdown
                  label="Exam Category"
                  options={examCategoryOptions}
                  value={examCategory}
                  onChange={(val) => setExamCategory(val)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-muted-foreground block mb-1">Paper Title</label>
              <input
                type="text"
                placeholder="e.g. VTU Semester End Examination - Jan/Feb 2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-foreground text-xs font-bold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Exam Meta: Month, Year, Max Marks, Duration */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-muted-foreground block mb-1">Exam Month</label>
                <input
                  type="text"
                  placeholder="Jan/Feb or July/Aug"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-muted-foreground block mb-1">Exam Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-muted-foreground block mb-1">Max Marks</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-muted-foreground block mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT MODE AREA */}
          {contentType === 'DIGITAL_TYPED' ? (
            /* Interactive Digital Paper Builder */
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-500" />
                  2. Interactive VTU 5-Module Question & Solution Builder
                </h3>
                {modulesData.length < 5 && (
                  <Button type="button" variant="outline" size="sm" onClick={addModule} className="text-xs gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add Module
                  </Button>
                )}
              </div>

              {/* Module Nav Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {modulesData.map((m, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                      activeModuleIndex === idx
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-accent/40 text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    <span>Module {m.moduleNumber}</span>
                  </button>
                ))}
              </div>

              {/* Active Module Question Builder Card */}
              {modulesData[activeModuleIndex] && (
                <div className="p-4 rounded-xl bg-card border border-border space-y-4 shadow-sm">
                  <div>
                    <label className="text-[11px] font-extrabold text-muted-foreground block mb-1">Module Title</label>
                    <input
                      type="text"
                      value={modulesData[activeModuleIndex].title}
                      onChange={(e) => {
                        const updated = [...modulesData];
                        updated[activeModuleIndex].title = e.target.value;
                        setModulesData(updated);
                      }}
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border text-foreground text-xs font-bold"
                    />
                  </div>

                  {modulesData[activeModuleIndex].mainQuestions.map((mainQ, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      {mainQ.choices.map((choice, choiceIdx) => (
                        <div key={choice.choiceId} className="p-3 rounded-xl bg-accent/20 border border-border/80 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="text-xs font-black text-purple-500">
                              {choice.isOrOption ? `OR Option: ${choice.choiceId}` : `Primary Question: ${choice.choiceId}`}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addSubQuestion(activeModuleIndex, qIdx, choiceIdx)}
                              className="text-[11px] h-7 gap-1"
                            >
                              <Plus className="h-3 w-3" /> Add Sub-Question
                            </Button>
                          </div>

                          {/* Sub-Questions list */}
                          {choice.subQuestions.map((sub, subIdx) => (
                            <div key={subIdx} className="p-3 rounded-lg bg-background border border-border space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-primary w-6">({sub.subCode})</span>
                                <input
                                  type="text"
                                  placeholder="Question statement / text..."
                                  value={sub.text}
                                  onChange={(e) => updateSubQuestion(activeModuleIndex, qIdx, choiceIdx, subIdx, 'text', e.target.value)}
                                  className="flex-1 h-8 px-2.5 rounded-md bg-accent/20 border border-border text-xs font-semibold"
                                />
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    placeholder="Marks"
                                    value={sub.marks}
                                    onChange={(e) => updateSubQuestion(activeModuleIndex, qIdx, choiceIdx, subIdx, 'marks', Number(e.target.value))}
                                    className="w-16 h-8 px-2 rounded-md bg-accent/20 border border-border text-xs font-bold text-center"
                                  />
                                  <span className="text-[10px] font-bold text-muted-foreground">M</span>
                                </div>

                                <div className="w-32">
                                  <CustomDropdown
                                    size="sm"
                                    options={bloomOptions}
                                    value={sub.bloomLevel || 'L2'}
                                    onChange={(val) => updateSubQuestion(activeModuleIndex, qIdx, choiceIdx, subIdx, 'bloomLevel', val)}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeSubQuestion(activeModuleIndex, qIdx, choiceIdx, subIdx)}
                                  className="p-1 text-muted-foreground hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Verified Faculty Solution input */}
                              <div>
                                <label className="text-[10px] font-bold text-emerald-500 block mb-0.5">Faculty Answer Key / Solution:</label>
                                <textarea
                                  rows={2}
                                  placeholder="Type step-by-step solution key or formula derivation..."
                                  value={sub.solution || ''}
                                  onChange={(e) => updateSubQuestion(activeModuleIndex, qIdx, choiceIdx, subIdx, 'solution', e.target.value)}
                                  className="w-full p-2 rounded-md bg-emerald-950/10 border border-emerald-500/20 text-foreground text-[11px] font-medium"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Scanned PDF Upload Mode */
            <div className="space-y-4 pt-2 border-t border-border">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-purple-500" />
                2. Upload Scanned Document Question Paper & Solution
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-border hover:border-purple-500/60 bg-accent/10 hover:bg-accent/20 cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <Upload className="h-8 w-8 text-purple-500" />
                  <div className="font-extrabold text-xs text-foreground">
                    {selectedFileName ? selectedFileName : 'Click to select Question Paper (PDF, Word, or Image)'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">PDF, Word (DOC/DOCX), PPT, or Image up to 25MB</div>
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePdfFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                </div>

                <div
                  onClick={() => solutionPdfInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-border hover:border-emerald-500/60 bg-accent/10 hover:bg-accent/20 cursor-pointer flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <div className="font-extrabold text-xs text-foreground">
                    {solutionPdfUrl ? 'Solution Attached' : 'Attach Solution Document (Optional)'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">PDF, Word, or Document solution key</div>
                  <input
                    type="file"
                    ref={solutionPdfInputRef}
                    onChange={handleSolutionPdfSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground block mb-1">Page Count</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-foreground text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-muted-foreground block mb-1">File Size String</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-foreground text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialPaper ? 'Save Changes' : 'Publish Question Paper'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
