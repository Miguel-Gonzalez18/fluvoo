"use client";

import { CreditCard as CreditCardIcon, Plus } from "lucide-react";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/shared/components/ui/button";
import { EntityCard } from "@/modules/shared/components/entity-card/entity-card.component";
import { CreditCardsSectionProps } from "../../types/step2/financial.types";
import { FINANCIAL_INSTITUTIONS } from "../../config/financial";
import { CreditCardForm } from "../forms/CreditCardForm";

function getIssuerLabel(value: string): string {
  return FINANCIAL_INSTITUTIONS.find((item) => item.value === value)?.label ?? value;
}

function getCardPaymentLabel(card: CreditCardsSectionProps["data"]["creditCards"][number]): string {
  const installmentsTotal = card.installments.reduce(
    (sum, item) => sum + item.monthlyPayment,
    0
  );
  const mode = card.currencyMode ?? "dop_only";

  let revolvingLabel: string;
  if (mode === "usd_only") {
    revolvingLabel = `USD $${(card.minimumPaymentUsd ?? 0).toFixed(2)}`;
  } else if (mode === "mixed") {
    revolvingLabel = `RD$${card.minimumPayment.toFixed(2)} + USD $${(card.minimumPaymentUsd ?? 0).toFixed(2)}`;
  } else {
    revolvingLabel = `RD$${card.minimumPayment.toFixed(2)}`;
  }

  if (installmentsTotal > 0) {
    const totalDop =
      (mode === "usd_only" ? 0 : card.minimumPayment) + installmentsTotal;
    return `RD$${totalDop.toFixed(2)} a pagar (revolving + cuotas)`;
  }

  return `${revolvingLabel} mín.`;
}

export function CreditCardsSection({
  data,
  showForm,
  editingItem,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onCancel,
}: CreditCardsSectionProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCardIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">¿Tienes tarjetas de crédito?</h4>
            <p className="text-xs text-muted-foreground">
              Pago revolving y compras a cuotas
            </p>
          </div>
        </div>
        <Switch checked={data.creditCards.length > 0} onCheckedChange={onToggle} />
      </div>

      {showForm && (
        <CreditCardForm
          key={editingItem?.id ?? "new-credit-card"}
          initialData={editingItem}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {data.creditCards.length > 0 && (
        <div className="space-y-2">
          {data.creditCards.map((card) => (
            <EntityCard
              key={card.id}
              title={card.cardLabel || getIssuerLabel(card.issuerName)}
              subtitle={`${getIssuerLabel(card.issuerName)} · ${getCardPaymentLabel(card)} · ${card.installments.length} cuota(s)`}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onAdd}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar otra tarjeta
          </Button>
        </div>
      )}
    </div>
  );
}
