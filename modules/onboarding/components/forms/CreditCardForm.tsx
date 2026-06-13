"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { SearchableSelect } from "@/modules/shared/components/ui/searchable-select";
import { CreditCard, CreditCardInstallment } from "../../types/onboarding";
import {
  CURRENCY_MODE_OPTIONS,
  FINANCIAL_INSTITUTIONS,
  createEmptyCreditCard,
  createEmptyInstallment,
} from "../../config/financial";
import {
  creditCardSchema,
  type CreditCardSchemaInput,
} from "../../lib/schemas/creditCardSchema";
import { FormFieldError } from "./FormFieldError";
import { CreditCardInstallmentForm } from "./CreditCardInstallmentForm";
import { AnnualRateAiHint } from "./AnnualRateAiHint";
import { addDaysYmd } from "@/modules/dashboard/employee/lib/credit-card-dates";

interface CreditCardFormProps {
  initialData: CreditCard | null;
  onSave: (data: CreditCard) => void;
  onCancel: () => void;
}

const parseRequiredAmount = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return Number.NaN;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isNaN(num) ? Number.NaN : num;
};

const parseOptionalAmount = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isNaN(num) ? null : num;
};

export function CreditCardForm({
  initialData,
  onSave,
  onCancel,
}: CreditCardFormProps) {
  const defaults = initialData ?? createEmptyCreditCard();
  const [installments, setInstallments] = useState<CreditCardInstallment[]>(
    defaults.installments
  );
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);
  const [editingInstallment, setEditingInstallment] =
    useState<CreditCardInstallment | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreditCardSchemaInput>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      ...defaults,
      installments: defaults.installments,
      annualRate: defaults.annualRate ?? null,
      creditLimitUsd: defaults.creditLimitUsd ?? null,
      currentBalanceUsd: defaults.currentBalanceUsd ?? null,
      minimumPaymentUsd: defaults.minimumPaymentUsd ?? null,
      statementBalance: defaults.statementBalance,
      statementBalanceUsd: defaults.statementBalanceUsd,
    },
  });

  const issuerName = watch("issuerName");
  const currencyMode = watch("currencyMode");
  const cardId = watch("id");
  const nextStatementCloseDate = watch("nextStatementCloseDate");
  const minPaymentDueDate = nextStatementCloseDate
    ? addDaysYmd(nextStatementCloseDate, 1)
    : undefined;

  const createInstallmentDefaults = (): CreditCardInstallment =>
    createEmptyInstallment(cardId);

  useEffect(() => {
    const nextDefaults = initialData ?? createEmptyCreditCard();
    reset({
      ...nextDefaults,
      installments: nextDefaults.installments,
      annualRate: nextDefaults.annualRate ?? null,
      creditLimitUsd: nextDefaults.creditLimitUsd ?? null,
      currentBalanceUsd: nextDefaults.currentBalanceUsd ?? null,
      minimumPaymentUsd: nextDefaults.minimumPaymentUsd ?? null,
      statementBalance: nextDefaults.statementBalance,
      statementBalanceUsd: nextDefaults.statementBalanceUsd,
    });
    setInstallments(nextDefaults.installments);
    setShowInstallmentForm(false);
    setEditingInstallment(null);
  }, [initialData, reset]);

  useEffect(() => {
    setValue("installments", installments);
  }, [installments, setValue]);

  const onSubmit = handleSubmit((data) => {
    onSave({
      ...(data as CreditCard),
      installments,
    });
  });

  const handleInstallmentSave = (installment: CreditCardInstallment) => {
    if (editingInstallment) {
      setInstallments((prev) =>
        prev.map((item) => (item.id === installment.id ? installment : item))
      );
    } else {
      setInstallments((prev) => [...prev, installment]);
    }
    setShowInstallmentForm(false);
    setEditingInstallment(null);
  };

  const handleInstallmentDelete = (id: string) => {
    setInstallments((prev) => prev.filter((item) => item.id !== id));
  };

  const showDopFields = currencyMode === "dop_only" || currencyMode === "mixed";
  const showUsdFields = currencyMode === "usd_only" || currencyMode === "mixed";

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background rounded-lg p-4 space-y-4 border"
    >
      <input type="hidden" {...register("id")} />
      <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        Más adelante, en Transacciones, puedes activar seguimiento de consumos
        por correo si conectas Gmail en el paso 3 del onboarding.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Banco emisor</Label>
          <SearchableSelect
            options={FINANCIAL_INSTITUTIONS}
            value={issuerName}
            onChange={(value) =>
              setValue("issuerName", value, { shouldValidate: true })
            }
            placeholder="Buscar banco..."
            searchPlaceholder="Escribe para buscar..."
            emptyMessage="No se encontraron entidades"
            otherPlaceholder="Nombre del banco"
          />
          <FormFieldError message={ errors.issuerName?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Alias de tarjeta</Label>
          <Input placeholder="Ej: Visa Oro" {...register("cardLabel")} />
          <FormFieldError message={ errors.cardLabel?.message} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs">Moneda de la tarjeta</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            {...register("currencyMode")}
          >
            {CURRENCY_MODE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FormFieldError message={ errors.currencyMode?.message} />
        </div>
        {showDopFields && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Límite de crédito (RD$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                {...register("creditLimit", { valueAsNumber: true })}
              />
              <FormFieldError message={ errors.creditLimit?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Saldo actual (RD$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("currentBalance", { setValueAs: parseRequiredAmount })}
              />
              <FormFieldError message={ errors.currentBalance?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Pago mínimo (RD$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("minimumPayment", { setValueAs: parseRequiredAmount })}
              />
              <FormFieldError message={ errors.minimumPayment?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Saldo al corte (RD$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("statementBalance", { setValueAs: parseRequiredAmount })}
              />
              <FormFieldError message={ errors.statementBalance?.message} />
            </div>
          </>
        )}
        {showUsdFields && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Límite de crédito (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                {...register("creditLimitUsd", { setValueAs: parseOptionalAmount })}
              />
              <FormFieldError message={ errors.creditLimitUsd?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Saldo actual (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("currentBalanceUsd", { setValueAs: parseOptionalAmount })}
              />
              <FormFieldError message={ errors.currentBalanceUsd?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Pago mínimo (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("minimumPaymentUsd", { setValueAs: parseOptionalAmount })}
              />
              <FormFieldError message={ errors.minimumPaymentUsd?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Saldo al corte (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                placeholder="0"
                {...register("statementBalanceUsd", { setValueAs: parseRequiredAmount })}
              />
              <FormFieldError message={ errors.statementBalanceUsd?.message} />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Label className="text-xs">Próxima fecha de corte</Label>
          <Input type="date" {...register("nextStatementCloseDate")} />
          <FormFieldError message={ errors.nextStatementCloseDate?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Próxima fecha límite de pago</Label>
          <Input
            type="date"
            min={minPaymentDueDate}
            {...register("nextPaymentDueDate")}
          />
          <FormFieldError message={ errors.nextPaymentDueDate?.message} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs">Tasa anual revolving (%)</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            {...register("annualRate", {
              setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
            })}
          />
          <AnnualRateAiHint
            institutionName={issuerName}
            productType="credit_card"
            onRateFound={(rate) =>
              setValue("annualRate", rate, { shouldValidate: true })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Compras a cuotas (opcional)</Label>
          {!showInstallmentForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingInstallment(null);
                setShowInstallmentForm(true);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Agregar cuota
            </Button>
          )}
        </div>
        {installments.length > 0 && (
          <div className="space-y-1">
            {installments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs bg-muted/40 rounded px-2 py-1.5"
              >
                <span>
                  {item.description || "Compra a cuotas"} · RD$
                  {item.monthlyPayment.toFixed(2)}/mes
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => {
                      setEditingInstallment(item);
                      setShowInstallmentForm(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-destructive"
                    onClick={() => handleInstallmentDelete(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showInstallmentForm && (
          <CreditCardInstallmentForm
            key={editingInstallment?.id ?? "new-installment"}
            creditCardId={cardId}
            issuerName={issuerName}
            initialData={editingInstallment ?? createInstallmentDefaults()}
            onSave={handleInstallmentSave}
            onCancel={() => {
              setShowInstallmentForm(false);
              setEditingInstallment(null);
            }}
          />
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" size="sm">
          Guardar
        </Button>
      </div>
    </form>
  );
}
