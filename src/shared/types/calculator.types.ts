export interface GradeRule {
  grade: string; // e.g. 'O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'
  point: number; // e.g. 10, 9, 8, 7, 6, 5, 4, 0
  minPercentage: number; // e.g. 90
  maxPercentage: number; // e.g. 100
  label: string; // e.g. 'Outstanding'
  color: string;
}

export interface CreditDefaultConfig {
  theoryDefaultCredits: number;
  labDefaultCredits: number;
  integratedDefaultCredits: number;
  electiveDefaultCredits: number;
}

export interface AttendanceRuleConfig {
  minimumAttendancePercentage: number; // Default 75
  condonationAttendancePercentage: number; // Default 65
  condonationFee: number; // e.g. 500 INR
  condonationDocRequired: boolean;
}

export interface PercentageConversionRule {
  formulaExpression: string; // e.g. "(CGPA - 0.75) * 10"
  description: string;
}

export interface SchemeCalculatorConfig {
  schemeYear: string; // '2021', '2022', '2025'
  title: string;
  effectiveDate: string; // e.g. '2026-09-01'
  grades: GradeRule[];
  credits: CreditDefaultConfig;
  attendance: AttendanceRuleConfig;
  conversion: PercentageConversionRule;
  lastUpdated: string;
  updatedBy: string;
}
