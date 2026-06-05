"use client";

import { Landmark, Plus } from "lucide-react";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/shared/components/ui/button";
import { EntityCard } from "@/modules/shared/components/entity-card/entity-card.component";
import { LoansSectionProps } from "../../types/step2/financial.types";
import { getLoanTypeLabel } from "../../config/financial";
import { LoanForm } from "../forms/LoanForm";

export function LoansSection({
  data,
  showForm,
  editingItem,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onSave,
  onCancel,
}: LoansSectionProps) {
  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">¿Tienes préstamos?</h4>
            <p className="text-xs text-muted-foreground">Personales, hipotecarios o vehiculares</p>
          </div>
        </div>
        <Switch checked={data.loans.length > 0} onCheckedChange={onToggle} />
      </div>

      {data.loans.length > 0 && (
        <div className="space-y-2">
          {data.loans.map((loan) => (
            <EntityCard
              key={loan.id}
              title={getLoanTypeLabel(loan.loanType)}
              subtitle={`${loan.lenderName} • RD$${loan.monthlyPayment.toFixed(2)}/mes`}
              onEdit={() => onEdit(loan)}
              onDelete={() => onDelete(loan.id)}
            />
          ))}
          <Button variant="outline" size="sm" className="w-full" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar otro préstamo
          </Button>
        </div>
      )}

      {showForm && <LoanForm initialData={editingItem} onSave={onSave} onCancel={onCancel} />}
    </div>
  );
}
