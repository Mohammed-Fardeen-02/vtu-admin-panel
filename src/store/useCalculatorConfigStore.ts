import { create } from 'zustand';
import { SchemeCalculatorConfig, GradeRule } from '../shared/types/calculator.types';
import { useUserAdminStore } from './useUserAdminStore';

const INITIAL_SCHEME_CONFIGS: Record<string, SchemeCalculatorConfig> = {
  '2025': {
    schemeYear: '2025',
    title: '2025 NEP Curriculum Evaluation Policy',
    effectiveDate: '2026-09-01',
    lastUpdated: '2026-09-01',
    updatedBy: 'Dr. K. V. Suresh (Controller of Examinations)',
    conversion: {
      formulaExpression: '(CGPA - 0.75) * 10',
      description: 'VTU Official 2025 NEP CGPA to Percentage Conversion Rule: Percentage = (CGPA - 0.75) * 10',
    },
    credits: {
      theoryDefaultCredits: 4,
      labDefaultCredits: 1.5,
      integratedDefaultCredits: 4,
      electiveDefaultCredits: 3,
    },
    attendance: {
      minimumAttendancePercentage: 75.0,
      condonationAttendancePercentage: 65.0,
      condonationFee: 500,
      condonationDocRequired: true,
    },
    grades: [
      { grade: 'O', point: 10, minPercentage: 90, maxPercentage: 100, label: 'Outstanding', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'A+', point: 9, minPercentage: 80, maxPercentage: 89, label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'A', point: 8, minPercentage: 70, maxPercentage: 79, label: 'Very Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'B+', point: 7, minPercentage: 60, maxPercentage: 69, label: 'Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'B', point: 6, minPercentage: 55, maxPercentage: 59, label: 'Above Average', color: 'bg-sky-500/10 text-sky-600' },
      { grade: 'C', point: 5, minPercentage: 50, maxPercentage: 54, label: 'Average', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'P', point: 4, minPercentage: 40, maxPercentage: 49, label: 'Pass', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'F', point: 0, minPercentage: 0, maxPercentage: 39, label: 'Fail', color: 'bg-rose-500/10 text-rose-600' },
    ],
  },
  '2022': {
    schemeYear: '2022',
    title: '2022 NEP Choice Based Credit Scheme (CBCS)',
    effectiveDate: '2022-11-01',
    lastUpdated: '2026-08-15',
    updatedBy: 'Dr. K. V. Suresh',
    conversion: {
      formulaExpression: '(CGPA - 0.75) * 10',
      description: 'VTU Official CGPA to Percentage Conversion Rule: Percentage = (CGPA - 0.75) * 10',
    },
    credits: {
      theoryDefaultCredits: 4,
      labDefaultCredits: 1.5,
      integratedDefaultCredits: 4,
      electiveDefaultCredits: 3,
    },
    attendance: {
      minimumAttendancePercentage: 75.0,
      condonationAttendancePercentage: 65.0,
      condonationFee: 500,
      condonationDocRequired: true,
    },
    grades: [
      { grade: 'O', point: 10, minPercentage: 90, maxPercentage: 100, label: 'Outstanding', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'A+', point: 9, minPercentage: 80, maxPercentage: 89, label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'A', point: 8, minPercentage: 70, maxPercentage: 79, label: 'Very Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'B+', point: 7, minPercentage: 60, maxPercentage: 69, label: 'Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'B', point: 6, minPercentage: 55, maxPercentage: 59, label: 'Above Average', color: 'bg-sky-500/10 text-sky-600' },
      { grade: 'C', point: 5, minPercentage: 50, maxPercentage: 54, label: 'Average', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'P', point: 4, minPercentage: 40, maxPercentage: 49, label: 'Pass', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'F', point: 0, minPercentage: 0, maxPercentage: 39, label: 'Fail', color: 'bg-rose-500/10 text-rose-600' },
    ],
  },
  '2021': {
    schemeYear: '2021',
    title: '2021 Outcome Based Education Scheme',
    effectiveDate: '2021-10-01',
    lastUpdated: '2026-05-10',
    updatedBy: 'VTU Exam Cell',
    conversion: {
      formulaExpression: '(CGPA - 0.75) * 10',
      description: 'VTU 2021 Scheme Formula: Percentage = (CGPA - 0.75) * 10',
    },
    credits: {
      theoryDefaultCredits: 4,
      labDefaultCredits: 2,
      integratedDefaultCredits: 4,
      electiveDefaultCredits: 3,
    },
    attendance: {
      minimumAttendancePercentage: 75.0,
      condonationAttendancePercentage: 65.0,
      condonationFee: 500,
      condonationDocRequired: true,
    },
    grades: [
      { grade: 'S+', point: 10, minPercentage: 90, maxPercentage: 100, label: 'Outstanding', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'S', point: 9, minPercentage: 80, maxPercentage: 89, label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600' },
      { grade: 'A', point: 8, minPercentage: 70, maxPercentage: 79, label: 'Very Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'B', point: 7, minPercentage: 60, maxPercentage: 69, label: 'Good', color: 'bg-blue-500/10 text-blue-600' },
      { grade: 'C', point: 6, minPercentage: 50, maxPercentage: 59, label: 'Above Average', color: 'bg-sky-500/10 text-sky-600' },
      { grade: 'D', point: 5, minPercentage: 45, maxPercentage: 49, label: 'Average', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'E', point: 4, minPercentage: 40, maxPercentage: 44, label: 'Pass', color: 'bg-amber-500/10 text-amber-600' },
      { grade: 'F', point: 0, minPercentage: 0, maxPercentage: 39, label: 'Fail', color: 'bg-rose-500/10 text-rose-600' },
    ],
  },
};

interface CalculatorConfigStore {
  configs: Record<string, SchemeCalculatorConfig>;
  updateSchemeConfig: (
    schemeYear: string,
    updates: Partial<SchemeCalculatorConfig>,
    adminName: string,
    effectiveDate: string
  ) => { success: boolean; error?: string };
}

export const useCalculatorConfigStore = create<CalculatorConfigStore>((set, get) => ({
  configs: INITIAL_SCHEME_CONFIGS,

  updateSchemeConfig: (schemeYear, updates, adminName, effectiveDate) => {
    const { configs } = get();
    const current = configs[schemeYear];
    if (!current) return { success: false, error: `Scheme configuration '${schemeYear}' not found.` };

    // Validate Effective Date
    if (!effectiveDate) {
      return { success: false, error: 'Mandatory Effective Date is required.' };
    }

    const updatedConfig: SchemeCalculatorConfig = {
      ...current,
      ...updates,
      effectiveDate,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: adminName,
    };

    set((state) => ({
      configs: {
        ...state.configs,
        [schemeYear]: updatedConfig,
      },
    }));

    // Audit Log Entry
    useUserAdminStore.getState().addAuditLog({
      adminName,
      adminRole: useUserAdminStore.getState().currentAdminRole,
      actionType: 'CALCULATOR_RULE_CHANGE',
      targetEntityId: schemeYear,
      targetEntityName: `${schemeYear} Evaluation Policy`,
      details: `Updated ${schemeYear} GPA/Credit/Attendance rules with Effective Date: ${effectiveDate}. Formula: ${updatedConfig.conversion.formulaExpression}`,
      ipAddress: '14.139.155.2',
    });

    return { success: true };
  },
}));
