"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { SearchableSelect } from "@/modules/shared/components/ui/searchable-select";
import { Loan } from "../../types/onboarding";
import {
  LOAN_TYPES,
  FINANCIAL_INSTITUTIONS,
  createEmptyLoan,
} from "../../config/financial";
import { loanSchema, type LoanSchemaInput } from "../../lib/schemas/loanSchema";
import { FormFieldError } from "./FormFieldError";
import { AnnualRateAiHint } from "./AnnualRateAiHint";

interface LoanFormProps {
  initialData: Loan | null;
  onSave: (data: Loan) => void;
  onCancel: () => void;
}

export function LoanForm({ initialData, onSave, onCancel }: LoanFormProps) {
  const defaults = initialData ?? createEmptyLoan();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanSchemaInput>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      ...defaults,
      startDate: defaults.startDate || "",
    },
  });

  useEffect(() => {
    const nextDefaults = initialData ?? createEmptyLoan();
    reset({
      ...nextDefaults,
      startDate: nextDefaults.startDate || "",
    });
  }, [initialData, reset]);

  const lenderName = watch("lenderName");

  const onSubmit = handleSubmit((data) => {
    onSave(data as Loan);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="bg-background rounded-lg p-4 space-y-3 border"
    >
      <input type="hidden" {...register("id")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Tipo de préstamo</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            {...register("loanType")}
          >
            {LOAN_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <FormFieldError message={errors.loanType?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Entidad prestamista</Label>
          <SearchableSelect
            options={FINANCIAL_INSTITUTIONS}
            value={lenderName}
            onChange={(value) =>
              setValue("lenderName", value, { shouldValidate: true })
            }
            placeholder="Buscar banco, cooperativa o financiera..."
            searchPlaceholder="Escribe para buscar..."
            emptyMessage="No se encontraron entidades"
            otherPlaceholder="Nombre de la entidad"
          />
          <FormFieldError message={errors.lenderName?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto original (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("originalAmount", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.originalAmount?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Tasa anual (%)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("annualRate", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.annualRate?.message} />
          <AnnualRateAiHint
            institutionName={lenderName}
            productType="loan"
            onRateFound={(rate) =>
              setValue("annualRate", rate, { shouldValidate: true })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Plazo (meses)</Label>
          <Input
            type="number"
            placeholder="Ej: 36"
            {...register("termMonths", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.termMonths?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cuota mensual (RD$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("monthlyPayment", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.monthlyPayment?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Día de pago (del mes)</Label>
          <Input
            type="number"
            min={1}
            max={31}
            placeholder="Ej: 15"
            {...register("paymentDueDay", { valueAsNumber: true })}
          />
          <FormFieldError message={errors.paymentDueDay?.message} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Fecha final</Label>
          <Input type="date" {...register("endDate")} />
          <FormFieldError message={errors.endDate?.message} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs">Fecha inicio (opcional)</Label>
          <Input type="date" {...register("startDate")} />
          <p className="text-xs text-muted-foreground">
            Si no la recuerdas, la calculamos con la fecha final y el plazo en
            meses.
          </p>
          <FormFieldError message={errors.startDate?.message} />
        </div>
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
