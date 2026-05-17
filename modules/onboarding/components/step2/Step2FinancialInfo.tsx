"use client";

import { Step2FinancialInfoProps } from "../../types/step2/financial.types";
import { useLoanManager } from "../../hooks";
import { StepHeader } from "./step-header.component";
import { IncomeSection } from "./income-section.component";
import { SipenSection } from "./sipen-section.component";
import { AfpSection } from "./afp-section.component";
import { LoansSection } from "./loans-section.component";

export function Step2FinancialInfo({
  profileType,
  data,
  onUpdate,
  onAddLoan,
  onUpdateLoan,
  onRemoveLoan,
}: Step2FinancialInfoProps) {
  const {
    showLoanForm,
    editingLoan,
    handleEdit,
    handleAdd,
    handleCancel,
    handleSave,
  } = useLoanManager();

  const handleLoanSave = (loan: import("../../types/onboarding").Loan) => {
    handleSave(loan, onAddLoan, onUpdateLoan);
  };

  const handleToggleLoans = (checked: boolean) => {
    if (!checked) {
      onUpdate({ loans: [] });
    } else if (data.loans.length === 0) {
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader />

      <div className="space-y-6">
        <IncomeSection profileType={profileType} data={data} onUpdate={onUpdate} />

        {profileType === "employee" && (
          <>
            <SipenSection data={data} onUpdate={onUpdate} />
            <AfpSection data={data} onUpdate={onUpdate} />
          </>
        )}

        <LoansSection
          data={data}
          showForm={showLoanForm}
          editingItem={editingLoan}
          onToggle={handleToggleLoans}
          onEdit={handleEdit}
          onDelete={onRemoveLoan}
          onAdd={handleAdd}
          onSave={handleLoanSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
