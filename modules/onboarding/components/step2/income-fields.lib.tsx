"use client";

import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { CurrencyInput } from "@/modules/shared/components/currency-input/currency-input.component";
import { ProfileType, OnboardingData } from "../../types/onboarding";
import { BUSINESS_TYPES } from "../../config/financial";

export function getIncomeFields(profileType: ProfileType, data: OnboardingData, onUpdate: (data: Partial<OnboardingData>) => void) {
  switch (profileType) {
    case "employee":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="monthlySalary" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sueldo bruto mensual
            </Label>
            <CurrencyInput
              id="monthlySalary"
              value={data.monthlySalary}
              onChange={(val) => onUpdate({ monthlySalary: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employerName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              ¿Dónde trabajas? (opcional)
            </Label>
            <Input
              id="employerName"
              placeholder="Nombre de la empresa"
              value={data.employerName || ""}
              onChange={(e) => onUpdate({ employerName: e.target.value })}
            />
          </div>
        </>
      );

    case "freelancer":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="averageMonthlyIncome" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ingreso promedio mensual
            </Label>
            <CurrencyInput
              id="averageMonthlyIncome"
              value={data.averageMonthlyIncome}
              onChange={(val) => onUpdate({ averageMonthlyIncome: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professionSector" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Rubro/Profesión
            </Label>
            <Input
              id="professionSector"
              placeholder="Ej: Diseño, Programación, Consultoría"
              value={data.professionSector || ""}
              onChange={(e) => onUpdate({ professionSector: e.target.value })}
            />
          </div>
        </>
      );

    case "business_owner":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nombre del negocio
            </Label>
            <Input
              id="businessName"
              placeholder="Nombre comercial"
              value={data.businessName || ""}
              onChange={(e) => onUpdate({ businessName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tipo de negocio
            </Label>
            <select
              id="businessType"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={data.businessType || ""}
              onChange={(e) => onUpdate({ businessType: e.target.value })}
            >
              <option value="">Selecciona...</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessMonthlyRevenue" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ingreso mensual del negocio
            </Label>
            <CurrencyInput
              id="businessMonthlyRevenue"
              value={data.businessMonthlyRevenue}
              onChange={(val) => onUpdate({ businessMonthlyRevenue: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeCount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Número de empleados
            </Label>
            <Input
              id="employeeCount"
              type="number"
              placeholder="0"
              value={data.employeeCount || ""}
              onChange={(e) => onUpdate({ employeeCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="businessRnc" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              RNC (Registro Nacional de Contribuyentes)
            </Label>
            <Input
              id="businessRnc"
              placeholder="Ej: 1-12345678-9"
              value={data.businessRnc || ""}
              onChange={(e) => onUpdate({ businessRnc: e.target.value })}
            />
          </div>
        </>
      );

    default:
      return null;
  }
}
