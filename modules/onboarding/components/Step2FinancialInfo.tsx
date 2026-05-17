"use client";

import { useState } from "react";
import { Briefcase, Landmark, Plus, Trash2, Wallet } from "lucide-react";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";
import { Button } from "@/modules/homePage/components/ui/button";
import { OnboardingData, ProfileType, Loan } from "../types/onboarding";
import { LoanForm } from "./forms/LoanForm";
import { TaxSummaryCard } from "./TaxSummaryCard";
import { getLoanTypeLabel, BUSINESS_TYPES, SIPEN_CONFIG, AFP_CONFIG } from "../config/financial";

interface Step2FinancialInfoProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onAddLoan: (loan: Loan) => void;
  onUpdateLoan: (loan: Loan) => void;
  onRemoveLoan: (id: string) => void;
}

export function Step2FinancialInfo({
  profileType,
  data,
  onUpdate,
  onAddLoan,
  onUpdateLoan,
  onRemoveLoan,
}: Step2FinancialInfoProps) {
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

  const handleSaveLoan = (loan: Loan) => {
    if (editingLoan) {
      onUpdateLoan(loan);
    } else {
      onAddLoan(loan);
    }
    setShowLoanForm(false);
    setEditingLoan(null);
  };

  return (
    <div className="space-y-6">
      <StepHeader />

      <div className="space-y-6">
        <IncomeSection profileType={profileType} data={data} onUpdate={onUpdate} />
        
        {profileType === "employee" && (
          <>
            <SipenSection data={data} onUpdate={onUpdate} />
            <AfpSection data={data} onUpdate={onUpdate} />
          </>
        )}

        <LoansSection
          data={data}
          showForm={showLoanForm}
          editingItem={editingLoan}
          onToggle={(checked) => {
            if (!checked) {
              onUpdate({ loans: [] });
            } else if (data.loans.length === 0) {
              setShowLoanForm(true);
            }
          }}
          onEdit={(loan) => {
            setEditingLoan(loan);
            setShowLoanForm(true);
          }}
          onDelete={onRemoveLoan}
          onAdd={() => {
            setEditingLoan(null);
            setShowLoanForm(true);
          }}
          onSave={handleSaveLoan}
          onCancel={() => {
            setShowLoanForm(false);
            setEditingLoan(null);
          }}
        />
      </div>
    </div>
  );
}

// Sub-components
function StepHeader() {
  return (
    <div className="space-y-2">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
        Cuéntanos sobre tus finanzas
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-lg">
        Utilizamos esta información para calcular tus deducciones de ley y proyectar tu flujo de caja real.
      </p>
    </div>
  );
}

interface IncomeSectionProps {
  profileType: ProfileType;
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

function IncomeSection({ profileType, data, onUpdate }: IncomeSectionProps) {
  const fields = getIncomeFields(profileType, data, onUpdate);

  // Determinar si mostrar resumen fiscal (requiere ingreso > 0)
  const showTaxSummary =
    (profileType === "employee" && (data.monthlySalary ?? 0) > 0) ||
    (profileType === "freelancer" && (data.averageMonthlyIncome ?? 0) > 0) ||
    (profileType === "business_owner" && (data.businessMonthlyRevenue ?? 0) > 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Ingresos mensuales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{fields}</div>
      </div>

      {showTaxSummary && (
        <TaxSummaryCard
          profileType={profileType}
          monthlySalary={data.monthlySalary}
          averageMonthlyIncome={data.averageMonthlyIncome}
          businessMonthlyRevenue={data.businessMonthlyRevenue}
          gastosEstimados={30} // Default 30% para empresas
        />
      )}
    </div>
  );
}

interface CurrencyInputProps {
  id: string;
  value: number | undefined;
  onChange: (val: number) => void;
  placeholder?: string;
}

function CurrencyInput({ id, value, onChange, placeholder }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || val === 0) return "";
    return val.toLocaleString("es-DO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseCurrency = (str: string): number => {
    if (!str) return 0;
    const cleaned = str.replace(/[^\d.,]/g, "");
    if (!cleaned) return 0;
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsed = parseCurrency(e.target.value);
    onChange(parsed);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(value?.toString() || "");
  };

  const displayValue = isFocused ? inputValue : formatCurrency(value);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        RD$
      </span>
      <Input
        id={id}
        type="text"
        placeholder={placeholder || "0.00"}
        className="pl-12"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
}

function getIncomeFields(
  profileType: ProfileType,
  data: OnboardingData,
  onUpdate: (data: Partial<OnboardingData>) => void
) {

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
  }
}

interface SipenSectionProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

function SipenSection({ data, onUpdate }: SipenSectionProps) {
  // Obligatorio para empleados - siempre true
  const isContributing = data.contributesSipen ?? true;

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">
              ARS - Seguro de Salud
              <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Obligatorio</span>
            </h4>
            <p className="text-xs text-muted-foreground">Seguro Familiar de Salud (SFS)</p>
          </div>
        </div>
        <Switch
          checked={isContributing}
          disabled={SIPEN_CONFIG.isMandatory}
          onCheckedChange={(checked) => onUpdate({ contributesSipen: checked })}
        />
      </div>
      <div className="ml-13 pl-4 border-l-2 border-primary/20">
        <div className="bg-primary/5 rounded-lg px-3 py-2 inline-flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-primary">{SIPEN_CONFIG.label}</span>
          <span className="text-xs text-muted-foreground">{SIPEN_CONFIG.description}</span>
        </div>
      </div>
    </div>
  );
}

interface AfpSectionProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

function AfpSection({ data, onUpdate }: AfpSectionProps) {
  // Obligatorio para empleados - siempre true
  const isContributing = data.contributesAfp ?? true;

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">
              AFP - Fondo de Pensiones
              <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Obligatorio</span>
            </h4>
            <p className="text-xs text-muted-foreground">Sistema de Seguridad Social (SIPEN)</p>
          </div>
        </div>
        <Switch
          checked={isContributing}
          disabled={AFP_CONFIG.isMandatory}
          onCheckedChange={(checked) => onUpdate({ contributesAfp: checked })}
        />
      </div>
      <div className="ml-13 pl-4 border-l-2 border-primary/20">
        <div className="bg-primary/5 rounded-lg px-3 py-2 inline-flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-primary">{AFP_CONFIG.label}</span>
          <span className="text-xs text-muted-foreground">{AFP_CONFIG.description}</span>
        </div>
      </div>
    </div>
  );
}

interface LoansSectionProps {
  data: OnboardingData;
  showForm: boolean;
  editingItem: Loan | null;
  onToggle: (checked: boolean) => void;
  onEdit: (item: Loan) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSave: (item: Loan) => void;
  onCancel: () => void;
}

function LoansSection({
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

interface EntityCardProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onDelete: () => void;
}

function EntityCard({ title, subtitle, onEdit, onDelete }: EntityCardProps) {
  return (
    <div className="flex items-center justify-between bg-background rounded-lg p-3">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <span className="text-xs text-muted-foreground">Editar</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
