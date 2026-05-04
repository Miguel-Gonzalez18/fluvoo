"use client";

import { useState } from "react";
import { Briefcase, HeartPulse, Landmark, Plus, Trash2 } from "lucide-react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/homePage/components/ui/button";
import { OnboardingData, ProfileType, Loan, HealthInsurance } from "../types/onboarding";
import { cn } from "@/lib/utils";

interface Step2FinancialInfoProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

const arsOptions = [
  "Humano",
  "SEMMA",
  "Futuro",
  "Palic",
  "Renacer",
  "Universal",
  "SENASA",
  "GMA",
  "Otra",
];

const loanTypeOptions = [
  { value: "personal", label: "Personal" },
  { value: "mortgage", label: "Hipotecario" },
  { value: "vehicle", label: "Vehicular" },
  { value: "business", label: "Empresarial" },
  { value: "credit_card", label: "Tarjeta de crédito" },
];

export function Step2FinancialInfo({
  profileType,
  data,
  onUpdate,
}: Step2FinancialInfoProps) {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [editingInsurance, setEditingInsurance] = useState<HealthInsurance | null>(null);

  const handleAddLoan = (loan: Loan) => {
    const newLoans = editingLoan
      ? data.loans.map((l) => (l.id === editingLoan.id ? loan : l))
      : [...data.loans, loan];
    onUpdate({ loans: newLoans });
    setShowLoanForm(false);
    setEditingLoan(null);
  };

  const handleAddInsurance = (insurance: HealthInsurance) => {
    const newInsurances = editingInsurance
      ? data.healthInsurances.map((i) => (i.id === editingInsurance.id ? insurance : i))
      : [...data.healthInsurances, insurance];
    onUpdate({ healthInsurances: newInsurances });
    setShowInsuranceForm(false);
    setEditingInsurance(null);
  };

  const handleDeleteLoan = (id: string) => {
    onUpdate({ loans: data.loans.filter((l) => l.id !== id) });
  };

  const handleDeleteInsurance = (id: string) => {
    onUpdate({ healthInsurances: data.healthInsurances.filter((i) => i.id !== id) });
  };

  const renderProfileSpecificFields = () => {
    switch (profileType) {
      case "employee":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlySalary" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sueldo bruto mensual
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  RD$
                </span>
                <Input
                  id="monthlySalary"
                  type="number"
                  placeholder="0.00"
                  className="pl-12"
                  value={data.monthlySalary || ""}
                  onChange={(e) => onUpdate({ monthlySalary: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
          </div>
        );

      case "freelancer":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="averageMonthlyIncome" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ingreso promedio mensual
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  RD$
                </span>
                <Input
                  id="averageMonthlyIncome"
                  type="number"
                  placeholder="0.00"
                  className="pl-12"
                  value={data.averageMonthlyIncome || ""}
                  onChange={(e) => onUpdate({ averageMonthlyIncome: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
          </div>
        );

      case "business_owner":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="retail">Retail / Tienda</option>
                <option value="services">Servicios</option>
                <option value="restaurant">Restaurante / Food</option>
                <option value="technology">Tecnología</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessMonthlyRevenue" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ingreso mensual del negocio
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  RD$
                </span>
                <Input
                  id="businessMonthlyRevenue"
                  type="number"
                  placeholder="0.00"
                  className="pl-12"
                  value={data.businessMonthlyRevenue || ""}
                  onChange={(e) => onUpdate({ businessMonthlyRevenue: parseFloat(e.target.value) || 0 })}
                />
              </div>
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
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
          Cuéntanos sobre tus finanzas
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
          Utilizamos esta información para calcular tus deducciones de ley y proyectar tu flujo de caja real.
        </p>
      </div>

      <div className="space-y-6">
        {/* Income Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Ingresos mensuales
          </h3>
          {renderProfileSpecificFields()}
        </div>

        {/* SIPEN - Only for employees */}
        {profileType === "employee" && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">¿Cotizas al SIPEN?</h4>
                  <p className="text-xs text-muted-foreground">
                    Sistema Dominicano de Seguridad Social
                  </p>
                </div>
              </div>
              <Switch
                checked={data.contributesSipen || false}
                onCheckedChange={(checked) => onUpdate({ contributesSipen: checked })}
              />
            </div>
            {data.contributesSipen && (
              <div className="ml-13 pl-13 border-l-2 border-primary/20">
                <div className="bg-primary/5 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">2.87%</span>
                  <span className="text-xs text-muted-foreground">
                    Aporte de ley automático aplicado al sueldo bruto.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ARS Section */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">¿Tienes ARS?</h4>
                <p className="text-xs text-muted-foreground">
                  Seguro de salud contributivo
                </p>
              </div>
            </div>
            <Switch
              checked={data.healthInsurances.length > 0}
              onCheckedChange={(checked) => {
                if (!checked) {
                  onUpdate({ healthInsurances: [] });
                } else if (data.healthInsurances.length === 0) {
                  setShowInsuranceForm(true);
                }
              }}
            />
          </div>

          {data.healthInsurances.length > 0 && (
            <div className="space-y-2">
              {data.healthInsurances.map((insurance) => (
                <div
                  key={insurance.id}
                  className="flex items-center justify-between bg-background rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-sm">{insurance.arsName}</p>
                    <p className="text-xs text-muted-foreground">
                      {insurance.planType} • RD${insurance.monthlyPremium.toFixed(2)}/mes
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingInsurance(insurance);
                        setShowInsuranceForm(true);
                      }}
                    >
                      <span className="text-xs text-muted-foreground">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteInsurance(insurance.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEditingInsurance(null);
                  setShowInsuranceForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar otro seguro
              </Button>
            </div>
          )}

          {showInsuranceForm && (
            <InsuranceForm
              initialData={editingInsurance}
              onSave={handleAddInsurance}
              onCancel={() => {
                setShowInsuranceForm(false);
                setEditingInsurance(null);
              }}
            />
          )}
        </div>

        {/* Loans Section */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">¿Tienes préstamos?</h4>
                <p className="text-xs text-muted-foreground">
                  Personales, hipotecarios o vehiculares
                </p>
              </div>
            </div>
            <Switch
              checked={data.loans.length > 0}
              onCheckedChange={(checked) => {
                if (!checked) {
                  onUpdate({ loans: [] });
                } else if (data.loans.length === 0) {
                  setShowLoanForm(true);
                }
              }}
            />
          </div>

          {data.loans.length > 0 && (
            <div className="space-y-2">
              {data.loans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between bg-background rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {loanTypeOptions.find((t) => t.value === loan.loanType)?.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {loan.lenderName} • RD${loan.monthlyPayment.toFixed(2)}/mes
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingLoan(loan);
                        setShowLoanForm(true);
                      }}
                    >
                      <span className="text-xs text-muted-foreground">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteLoan(loan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setEditingLoan(null);
                  setShowLoanForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar otro préstamo
              </Button>
            </div>
          )}

          {showLoanForm && (
            <LoanForm
              initialData={editingLoan}
              onSave={handleAddLoan}
              onCancel={() => {
                setShowLoanForm(false);
                setEditingLoan(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component: Insurance Form
function InsuranceForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: HealthInsurance | null;
  onSave: (data: HealthInsurance) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<HealthInsurance>(
    initialData || {
      id: crypto.randomUUID(),
      arsName: "",
      planType: "",
      monthlyPremium: 0,
    }
  );

  return (
    <div className="bg-background rounded-lg p-4 space-y-3 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Aseguradora</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={formData.arsName}
            onChange={(e) => setFormData({ ...formData, arsName: e.target.value })}
          >
            <option value="">Selecciona...</option>
            {arsOptions.map((ars) => (
              <option key={ars} value={ars}>
                {ars}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Plan</Label>
          <Input
            placeholder="Ej: Básico, Especial"
            value={formData.planType}
            onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Cuota mensual (RD$)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.monthlyPremium || ""}
            onChange={(e) =>
              setFormData({ ...formData, monthlyPremium: parseFloat(e.target.value) || 0 })
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
          onClick={() => onSave(formData)}
          disabled={!formData.arsName}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

// Sub-component: Loan Form
function LoanForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData: Loan | null;
  onSave: (data: Loan) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Loan>(
    initialData || {
      id: crypto.randomUUID(),
      loanType: "personal",
      lenderName: "",
      originalAmount: 0,
      annualRate: 0,
      termMonths: 0,
      monthlyPayment: 0,
      startDate: new Date().toISOString().split("T")[0],
    }
  );

  return (
    <div className="bg-background rounded-lg p-4 space-y-3 border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs">Tipo de préstamo</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={formData.loanType}
            onChange={(e) =>
              setFormData({ ...formData, loanType: e.target.value as Loan["loanType"] })
            }
          >
            {loanTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Entidad prestamista</Label>
          <Input
            placeholder="Ej: Banco Popular, BHD"
            value={formData.lenderName}
            onChange={(e) => setFormData({ ...formData, lenderName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Monto original (RD$)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.originalAmount || ""}
            onChange={(e) =>
              setFormData({ ...formData, originalAmount: parseFloat(e.target.value) || 0 })
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
              setFormData({ ...formData, annualRate: parseFloat(e.target.value) || 0 })
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
              setFormData({ ...formData, termMonths: parseInt(e.target.value) || 0 })
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
              setFormData({ ...formData, monthlyPayment: parseFloat(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Fecha inicio</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(formData)}
          disabled={!formData.lenderName || formData.monthlyPayment <= 0}
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}
