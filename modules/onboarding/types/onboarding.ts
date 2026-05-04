export type ProfileType = 'employee' | 'freelancer' | 'business_owner';

export interface Loan {
  id: string;
  loanType: 'personal' | 'mortgage' | 'vehicle' | 'business' | 'credit_card';
  lenderName: string;
  originalAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  startDate: string;
}

export interface HealthInsurance {
  id: string;
  arsName: string;
  planType: string;
  monthlyPremium: number;
}

export interface OnboardingData {
  // Step 1
  profileType: ProfileType | null;
  
  // Step 2 - Employee
  monthlySalary?: number;
  employerName?: string;
  contributesSipen?: boolean;
  
  // Step 2 - Freelancer
  averageMonthlyIncome?: number;
  professionSector?: string;
  
  // Step 2 - Business Owner
  businessMonthlyRevenue?: number;
  businessName?: string;
  businessType?: string;
  employeeCount?: number;
  businessRnc?: string;
  
  // Step 2 - Shared (multiple entries)
  healthInsurances: HealthInsurance[];
  loans: Loan[];
  
  // Step 3
  gmailConnected: boolean;
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  profileType: null,
  healthInsurances: [],
  loans: [],
  gmailConnected: false,
};
