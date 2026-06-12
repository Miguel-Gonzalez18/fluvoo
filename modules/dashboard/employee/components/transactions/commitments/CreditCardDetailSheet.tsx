"use client";

import { useEffect, useState } from "react";
import { CommitmentDueBadge } from "@/modules/dashboard/employee/components/transactions/commitments/CommitmentDueBadge";
import { formatDOP, formatUSD } from "@/modules/dashboard/employee/lib/formatCurrency";
import { getInstitutionFullLabel } from "@/modules/dashboard/employee/lib/format-card-payment-subtext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/modules/shared/components/ui";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CreditCardDetailSheetProps {
  card: CreditCardCommitmentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getIssuerFullLabel(issuerName: string): string {
  return getInstitutionFullLabel(issuerName);
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function CreditCardDetailSheet({
  card,
  open,
  onOpenChange,
}: CreditCardDetailSheetProps) {
  const [side, setSide] = useState<"bottom" | "right">("bottom");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const updateSide = () => setSide(media.matches ? "right" : "bottom");
    updateSide();
    media.addEventListener("change", updateSide);
    return () => media.removeEventListener("change", updateSide);
  }, []);

  if (!card) return null;

  const paymentDetailParts: string[] = [];
  if (card.installmentsDop > 0) {
    paymentDetailParts.push(
      `Revolving ${formatDOP(card.revolvingDop)} + cuotas ${formatDOP(card.installmentsDop)}`
    );
  } else {
    paymentDetailParts.push("Pago mensual estimado");
  }
  if (card.usdSubtext) {
    paymentDetailParts.push(card.usdSubtext);
  }

  const showDopLimits =
    card.currencyMode === "dop_only" || card.currencyMode === "mixed";
  const showUsdLimits =
    card.currencyMode === "usd_only" || card.currencyMode === "mixed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle>{card.alias}</SheetTitle>
          <SheetDescription>{getIssuerFullLabel(card.issuerName)}</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <section className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDOP(card.totalPaymentDop)}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    a pagar
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {paymentDetailParts.join(" · ")}
                </p>
              </div>
              <CommitmentDueBadge dueStatus={card.dueStatus} />
            </div>
          </section>

          <section className="divide-y divide-border rounded-md border border-border px-3">
            <DetailRow
              label="Saldo total (RD$)"
              value={formatDOP(card.totalBalanceDop)}
            />
            <DetailRow
              label="Saldo total (USD)"
              value={formatUSD(card.totalBalanceUsd)}
            />
            <DetailRow
              label="Saldo al corte (RD$)"
              value={formatDOP(card.statementBalanceDop)}
            />
            <DetailRow
              label="Saldo al corte (USD)"
              value={formatUSD(card.statementBalanceUsd)}
            />
          </section>

          <section className="divide-y divide-border rounded-md border border-border px-3">
            <p className="py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Límites y fechas
            </p>
            {showDopLimits && (
              <DetailRow
                label="Límite de crédito (RD$)"
                value={formatDOP(card.creditLimitDop)}
              />
            )}
            {showUsdLimits && card.creditLimitUsd != null && (
              <DetailRow
                label="Límite de crédito (USD)"
                value={formatUSD(card.creditLimitUsd)}
              />
            )}
            {card.statementCloseDay != null && (
              <DetailRow
                label="Día de corte"
                value={`Día ${card.statementCloseDay}`}
              />
            )}
            <DetailRow
              label="Fecha límite de pago"
              value={`Día ${card.dueStatus.dueDay}`}
            />
            {card.annualRate != null && card.annualRate > 0 && (
              <DetailRow
                label="Tasa anual revolving"
                value={`${card.annualRate.toFixed(2)}%`}
              />
            )}
            <DetailRow
              label="Titular"
              value={card.cardholderName}
            />
          </section>

          {card.installments.length > 0 && (
            <section className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Compras a cuotas
              </p>
              <div className="space-y-2">
                {card.installments.map((installment) => (
                  <div
                    key={installment.id}
                    className="rounded-md border border-border bg-muted/30 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {installment.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cuota {formatDOP(installment.monthlyPayment)}/mes ·{" "}
                      {installment.termMonths} meses · Adeudado{" "}
                      {formatDOP(installment.amountOwed)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
