"use client";

import {
  buildAmortizationSchedule,
  getAmortizationNotesForLoanType,
} from "@/modules/shared/lib/loan-amortization";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { LoanCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui";
import { cn } from "@/lib/utils";

interface LoanAmortizationDialogProps {
  loan: LoanCommitmentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTableDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(date);
}

const statusLabelMap = {
  paid: "Pagada",
  upcoming: "Próxima",
  projected: "Proyectada",
} as const;

export function LoanAmortizationDialog({
  loan,
  open,
  onOpenChange,
}: LoanAmortizationDialogProps) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const schedule = buildAmortizationSchedule({
    originalAmount: loan.originalAmount,
    currentBalance: loan.currentBalance ?? loan.originalAmount,
    annualRate: loan.annualRate,
    termMonths: loan.termMonths,
    monthlyPayment: loan.amount,
    startDate: loan.startDate ?? today,
    paymentDueDay: loan.dueStatus.dueDay,
    referenceDate: today,
  });

  const notes = getAmortizationNotesForLoanType(loan.loanType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tabla de amortización — {loan.label}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Vencimiento</th>
                <th className="px-3 py-2 font-medium text-right">Cuota</th>
                <th className="px-3 py-2 font-medium text-right">Capital</th>
                <th className="px-3 py-2 font-medium text-right">Interés</th>
                <th className="px-3 py-2 font-medium text-right">Saldo</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr
                  key={row.installment}
                  className={cn(
                    "border-b border-border/60",
                    row.status === "paid" && "bg-muted/40 text-muted-foreground"
                  )}
                >
                  <td className="px-3 py-2">{row.installment}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatTableDate(row.dueDate)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatDOP(row.payment)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatDOP(row.principal)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatDOP(row.interest)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatDOP(row.balance)}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {statusLabelMap[row.status]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-md bg-muted/40 px-3 py-2 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notas
          </p>
          <ul className="list-disc pl-4 space-y-0.5">
            {notes.map((note) => (
              <li key={note} className="text-xs text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
