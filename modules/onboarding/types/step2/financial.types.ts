import {
  CreditCard,
  FixedObligation,
  Loan,
  OnboardingData,
  ProfileType,
} from "../onboarding";

export interface Step2FinancialInfoProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onAddFixedObligation: (item: FixedObligation) => void;
  onUpdateFixedObligation: (item: FixedObligation) => void;
  onRemoveFixedObligation: (id: string) => void;
  onAddCreditCard: (item: CreditCard) => void;
  onUpdateCreditCard: (item: CreditCard) => void;
  onRemoveCreditCard: (id: string) => void;
  onAddLoan: (loan: Loan) => void;
  onUpdateLoan: (loan: Loan) => void;
  onRemoveLoan: (id: string) => void;
}

export interface IncomeSectionProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export interface SipenSectionProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export interface AfpSectionProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export interface FixedObligationsSectionProps {
  data: OnboardingData;
  showForm: boolean;
  editingItem: FixedObligation | null;
  onToggle: (checked: boolean) => void;
  onEdit: (item: FixedObligation) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSave: (item: FixedObligation) => void;
  onCancel: () => void;
}

export interface CreditCardsSectionProps {
  data: OnboardingData;
  showForm: boolean;
  editingItem: CreditCard | null;
  onToggle: (checked: boolean) => void;
  onEdit: (item: CreditCard) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSave: (item: CreditCard) => void;
  onCancel: () => void;
}

export interface LoansSectionProps {
  data: OnboardingData;
  showForm: boolean;
  editingItem: Loan | null;
  onToggle: (checked: boolean) => void;
  onEdit: (item: Loan) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSave: (item: Loan) => void;
  onCancel: () => void;
}
