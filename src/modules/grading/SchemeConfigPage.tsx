import React, { useState } from 'react';
import {
  Calculator,
  Award,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Percent,
  Calendar,
  Clock,
  Edit2,
  Save,
  AlertCircle,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Badge } from '../../shared/components/ui/Badge';
import { PageHeader } from '../../shared/components/ui/PageHeader';
import { ConfirmationModal } from '../../shared/components/ui/ConfirmationModal';

import { useCalculatorConfigStore } from '../../store/useCalculatorConfigStore';
import { useUserAdminStore } from '../../store/useUserAdminStore';
import { GradeRule } from '../../shared/types/calculator.types';

export const SchemeConfigPage: React.FC = () => {
  const { configs, updateSchemeConfig } = useCalculatorConfigStore();
  const { currentAdminRole, auditLogs } = useUserAdminStore();

  const [selectedSchemeYear, setSelectedSchemeYear] = useState('2022');
  const activeConfig = configs[selectedSchemeYear] || configs['2022'];

  // Form State
  const [effectiveDate, setEffectiveDate] = useState(activeConfig.effectiveDate);
  const [minAttendance, setMinAttendance] = useState(activeConfig.attendance.minimumAttendancePercentage);
  const [condonationAttendance, setCondonationAttendance] = useState(activeConfig.attendance.condonationAttendancePercentage);
  const [condonationFee, setCondonationFee] = useState(activeConfig.attendance.condonationFee);
  const [formula, setFormula] = useState(activeConfig.conversion.formulaExpression);
  const [formulaDesc, setFormulaDesc] = useState(activeConfig.conversion.description);

  // Grade Editing State
  const [gradeRules, setGradeRules] = useState<GradeRule[]>(activeConfig.grades);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation Modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Switch scheme handler
  const handleSelectScheme = (year: string) => {
    setSelectedSchemeYear(year);
    const target = configs[year];
    if (target) {
      setEffectiveDate(target.effectiveDate);
      setMinAttendance(target.attendance.minimumAttendancePercentage);
      setCondonationAttendance(target.attendance.condonationAttendancePercentage);
      setCondonationFee(target.attendance.condonationFee);
      setFormula(target.conversion.formulaExpression);
      setFormulaDesc(target.conversion.description);
      setGradeRules(target.grades);
      setSuccessMsg('');
      setErrorMsg('');
    }
  };

  // Grade Rule change handler
  const handleGradeChange = (index: number, field: keyof GradeRule, value: any) => {
    const next = [...gradeRules];
    next[index] = { ...next[index], [field]: value };
    setGradeRules(next);
  };

  const handleSaveRequest = () => {
    if (!effectiveDate) {
      setErrorMsg('Mandatory Effective Date is required.');
      return;
    }
    if (minAttendance <= condonationAttendance) {
      setErrorMsg('Minimum attendance (e.g. 75%) must be greater than medical condonation threshold (e.g. 65%).');
      return;
    }
    setErrorMsg('');
    setConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    const res = updateSchemeConfig(
      selectedSchemeYear,
      {
        grades: gradeRules,
        attendance: {
          minimumAttendancePercentage: Number(minAttendance),
          condonationAttendancePercentage: Number(condonationAttendance),
          condonationFee: Number(condonationFee),
          condonationDocRequired: true,
        },
        conversion: {
          formulaExpression: formula.trim(),
          description: formulaDesc.trim(),
        },
      },
      'Dr. K. V. Suresh (Exam Controller)',
      effectiveDate
    );

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to update calculator policy.');
    } else {
      setSuccessMsg(`Successfully updated ${selectedSchemeYear} Scheme Calculator Evaluation Policy with Effective Date ${effectiveDate}! Audit Log Entry Recorded.`);
      setConfirmModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Academic Calculator Governance & Evaluation Rules (ADMIN-FR-07)"
          description="Configure GPA letter grade points, attendance eligibility thresholds, CGPA conversion formulas, effective dates, and audit log history."
        />

        <div className="flex items-center gap-2">
          {['2025', '2022', '2021'].map((sch) => (
            <button
              key={sch}
              onClick={() => handleSelectScheme(sch)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedSchemeYear === sch
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {sch} Scheme Policy
            </button>
          ))}
        </div>
      </div>

      {/* Auditability & No Hard-Coding Banner */}
      <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 text-xs text-foreground flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
          <span>
            <strong className="text-primary">Dynamic Policy Architecture:</strong> Evaluation rules are dynamically broadcasted to student mobile app devices. Values are never hard-coded inside mobile UI components.
          </span>
        </div>
        <Badge variant="primary" className="text-[10px]">
          Dynamic API Sync Active
        </Badge>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Effective Date & Policy Header Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-foreground">{activeConfig.title}</h3>
            <Badge variant="success" className="text-[10px]">
              Active Scheme
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Last modified on {activeConfig.lastUpdated} by <strong className="text-foreground">{activeConfig.updatedBy}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
              Mandatory Effective Date *
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-foreground font-bold focus:ring-2 focus:ring-primary/40 outline-none"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveRequest}
            icon={<Save className="h-4 w-4" />}
            className="self-end"
          >
            Save Policy & Record Audit Log
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VTU Letter Grade Mappings Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>VTU Letter Grade Point Mappings ({selectedSchemeYear} Scheme)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-table-header-bg text-table-header-text">
                    <th className="p-3.5 font-extrabold rounded-tl-xl">Letter Grade</th>
                    <th className="p-3.5 font-extrabold">Grade Point</th>
                    <th className="p-3.5 font-extrabold">Min Marks (%)</th>
                    <th className="p-3.5 font-extrabold">Max Marks (%)</th>
                    <th className="p-3.5 font-extrabold rounded-tr-xl">Performance Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradeRules.map((g, idx) => (
                    <tr key={g.grade} className="hover:bg-accent/40 transition-colors">
                      <td className="p-3.5 font-black text-sm">
                        <span className={`px-2.5 py-1 rounded-md font-black text-xs ${g.color}`}>
                          {g.grade}
                        </span>
                      </td>

                      <td className="p-3.5 font-black text-foreground">
                        <input
                          type="number"
                          value={g.point}
                          onChange={(e) => handleGradeChange(idx, 'point', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-border bg-card text-foreground font-black text-xs"
                        />
                      </td>

                      <td className="p-3.5">
                        <input
                          type="number"
                          value={g.minPercentage}
                          onChange={(e) => handleGradeChange(idx, 'minPercentage', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-border bg-card text-foreground font-bold text-xs"
                        /> %
                      </td>

                      <td className="p-3.5">
                        <input
                          type="number"
                          value={g.maxPercentage}
                          onChange={(e) => handleGradeChange(idx, 'maxPercentage', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-border bg-card text-foreground font-bold text-xs"
                        /> %
                      </td>

                      <td className="p-3.5">
                        <input
                          type="text"
                          value={g.label}
                          onChange={(e) => handleGradeChange(idx, 'label', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-border bg-card text-foreground font-semibold text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rules & Conversion Formula Editor */}
        <div className="space-y-6">
          {/* Attendance Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-amber-500" />
                <span>Attendance Cutoff Eligibility Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-foreground">Minimum Mandatory Attendance (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minAttendance}
                  onChange={(e) => setMinAttendance(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-black text-sm"
                />
                <p className="text-[11px] text-muted-foreground">Students below this cutoff are flagged ineligible for SEE hall tickets.</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-foreground">Medical Condonation Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={condonationAttendance}
                  onChange={(e) => setCondonationAttendance(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-black text-sm"
                />
                <p className="text-[11px] text-muted-foreground">Requires medical certificate registration on VTU portal.</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-foreground">Condonation Fee (INR ₹)</label>
                <input
                  type="number"
                  value={condonationFee}
                  onChange={(e) => setCondonationFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-bold text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* CGPA to Percentage Conversion Rule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-purple-500" />
                <span>CGPA to Percentage Conversion Formula</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Formula Expression *</label>
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Formula Explanation</label>
                <textarea
                  rows={2}
                  value={formulaDesc}
                  onChange={(e) => setFormulaDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title={`Update ${selectedSchemeYear} Scheme Calculator Policy?`}
        message={`Are you sure you want to broadcast updated evaluation rules with Effective Date '${effectiveDate}'? An audit log entry will be permanently created.`}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </div>
  );
};
