"use client";

import { Home, Plus } from "lucide-react";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/shared/components/ui/button";
import { EntityCard } from "@/modules/shared/components/entity-card/entity-card.component";
import { FixedObligationsSectionProps } from "../../types/step2/financial.types";
import { getObligationTypeLabel } from "../../config/financial";
import { FixedObligationForm } from "../forms/FixedObligationForm";

export function FixedObligationsSection({
  data,
  showForm,
  editingItem,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onCancel,
}: FixedObligationsSectionProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">¿Tienes obligaciones fijas?</h4>
            <p className="text-xs text-muted-foreground">
              Alquiler, luz, agua, internet y otros pagos mensuales
            </p>
          </div>
        </div>
        <Switch
          checked={data.fixedObligations.length > 0}
          onCheckedChange={onToggle}
        />
      </div>

      {showForm && (
        <FixedObligationForm
          key={editingItem?.id ?? "new-obligation"}
          initialData={editingItem}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}

      {data.fixedObligations.length > 0 && (
        <div className="space-y-2">
          {data.fixedObligations.map((obligation) => (
            <EntityCard
              key={obligation.id}
              title={getObligationTypeLabel(obligation.obligationType)}
              subtitle={`${obligation.providerName || obligation.name || "Sin nombre"} · RD$${obligation.monthlyAmount.toFixed(2)}/mes`}
              onEdit={() => onEdit(obligation)}
              onDelete={() => onDelete(obligation.id)}
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
            Agregar otra obligación
          </Button>
        </div>
      )}
    </div>
  );
}
