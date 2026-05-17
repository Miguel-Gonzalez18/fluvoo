import { OnboardingData, ProfileType, Loan } from "../../types/onboarding";

export interface Step2FinancialInfoProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
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
