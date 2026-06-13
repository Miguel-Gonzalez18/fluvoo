"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import {
  confirmCreditCardPayment,
  deleteCreditCard,
  dismissCreditCardPaymentReminder,
  updateCreditCardTracking,
} from "@/modules/dashboard/employee/actions/credit-card-obligations-actions";
import { CommitmentDueBadge } from "@/modules/dashboard/employee/components/transactions/commitments/CommitmentDueBadge";
import { PaymentCycleBadge } from "@/modules/dashboard/employee/components/transactions/commitments/PaymentCycleBadge";
import { PaymentCycleConfirmSection } from "@/modules/dashboard/employee/components/transactions/commitments/PaymentCycleConfirmSection";
import { CreditCardEditDialog } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardEditDialog";
import { CreditCardStatementUpload } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardStatementUpload";
import { formatDOP, formatUSD } from "@/modules/dashboard/employee/lib/formatCurrency";
import { formatCreditCardDateLabel } from "@/modules/dashboard/employee/lib/credit-card-dates";
import { getInstitutionFullLabel } from "@/modules/dashboard/employee/lib/format-card-payment-subtext";
import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/modules/shared/components/ui";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CreditCardDetailSheetProps {
  card: CreditCardCommitmentItem | null;
  gmailStatus: GmailStatus;
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

export function CreditCardDetailSheet({
  card,
  gmailStatus,
  open,
  onOpenChange,
}: CreditCardDetailSheetProps) {
  const router = useRouter();
  const [side, setSide] = useState<"bottom" | "right">("bottom");
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [lastFour, setLastFour] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const updateSide = () => setSide(media.matches ? "right" : "bottom");
    updateSide();
    media.addEventListener("change", updateSide);
    return () => media.removeEventListener("change", updateSide);
  }, []);

  useEffect(() => {
    if (!card) return;
    setTrackingEnabled(card.trackingEnabled);
    setLastFour(card.lastFour ?? "");
    setTrackingError(null);
  }, [card]);

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

  const handleSaveTracking = () => {
    if (isSavingTracking) return;

    setIsSavingTracking(true);
    sileo.promise(
      async () => {
        try {
          const result = await updateCreditCardTracking({
            cardId: card.id,
            trackingEnabled,
            lastFour: trackingEnabled ? lastFour : undefined,
          });
          if (!result.success) {
            const message = result.error ?? "No se pudo guardar";
            setTrackingError(message);
            throw new Error(message);
          }
          setTrackingError(null);
          router.refresh();
        } finally {
          setIsSavingTracking(false);
        }
      },
      {
        loading: { title: "Guardando seguimiento..." },
        success: { title: "Seguimiento guardado" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "No se pudo guardar el seguimiento",
        }),
      }
    );
  };

  const handleDelete = () => {
    if (isDeleting) return;

    setIsDeleting(true);
    sileo.promise(
      async () => {
        try {
          const result = await deleteCreditCard(card.id);
          if (!result.success) {
            throw new Error(result.error ?? "No se pudo eliminar la tarjeta");
          }
          onOpenChange(false);
          router.refresh();
        } finally {
          setIsDeleting(false);
        }
      },
      {
        loading: { title: "Eliminando tarjeta..." },
        success: { title: "Tarjeta eliminada" },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "No se pudo eliminar la tarjeta",
        }),
      }
    );
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side={side} className="overflow-y-auto sm:max-w-md">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle>{card.alias}</SheetTitle>
            <SheetDescription>
              {getInstitutionFullLabel(card.issuerName)}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-6">
            <section className="space-y-3 rounded-md border border-border bg-muted/20 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Seguimiento automático
              </p>
              <p className="text-xs text-muted-foreground">
                Fluvoo detecta consumos cuando tu banco te envía alertas por
                correo. Los pagos los confirmas tú. Sube tu estado de cuenta en
                PDF para actualizar saldos al corte.
              </p>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="tracking-switch" className="text-sm">
                  Seguimiento por correo
                </Label>
                <Switch
                  id="tracking-switch"
                  checked={trackingEnabled}
                  disabled={!gmailStatus.connected || isSavingTracking}
                  onCheckedChange={setTrackingEnabled}
                />
              </div>
              {!gmailStatus.connected && (
                <p className="text-xs text-muted-foreground">
                  <Link
                    href="/employee/settings"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Conecta Gmail
                  </Link>{" "}
                  para activar el seguimiento de consumos.
                </p>
              )}
              {trackingEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="last-four" className="text-xs">
                    Últimos 4 dígitos
                  </Label>
                  <Input
                    id="last-four"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="1234"
                    value={lastFour}
                    onChange={(e) =>
                      setLastFour(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Necesarios para identificar esta tarjeta en los avisos del
                    banco, sobre todo si tienes más de una del mismo emisor.
                  </p>
                </div>
              )}
              {trackingError && (
                <p className="text-xs text-destructive">{trackingError}</p>
              )}
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isSavingTracking}
                onClick={handleSaveTracking}
              >
                {isSavingTracking ? "Guardando…" : "Guardar seguimiento"}
              </Button>
              {trackingEnabled && (
                <ul className="list-disc space-y-1 pl-4 text-[11px] text-muted-foreground">
                  <li>Activa alertas de compras en la app de tu banco.</li>
                  <li>Sube tu PDF de estado de cuenta tras cada corte.</li>
                </ul>
              )}
            </section>

            {trackingEnabled && (
              <CreditCardStatementUpload card={card} />
            )}

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
                <div className="flex flex-col items-end gap-1">
                  <CommitmentDueBadge dueStatus={card.dueStatus} />
                  {card.nextCycle && (
                    <PaymentCycleBadge status={card.nextCycle.status} />
                  )}
                </div>
              </div>
            </section>

            <PaymentCycleConfirmSection
              nextCycle={card.nextCycle}
              confirmedCycles={card.confirmedCycles}
              onConfirm={confirmCreditCardPayment}
              onDismiss={dismissCreditCardPaymentReminder}
              amountLabel="Pago de tarjeta"
            />

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
              <DetailRow
                label="Próxima fecha de corte"
                value={formatCreditCardDateLabel(card.nextStatementCloseDate)}
              />
              <DetailRow
                label="Próxima fecha límite de pago"
                value={formatCreditCardDateLabel(card.nextPaymentDueDate)}
              />
              {card.annualRate != null && card.annualRate > 0 && (
                <DetailRow
                  label="Tasa anual revolving"
                  value={`${card.annualRate.toFixed(2)}%`}
                />
              )}
              <DetailRow label="Titular" value={card.cardholderName} />
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

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                Editar
              </Button>
              {!deleteConfirm ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirm(true)}
                >
                  Eliminar
                </Button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    ¿Eliminar {card.alias}?
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? "Eliminando…" : "Confirmar"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CreditCardEditDialog
        card={card}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
