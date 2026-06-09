"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { FixedObligation } from "../../types/onboarding";
import {
  OBLIGATION_TYPES,
  PAYMENT_FREQUENCY_OPTIONS,
  createEmptyFixedObligation,
} from "../../config/financial";
import {
  fixedObligationSchema,
  type FixedObligationSchemaInput,
} from "../../lib/schemas/fixedObligationSchema";
import { computeMonthlyFromFrequency } from "../../lib/compute-monthly-amount";
import { FormFieldError } from "./FormFieldError";

interface FixedObligationFormProps {
  initialData: FixedObligation | null;
  onSave: (data: FixedObligation) => void;
  onCancel: () => void;
}

export function FixedObligationForm({
  initialData,
  onSave,
  onCancel,
}: FixedObligationFormProps) {
  const defaults = initialData ?? createEmptyFixedObligation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FixedObligationSchemaInput>({
    resolver: zodResolver(fixedObligationSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(initialData ?? createEmptyFixedObligation());
  }, [initialData, reset]);

  const obligationType = watch("obligationType");
  const paymentAmount = watch("paymentAmount");
  const paymentFrequency = watch("paymentFrequency");

  const estimatedMonthly = useMemo(
    () =>
      computeMonthlyFromFrequency(
        Number.isFinite(paymentAmount) ? paymentAmount : 0,
        paymentFrequency ?? "monthly"
      ),
    [paymentAmount, paymentFrequency]
  );

  const onSubmit = handleSubmit((data) => {
    onSave(data as FixedObligation);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background rounded-lg p-4 space-y-3 border"
    >
      <input type="hidden" {...register("id")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Tipo de obligación</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            {...register("obligationType")}
          >
            {OBLIGATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <FormFieldError message={errors.obligationType?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">
            {obligationType === "other" ? "Nombre" : "Alias (opcional)"}
          </Label>
          <Input
            placeholder={
              obligationType === "other" ? "Ej: Gimnasio" : "Ej: Apartamento centro"
            }
            {...register("name")}
          />
          <FormFieldError message={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Proveedor (opcional)</Label>
          <Input
            placeholder="Ej: EDESUR, Claro"
            {...register("providerName")}
          />
          <FormFieldError message={errors.providerName?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Frecuencia de pago</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            {...register("paymentFrequency")}
          >
            {PAYMENT_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FormFieldError message={errors.paymentFrequency?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto por pago (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("paymentAmount", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.paymentAmount?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Día de pago (del mes)</Label>
          <Input
            type="number"
            min={1}
            max={31}
            placeholder="Ej: 5"
            {...register("paymentDueDay", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.paymentDueDay?.message} />
        </div>
        {paymentFrequency && paymentFrequency !== "monthly" && (
          <div className="sm:col-span-2 rounded-md bg-primary/5 px-3 py-2">
            <p className="text-xs font-medium text-primary">
              Total estimado del mes: RD${" "}
              {estimatedMonthly.toLocaleString("es-DO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
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
