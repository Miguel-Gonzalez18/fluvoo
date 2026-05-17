"use client";

import { IncomeSectionProps } from "../../types/step2/financial.types";
import { ProfileType } from "../../types/onboarding";
import { TaxSummaryCard } from "../tax-summary/TaxSummaryCard";
import { getIncomeFields } from "./income-fields.lib";

function shouldShowTaxSummary(profileType: ProfileType, data: { monthlySalary?: number; averageMonthlyIncome?: number; businessMonthlyRevenue?: number }) {
  return (
    (profileType === "employee" && (data.monthlySalary ?? 0) > 0) ||
    (profileType === "freelancer" && (data.averageMonthlyIncome ?? 0) > 0) ||
    (profileType === "business_owner" && (data.businessMonthlyRevenue ?? 0) > 0)
  );
}

export function IncomeSection({ profileType, data, onUpdate }: IncomeSectionProps) {
  const fields = getIncomeFields(profileType, data, onUpdate);
  const showTaxSummary = shouldShowTaxSummary(profileType, data);

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
          gastosEstimados={30}
        />
      )}
    </div>
  );
}
