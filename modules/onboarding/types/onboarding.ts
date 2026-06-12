export type ProfileType = 'employee' | 'freelancer' | 'business_owner';

export type LoanType = 'personal' | 'mortgage' | 'vehicle' | 'business';

export interface Loan {
  id: string;
  loanType: LoanType;
  lenderName: string;
  originalAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  paymentDueDay: number;
  startDate: string;
  endDate: string;
}

export type ObligationType =
  | 'rent'
  | 'electricity'
  | 'water'
  | 'gas'
  | 'internet'
  | 'transport'
  | 'insurance'
  | 'gym'
  | 'university'
  | 'other';

export type ObligationPaymentFrequency =
  | 'monthly'
  | 'weekly'
  | 'biweekly'
  | 'daily';

export interface FixedObligation {
  id: string;
  obligationType: ObligationType;
  name: string;
  providerName?: string;
  paymentAmount: number;
  paymentFrequency: ObligationPaymentFrequency;
  monthlyAmount: number;
  paymentDueDay: number;
}

export type CreditCardCurrencyMode = 'dop_only' | 'usd_only' | 'mixed';

export interface CreditCardInstallment {
  id: string;
  creditCardId?: string;
  description?: string;
  originalAmount: number;
  amountOwed: number;
  monthlyPayment: number;
  termMonths: number;
  annualRate: number;
  statementCloseDay: number;
  paymentDueDay: number;
  startDate?: string;
  endDate?: string;
}

export interface CreditCard {
  id: string;
  issuerName: string;
  cardLabel: string;
  currencyMode: CreditCardCurrencyMode;
  creditLimit: number;
  currentBalance: number;
  minimumPayment: number;
  statementBalance: number;
  creditLimitUsd?: number | null;
  currentBalanceUsd?: number | null;
  minimumPaymentUsd?: number | null;
  statementBalanceUsd: number;
  statementCloseDay: number;
  paymentDueDay: number;
  annualRate?: number | null;
  installments: CreditCardInstallment[];
}

export interface HealthInsurance {
  id: string;
  arsName: string;
  planType: string;
  monthlyPremium: number;
}

export interface OnboardingData {
  profileType: ProfileType | null;
  monthlySalary?: number;
  employerName?: string;
  contributesSipen?: boolean;
  contributesAfp?: boolean;
  averageMonthlyIncome?: number;
  professionSector?: string;
  businessMonthlyRevenue?: number;
  businessName?: string;
  businessType?: string;
  employeeCount?: number;
  businessRnc?: string;
  healthInsurances: HealthInsurance[];
  fixedObligations: FixedObligation[];
  creditCards: CreditCard[];
  loans: Loan[];
  gmailConnected: boolean;
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  profileType: null,
  healthInsurances: [],
  fixedObligations: [],
  creditCards: [],
  loans: [],
  gmailConnected: false,
};
