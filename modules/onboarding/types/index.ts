export type {
  ProfileType,
  OnboardingData,
  Loan,
  HealthInsurance
} from './onboarding';
export { INITIAL_ONBOARDING_DATA } from './onboarding';

// Step 1 - Profile Selection
export type { Step1ProfileSelectionProps, ProfileCardProps } from './step1/profile.types';

// Step 2 - Financial Info
export type {
  Step2FinancialInfoProps,
  IncomeSectionProps,
  SipenSectionProps,
  AfpSectionProps,
  LoansSectionProps
} from './step2/financial.types';

// Step 3 - Gmail Connect
export type { Step3GmailConnectProps } from './step3/gmail.types';

// Tax Summary
export type {
  TaxSummaryCardProps,
  TaxCalculationData,
  TaxRowProps,
  TaxToggleProps,
  PeriodTabsProps
} from './tax/summary.types';
export type {
  EmployeeTaxSectionProps,
  PeriodConfig,
  PeriodType
} from './tax/employee.types';
export type {
  FreelancerTaxSectionProps,
  FreelancerState,
  FreelancerCalculationResult
} from './tax/freelancer.types';
export type {
  BusinessTaxSectionProps,
  BusinessCalculationResult
} from './tax/business.types';
