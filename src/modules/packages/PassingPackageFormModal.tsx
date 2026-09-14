import React, { useState, useEffect } from 'react';
import { X, BookOpen, Plus, Trash2, ShieldAlert, CheckCircle2, Layers, AlertCircle, IndianRupee } from 'lucide-react';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { PassingPackage, PassingQuestion, QuestionPriority, PremiumTier } from '../../shared/types/package.types';
import { usePackageStore, containsGuaranteedClaim } from '../../store/usePackageStore';
import { useAcademicStore } from '../../store/useAcademicStore';

interface PassingPackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PassingPackage | null;
}

export const PassingPackageFormModal: React.FC<PassingPackageFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { createPackage, updatePackage } = usePackageStore();
  const { branches, schemes } = useAcademicStore();

  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [schemeYear, setSchemeYear] = useState('2021');
  const [branchCode, setBranchCode] = useState('CSE');
  const [semester, setSemester] = useState<number>(3);
  const [lastMinuteRevisionSummary, setLastMinuteRevisionSummary] = useState('');
  const [oneNightBeforeNotes, setOneNightBeforeNotes] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [tier, setTier] = useState<PremiumTier>('FREE');
  const [priceINR, setPriceINR] = useState(0);
  const [questions, setQuestions] = useState<PassingQuestion[]>([]);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Question editing form state inside modal
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qUnitNum, setQUnitNum] = useState(1);
  const [qUnitName, setQUnitName] = useState('Unit 1: Core Concepts');
  const [qCategory, setQCategory] = useState<PassingQuestion['category']>('IMPORTANT');
  const [qMarks, setQMarks] = useState(10);
  const [qPriority, setQPriority] = useState<QuestionPriority>('HIGH');
  const [qFrequency, setQFrequency] = useState('Asked 4 times in VTU main exams');
  const [qDiagram, setQDiagram] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubjectCode(initialData.subjectCode);
      setSubjectName(initialData.subjectName);
      setSchemeYear(initialData.schemeYear);
      setBranchCode(initialData.branchCode);
      setSemester(initialData.semester);
      setLastMinuteRevisionSummary(initialData.lastMinuteRevisionSummary);
      setOneNightBeforeNotes(initialData.oneNightBeforeNotes);
      setIsPremium(initialData.isPremium);
      setTier(initialData.tier);
      setPriceINR(initialData.priceINR);
      setQuestions(initialData.questions || []);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setSubjectCode('');
      setSubjectName('');
      setSchemeYear('2021');
      setBranchCode('CSE');
      setSemester(3);
      setLastMinuteRevisionSummary('');
      setOneNightBeforeNotes('');
      setIsPremium(false);
      setTier('FREE');
      setPriceINR(0);
      setQuestions([]);
      setStatus('PUBLISHED');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const hasGuaranteedClaim =
    containsGuaranteedClaim(title) ||
    containsGuaranteedClaim(lastMinuteRevisionSummary) ||
    containsGuaranteedClaim(oneNightBeforeNotes);

  const handleAddQuestion = () => {
    if (!qText.trim()) return;

    const newQ: PassingQuestion = {
      id: `q-${Date.now()}`,
      questionText: qText,
      answerSummary: qAnswer,
      unitNumber: qUnitNum,
      unitName: qUnitName,
      category: qCategory,
      weightageMarks: qMarks,
      priority: qPriority,
      frequencyText: qFrequency,
      order: questions.length + 1,
      diagramRequired: qDiagram,
    };

    setQuestions([...questions, newQ]);
    setQText('');
    setQAnswer('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!subjectCode.trim()) errs.subjectCode = 'Subject Code is required (e.g. 21MAT31)';
    if (!subjectName.trim()) errs.subjectName = 'Subject Name is required';
    if (questions.length === 0) errs.questions = 'At least 1 question must be added';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title,
      subjectCode: subjectCode.toUpperCase(),
      subjectName,
      schemeYear,
      branchCode,
      semester,
      unitsCount: new Set(questions.map((q) => q.unitNumber)).size || 1,
      questionsCount: questions.length,
      lastMinuteRevisionSummary,
      oneNightBeforeNotes,
      questions,
      status,
      isPremium,
      tier,
      priceINR,
      author: 'VTU Academic Board',
    };

    if (initialData) {
      updatePackage(initialData.id, payload);
    } else {
      createPackage(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-accent/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">
                {initialData ? 'Edit VTU Passing Package' : 'Create High-Yield Passing Package'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Assemble unit-wise important questions, last-minute revision notes, and exam frequency metadata.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Policy Alert Warning */}
          {hasGuaranteedClaim && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs">
              <ShieldAlert className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 block">
                  VTU Content Policy Warning
                </span>
                <p className="text-muted-foreground mt-0.5">
                  Claims containing "100% guaranteed questions" or "100% pass guarantee" are prohibited. Our automated policy engine will convert them to "High Probability Expected Questions" upon save.
                </p>
              </div>
            </div>
          )}

          {/* Package Title */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Package Display Title <span className="text-rose-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 21MAT31 Engineering Mathematics III - Passing Package & High Yield Guide"
              error={errors.title}
            />
          </div>

          {/* Subject & Hierarchy Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">Subject Code *</label>
              <Input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="21MAT31"
                error={errors.subjectCode}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-foreground mb-1">Subject Full Title *</label>
              <Input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Transform Calculus, Fourier Series & Numerical Techniques"
                error={errors.subjectName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Scheme</label>
              <select
                value={schemeYear}
                onChange={(e) => setSchemeYear(e.target.value)}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {schemes.map((s) => (
                  <option key={s.id} value={s.year}>
                    Scheme {s.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Branch</label>
              <select
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">Target Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monetization Tier */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-foreground flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-emerald-500" /> Premium Access & Monetization Tier
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                Require Premium Pass
              </label>
            </div>

            {isPremium && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">Pass Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as PremiumTier)}
                    className="w-full h-9 px-2 rounded-lg border border-border bg-background text-xs"
                  >
                    <option value="SILVER">Silver Pass Tier</option>
                    <option value="GOLD_PASS">Gold Pass Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">Price (INR)</label>
                  <Input
                    type="number"
                    value={priceINR}
                    onChange={(e) => setPriceINR(parseFloat(e.target.value))}
                    placeholder="49"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Last-Minute Revision Summary</label>
              <textarea
                rows={2}
                value={lastMinuteRevisionSummary}
                onChange={(e) => setLastMinuteRevisionSummary(e.target.value)}
                placeholder="High-yield concepts to review 2 hours before exam..."
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">1-Night-Before-Exam Notes</label>
              <textarea
                rows={2}
                value={oneNightBeforeNotes}
                onChange={(e) => setOneNightBeforeNotes(e.target.value)}
                placeholder="Essential formulas, theorem proofs, and standard diagrams..."
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Questions Builder Section */}
          <div className="p-4 rounded-xl border border-border bg-accent/20 space-y-3">
            <h4 className="text-xs font-black text-foreground flex items-center justify-between">
              <span>Unit-wise Questions ({questions.length})</span>
              {errors.questions && <span className="text-rose-500 font-bold">{errors.questions}</span>}
            </h4>

            {/* List of existing questions */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-xl border border-border bg-background flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                        Unit {q.unitNumber} ({q.weightageMarks}M)
                      </span>
                      <span className="font-extrabold text-foreground">{q.category}</span>
                      <span className="text-[10px] text-muted-foreground">{q.frequencyText}</span>
                    </div>
                    <p className="font-bold text-foreground">{idx + 1}. {q.questionText}</p>
                    <p className="text-muted-foreground text-[11px]">{q.answerSummary}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Question Row */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <Input
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Question text..."
                  className="sm:col-span-2"
                />
                <Input
                  value={qAnswer}
                  onChange={(e) => setQAnswer(e.target.value)}
                  placeholder="Short answer summary..."
                  className="sm:col-span-2"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <select
                  value={qUnitNum}
                  onChange={(e) => setQUnitNum(parseInt(e.target.value, 10))}
                  className="h-8 px-2 rounded-lg border border-border bg-background text-xs"
                >
                  <option value={1}>Unit 1</option>
                  <option value={2}>Unit 2</option>
                  <option value={3}>Unit 3</option>
                  <option value={4}>Unit 4</option>
                  <option value={5}>Unit 5</option>
                </select>

                <select
                  value={qCategory}
                  onChange={(e) => setQCategory(e.target.value as any)}
                  className="h-8 px-2 rounded-lg border border-border bg-background text-xs"
                >
                  <option value="IMPORTANT">Important</option>
                  <option value="REPEATED">Repeated</option>
                  <option value="MOST_EXPECTED">Most Expected</option>
                  <option value="LAST_MINUTE_REVISION">Last Minute</option>
                  <option value="ONE_NIGHT_BEFORE">1-Night Before</option>
                </select>

                <Input
                  type="number"
                  value={qMarks}
                  onChange={(e) => setQMarks(parseInt(e.target.value, 10))}
                  placeholder="Marks (10)"
                  className="h-8 text-xs"
                />

                <Input
                  value={qFrequency}
                  onChange={(e) => setQFrequency(e.target.value)}
                  placeholder="Frequency metadata..."
                  className="h-8 text-xs sm:col-span-2"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                icon={<Plus className="h-3.5 w-3.5" />}
                className="w-full"
              >
                Add Question to Package
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? 'Update Package' : 'Save & Publish Package'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
