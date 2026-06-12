"use client";

import { useEffect, useState } from "react";
import { CommitmentDueBadge } from "@/modules/dashboard/employee/components/transactions/commitments/CommitmentDueBadge";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import { getInstitutionFullLabel } from "@/modules/dashboard/employee/lib/format-card-payment-subtext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/modules/shared/components/ui";
import type { LoanCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface LoanDetailSheetProps {
  loan: LoanCommitmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatCommitmentDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(date);
}

export function LoanDetailSheet({
  loan,
  open,
  onOpenChange,
}: LoanDetailSheetProps) {
  const [side, setSide] = useState<"bottom" | "right">("bottom");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const updateSide = () => setSide(media.matches ? "right" : "bottom");
    updateSide();
    media.addEventListener("change", updateSide);
    return () => media.removeEventListener("change", updateSide);
  }, []);

  if (!loan) return null;

  const lenderFullLabel = loan.lenderName
    ? getInstitutionFullLabel(loan.lenderName)
    : "Prestamista no especificado";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>{loan.label}</SheetTitle>
          <SheetDescription>{lenderFullLabel}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <section className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDOP(loan.amount)}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    a pagar
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Cuota mensual</p>
              </div>
              <CommitmentDueBadge dueStatus={loan.dueStatus} />
            </div>
          </section>

          <section className="divide-y divide-border rounded-md border border-border px-3">
            <DetailRow
              label="Monto original"
              value={formatDOP(loan.originalAmount)}
            />
            <DetailRow
              label="Saldo actual"
              value={
                loan.currentBalance != null
                  ? formatDOP(loan.currentBalance)
                  : "—"
              }
            />
            <DetailRow
              label="Cuota mensual"
              value={formatDOP(loan.amount)}
            />
            <DetailRow
              label="Plazo"
              value={`${loan.termMonths} meses`}
            />
            <DetailRow
              label="Tasa anual"
              value={`${loan.annualRate.toFixed(2)}%`}
            />
          </section>

          <section className="divide-y divide-border rounded-md border border-border px-3">
            <p className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fechas
            </p>
            <DetailRow
              label="Fecha límite de pago"
              value={`Día ${loan.dueStatus.dueDay}`}
            />
            <DetailRow
              label="Fecha de inicio"
              value={formatCommitmentDate(loan.startDate)}
            />
            <DetailRow
              label="Fecha final"
              value={formatCommitmentDate(loan.endDate)}
            />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
