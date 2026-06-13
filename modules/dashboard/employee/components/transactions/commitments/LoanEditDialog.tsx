"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { updateLoan } from "@/modules/dashboard/employee/actions/loan-obligations-actions";
import { LoanAmortizationUpload } from "@/modules/dashboard/employee/components/transactions/commitments/LoanAmortizationUpload";
import { LoanForm } from "@/modules/onboarding/components/forms/LoanForm";
import type { Loan } from "@/modules/onboarding/types/onboarding";
import type { LoanCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";
import type { ParsedLoanDocumentFields } from "@/modules/dashboard/employee/lib/obligations/parse-loan-document-text";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui";

interface LoanEditDialogProps {
  loan: LoanCommitmentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function commitmentToLoan(loan: LoanCommitmentItem): Loan {
  return {
    id: loan.id,
    loanAlias: loan.label,
    loanType: loan.loanType,
    lenderName: loan.lenderName ?? "",
    originalAmount: loan.originalAmount,
    annualRate: loan.annualRate,
    termMonths: loan.termMonths,
    monthlyPayment: loan.amount,
    paymentDueDay: loan.dueStatus.dueDay,
    startDate: loan.startDate ?? "",
    endDate: loan.endDate ?? "",
    currentBalance: loan.currentBalance ?? loan.originalAmount,
  };
}

function mergeParsedFields(
  base: Loan,
  parsed: ParsedLoanDocumentFields
): Loan {
  return {
    ...base,
    loanAlias: parsed.loanAlias ?? base.loanAlias,
    originalAmount: parsed.originalAmount ?? base.originalAmount,
    currentBalance: parsed.currentBalance ?? base.currentBalance,
    annualRate: parsed.annualRate ?? base.annualRate,
    termMonths: parsed.termMonths ?? base.termMonths,
    monthlyPayment: parsed.monthlyPayment ?? base.monthlyPayment,
    paymentDueDay: parsed.paymentDueDay ?? base.paymentDueDay,
    startDate: parsed.startDate ?? base.startDate,
  };
}

export function LoanEditDialog({
  loan,
  open,
  onOpenChange,
}: LoanEditDialogProps) {
  const router = useRouter();
  const baseLoan = useMemo(() => commitmentToLoan(loan), [loan]);
  const [formSeed, setFormSeed] = useState(0);
  const [formData, setFormData] = useState<Loan>(baseLoan);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setFormData(baseLoan);
      setFormSeed((value) => value + 1);
    }
    onOpenChange(nextOpen);
  };

  const handlePdfApply = (parsed: ParsedLoanDocumentFields) => {
    setFormData((prev) => mergeParsedFields(prev, parsed));
    setFormSeed((value) => value + 1);
  };

  const handleSave = (data: Loan) => {
    sileo.promise(
      async () => {
        const result = await updateLoan(loan.id, data as unknown as Record<string, unknown>);
        if (!result.success) {
          throw new Error(result.error ?? "No se pudo guardar el préstamo");
        }
        onOpenChange(false);
        router.refresh();
      },
      {
        loading: { title: "Guardando cambios..." },
        success: { title: "Préstamo actualizado" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "No se pudo guardar el préstamo",
        }),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar préstamo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <LoanAmortizationUpload onApply={handlePdfApply} />
          <LoanForm
            key={`${loan.id}-${formSeed}`}
            initialData={formData}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
