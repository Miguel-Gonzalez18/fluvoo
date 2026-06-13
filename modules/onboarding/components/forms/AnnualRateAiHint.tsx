"use client";

import { useState } from "react";
import { sileo } from "sileo";
import { lookupAnnualRate } from "@/modules/onboarding/actions/lookup-annual-rate.server";
import type { AnnualRateProductType } from "@/modules/onboarding/actions/lookup-annual-rate.server";
import type { LoanType } from "@/modules/onboarding/types/onboarding";

interface AnnualRateAiHintProps {
  institutionName: string;
  productType: AnnualRateProductType;
  loanType?: LoanType;
  onRateFound?: (rate: number) => void;
}

export function AnnualRateAiHint({
  institutionName,
  productType,
  loanType,
  onRateFound,
}: AnnualRateAiHintProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await lookupAnnualRate({
        institution: institutionName,
        productType,
        loanType,
      });

      if (result.rate != null && onRateFound) {
        onRateFound(result.rate);
        const confidenceNote =
          result.confidence && result.confidence !== "high"
            ? ` (${result.confidence === "medium" ? "referencial" : "aproximada"})`
            : "";
        sileo.success({
          title: `Tasa encontrada: ${result.rate}%${confidenceNote}`,
          description: result.note,
        });
        return;
      }

      sileo.info({
        title: result.error ?? "No se pudo consultar la tasa",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <p className="text-xs text-muted-foreground">
      ¿No recuerdas la tasa anual?{" "}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="text-primary underline-offset-2 hover:underline font-medium disabled:opacity-60"
      >
        {isLoading ? "Buscando…" : "Puedes consultarla con nuestro agente de IA aquí"}
      </button>
    </p>
  );
}
