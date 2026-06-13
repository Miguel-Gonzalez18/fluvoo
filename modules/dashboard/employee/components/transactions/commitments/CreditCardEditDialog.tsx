"use client";

import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { updateCreditCard } from "@/modules/dashboard/employee/actions/credit-card-obligations-actions";
import { CreditCardForm } from "@/modules/onboarding/components/forms/CreditCardForm";
import type { CreditCard } from "@/modules/onboarding/types/onboarding";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui";

interface CreditCardEditDialogProps {
  card: CreditCardCommitmentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function commitmentToCreditCard(card: CreditCardCommitmentItem): CreditCard {
  return {
    id: card.id,
    issuerName: card.issuerName,
    cardLabel: card.alias,
    currencyMode: card.currencyMode,
    creditLimit: card.creditLimitDop,
    currentBalance: card.revolvingBalanceDop,
    minimumPayment: card.minimumPaymentDop,
    statementBalance: card.statementBalanceDop,
    creditLimitUsd: card.creditLimitUsd,
    currentBalanceUsd: card.revolvingBalanceUsd,
    minimumPaymentUsd: card.minimumPaymentUsd,
    statementBalanceUsd: card.statementBalanceUsd,
    nextStatementCloseDate: card.nextStatementCloseDate,
    nextPaymentDueDate: card.nextPaymentDueDate,
    annualRate: card.annualRate,
    installments: card.installments.map((item) => ({
      id: item.id,
      creditCardId: card.id,
      description: item.description,
      originalAmount: item.originalAmount,
      amountOwed: item.amountOwed,
      monthlyPayment: item.monthlyPayment,
      termMonths: item.termMonths,
      annualRate: item.annualRate,
      startDate: item.startDate ?? undefined,
      endDate: item.endDate ?? undefined,
    })),
  };
}

export function CreditCardEditDialog({
  card,
  open,
  onOpenChange,
}: CreditCardEditDialogProps) {
  const router = useRouter();

  const handleSave = (data: CreditCard) => {
    sileo.promise(
      async () => {
        const result = await updateCreditCard(card.id, data as unknown as Record<string, unknown>);
        if (!result.success) {
          throw new Error(result.error ?? "No se pudo guardar la tarjeta");
        }
        onOpenChange(false);
        router.refresh();
      },
      {
        loading: { title: "Guardando cambios..." },
        success: { title: "Tarjeta actualizada" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "No se pudo guardar la tarjeta",
        }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarjeta</DialogTitle>
        </DialogHeader>
        <CreditCardForm
          key={card.id}
          initialData={commitmentToCreditCard(card)}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
