"use client";

import { Step2FinancialInfoProps } from "../../types/step2/financial.types";
import {
  useLoanManager,
  useFixedObligationManager,
  useCreditCardManager,
} from "../../hooks";
import { StepHeader } from "./step-header.component";
import { IncomeSection } from "./income-section.component";
import { SipenSection } from "./sipen-section.component";
import { AfpSection } from "./afp-section.component";
import { FixedObligationsSection } from "./fixed-obligations-section.component";
import { CreditCardsSection } from "./credit-cards-section.component";
import { LoansSection } from "./loans-section.component";

export function Step2FinancialInfo({
  profileType,
  data,
  onUpdate,
  onAddFixedObligation,
  onUpdateFixedObligation,
  onRemoveFixedObligation,
  onAddCreditCard,
  onUpdateCreditCard,
  onRemoveCreditCard,
  onAddLoan,
  onUpdateLoan,
  onRemoveLoan,
}: Step2FinancialInfoProps) {
  const loanManager = useLoanManager();
  const obligationManager = useFixedObligationManager();
  const creditCardManager = useCreditCardManager();

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

        <FixedObligationsSection
          data={data}
          showForm={obligationManager.showForm}
          editingItem={obligationManager.editingItem}
          onToggle={(checked) => {
            if (!checked) {
              onUpdate({ fixedObligations: [] });
            } else if (data.fixedObligations.length === 0) {
              obligationManager.handleAdd();
            }
          }}
          onEdit={obligationManager.handleEdit}
          onDelete={onRemoveFixedObligation}
          onAdd={obligationManager.handleAdd}
          onSave={(item) =>
            obligationManager.handleSave(
              item,
              onAddFixedObligation,
              onUpdateFixedObligation
            )
          }
          onCancel={obligationManager.handleCancel}
        />

        <CreditCardsSection
          data={data}
          showForm={creditCardManager.showForm}
          editingItem={creditCardManager.editingItem}
          onToggle={(checked) => {
            if (!checked) {
              onUpdate({ creditCards: [] });
            } else if (data.creditCards.length === 0) {
              creditCardManager.handleAdd();
            }
          }}
          onEdit={creditCardManager.handleEdit}
          onDelete={onRemoveCreditCard}
          onAdd={creditCardManager.handleAdd}
          onSave={(item) =>
            creditCardManager.handleSave(item, onAddCreditCard, onUpdateCreditCard)
          }
          onCancel={creditCardManager.handleCancel}
        />

        <LoansSection
          data={data}
          showForm={loanManager.showLoanForm}
          editingItem={loanManager.editingLoan}
          onToggle={(checked) => {
            if (!checked) {
              onUpdate({ loans: [] });
            } else if (data.loans.length === 0) {
              loanManager.handleAdd();
            }
          }}
          onEdit={loanManager.handleEdit}
          onDelete={onRemoveLoan}
          onAdd={loanManager.handleAdd}
          onSave={(loan) =>
            loanManager.handleSave(loan, onAddLoan, onUpdateLoan)
          }
          onCancel={loanManager.handleCancel}
        />
      </div>
    </div>
  );
}
