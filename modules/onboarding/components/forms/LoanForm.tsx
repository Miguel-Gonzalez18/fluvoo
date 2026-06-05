"use client";

import { useState } from "react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/shared/components/ui/button";
import { SearchableSelect } from "@/modules/shared/components/ui/searchable-select";
import { Loan } from "../../types/onboarding";
import { LOAN_TYPES, FINANCIAL_INSTITUTIONS, createEmptyLoan } from "../../config/financial";

interface LoanFormProps {
  initialData: Loan | null;
  onSave: (data: Loan) => void;
  onCancel: () => void;
}

export function LoanForm({ initialData, onSave, onCancel }: LoanFormProps) {
  const [formData, setFormData] = useState<Loan>(
    initialData ?? createEmptyLoan()
  );

  const handleSubmit = () => {
    if (formData.lenderName && formData.monthlyPayment > 0) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-background rounded-lg p-4 space-y-3 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Tipo de préstamo</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={formData.loanType}
            onChange={(e) =>
              setFormData({
                ...formData,
                loanType: e.target.value as Loan["loanType"],
              })
            }
          >
            {LOAN_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Entidad prestamista</Label>
          <SearchableSelect
            options={FINANCIAL_INSTITUTIONS}
            value={formData.lenderName}
            onChange={(value) =>
              setFormData({ ...formData, lenderName: value })
            }
            placeholder="Buscar banco, cooperativa o financiera..."
            searchPlaceholder="Escribe para buscar..."
            emptyMessage="No se encontraron entidades"
            otherPlaceholder="Nombre de la entidad"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto original (RD$)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.originalAmount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                originalAmount: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Tasa anual (%)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.annualRate || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                annualRate: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Plazo (meses)</Label>
          <Input
            type="number"
            placeholder="Ej: 36"
            value={formData.termMonths || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                termMonths: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cuota mensual (RD$)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.monthlyPayment || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                monthlyPayment: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Fecha inicio</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!formData.lenderName || formData.monthlyPayment <= 0}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
