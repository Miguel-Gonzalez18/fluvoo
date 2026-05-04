"use client";

import { useState } from "react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Button } from "@/modules/homePage/components/ui/button";
import { SearchableSelect } from "@/modules/shared/components/ui/searchable-select";
import { HealthInsurance } from "../../types/onboarding";
import { ARS_PROVIDERS, createEmptyInsurance } from "../../config/financial";

// Convert ARS_PROVIDERS to options format
const ARS_OPTIONS = ARS_PROVIDERS.map((ars) => ({
  value: ars.toLowerCase().replace(/\s+/g, "_"),
  label: ars,
}));

interface InsuranceFormProps {
  initialData: HealthInsurance | null;
  onSave: (data: HealthInsurance) => void;
  onCancel: () => void;
}

export function InsuranceForm({
  initialData,
  onSave,
  onCancel,
}: InsuranceFormProps) {
  const [formData, setFormData] = useState<HealthInsurance>(
    initialData ?? createEmptyInsurance()
  );

  const handleSubmit = () => {
    if (formData.arsName) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-background rounded-lg p-4 space-y-3 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Aseguradora</Label>
          <SearchableSelect
            options={ARS_OPTIONS}
            value={formData.arsName}
            onChange={(value) =>
              setFormData({ ...formData, arsName: value })
            }
            placeholder="Buscar aseguradora..."
            searchPlaceholder="Escribe para buscar ARS..."
            emptyMessage="No se encontraron aseguradoras"
            otherPlaceholder="Nombre de la aseguradora"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Plan</Label>
          <Input
            placeholder="Ej: Básico, Especial"
            value={formData.planType}
            onChange={(e) =>
              setFormData({ ...formData, planType: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cuota mensual (RD$)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.monthlyPremium || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                monthlyPremium: parseFloat(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!formData.arsName}>
          Guardar
        </Button>
      </div>
    </div>
  );
}
