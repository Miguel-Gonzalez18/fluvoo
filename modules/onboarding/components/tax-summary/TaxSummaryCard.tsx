"use client";

import { cn } from "@/lib/utils";
import { TaxSummaryCardProps } from "../../types/tax/summary.types";
import { useTaxParameters } from "@/modules/shared/hooks";
import { getTaxParameters } from "../../actions/tax-actions";
import { EmployeeTaxSection } from "./employee/EmployeeTaxSection";
import { FreelancerTaxSection } from "./freelancer/FreelancerTaxSection";
import { BusinessTaxSection } from "./business/BusinessTaxSection";

function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 space-y-4 animate-pulse", className)}>
      <div className="h-10 bg-muted rounded-lg w-3/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="h-4 bg-muted rounded w-4/6" />
    </div>
  );
}

function ErrorState({ error, className }: { error: string | null; className?: string }) {
  return (
    <div className={cn("bg-muted/50 rounded-xl p-4 text-sm text-destructive", className)}>
      {error ?? "No se pudieron cargar los parámetros fiscales."}
    </div>
  );
}

export function TaxSummaryCard({
  profileType,
  monthlySalary,
  averageMonthlyIncome,
  businessMonthlyRevenue,
  gastosEstimados = 30,
  className,
}: TaxSummaryCardProps) {
  const { taxParams, loading, error } = useTaxParameters(getTaxParameters);

  // Employee profile
  if (profileType === "employee" && monthlySalary && monthlySalary > 0) {
    if (loading) {
      return <LoadingState className={className} />;
    }

    if (!taxParams) {
      return <ErrorState error={error} className={className} />;
    }

    return <EmployeeTaxSection monthlySalary={monthlySalary} taxParams={taxParams} />;
  }

  // Freelancer profile
  if (profileType === "freelancer" && averageMonthlyIncome && averageMonthlyIncome > 0) {
    return <FreelancerTaxSection averageMonthlyIncome={averageMonthlyIncome} />;
  }

  // Business owner profile
  if (profileType === "business_owner" && businessMonthlyRevenue && businessMonthlyRevenue > 0) {
    return (
      <BusinessTaxSection
        businessMonthlyRevenue={businessMonthlyRevenue}
        gastosEstimados={gastosEstimados}
      />
    );
  }

  return null;
}
