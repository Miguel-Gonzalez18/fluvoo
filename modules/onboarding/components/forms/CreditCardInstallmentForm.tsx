"use client";

import { useEffect, type KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { CreditCardInstallment } from "../../types/onboarding";
import { createEmptyInstallment } from "../../config/financial";
import {
  creditCardInstallmentSchema,
  type CreditCardInstallmentSchemaInput,
} from "../../lib/schemas/creditCardInstallmentSchema";
import { FormFieldError } from "./FormFieldError";
import { AnnualRateAiHint } from "./AnnualRateAiHint";

interface CreditCardInstallmentFormProps {
  creditCardId: string;
  issuerName: string;
  initialData: CreditCardInstallment | null;
  onSave: (data: CreditCardInstallment) => void;
  onCancel: () => void;
}

export function CreditCardInstallmentForm({
  creditCardId,
  issuerName,
  initialData,
  onSave,
  onCancel,
}: CreditCardInstallmentFormProps) {
  const defaults = initialData ?? createEmptyInstallment(creditCardId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreditCardInstallmentSchemaInput>({
    resolver: zodResolver(creditCardInstallmentSchema),
    defaultValues: {
      ...defaults,
      startDate: defaults.startDate || "",
      endDate: defaults.endDate || "",
      creditCardId,
    },
  });

  useEffect(() => {
    const nextDefaults = initialData ?? createEmptyInstallment(creditCardId);
    reset({
      ...nextDefaults,
      startDate: nextDefaults.startDate || "",
      endDate: nextDefaults.endDate || "",
      creditCardId,
    });
  }, [initialData, creditCardId, reset]);

  const onSubmit = handleSubmit((data) => {
    onSave({
      ...data,
      creditCardId,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    } as CreditCardInstallment);
  });

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div
      role="group"
      aria-label="Compra a cuotas"
      onKeyDown={handleEnterKey}
      className="bg-muted/30 rounded-lg p-3 space-y-3 border border-dashed"
    >
      <input type="hidden" {...register("id")} />
      <p className="text-xs font-medium text-muted-foreground">
        Compra a cuotas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs">Descripción (opcional)</Label>
          <Input
            placeholder="Ej: TV 55 pulgadas"
            {...register("description")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto original (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("originalAmount", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.originalAmount?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto adeudado (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder="0"
            {...register("amountOwed", {
              setValueAs: (value) => {
                if (value === "" || value === null || value === undefined) return Number.NaN;
                const num = typeof value === "number" ? value : Number(value);
                return Number.isNaN(num) ? Number.NaN : num;
              },
            })}
          />
          <FormFieldError message={errors.amountOwed?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cuota mensual (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("monthlyPayment", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.monthlyPayment?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Plazo (meses)</Label>
          <Input
            type="number"
            {...register("termMonths", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.termMonths?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Tasa anual (%)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("annualRate", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.annualRate?.message} />
          <AnnualRateAiHint
            institutionName={issuerName}
            productType="installment"
            onRateFound={(rate) =>
              setValue("annualRate", rate, { shouldValidate: true })
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <p className="text-[11px] text-muted-foreground">
            Las cuotas usan las mismas fechas de corte y pago de la tarjeta.
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Fecha inicio (opcional)</Label>
          <Input type="date" {...register("startDate")} />
          <FormFieldError message={errors.startDate?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Fecha final (opcional)</Label>
          <Input type="date" {...register("endDate")} />
          <FormFieldError message={errors.endDate?.message} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" size="sm" onClick={onSubmit}>
          Guardar cuota
        </Button>
      </div>
    </div>
  );
}
