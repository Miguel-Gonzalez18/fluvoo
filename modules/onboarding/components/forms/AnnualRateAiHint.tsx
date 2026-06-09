"use client";

import { sileo } from "sileo";
import { lookupAnnualRate } from "@/modules/onboarding/actions/lookup-annual-rate.server";
import type { AnnualRateProductType } from "@/modules/onboarding/actions/lookup-annual-rate.server";

interface AnnualRateAiHintProps {
  institutionName: string;
  productType: AnnualRateProductType;
  onRateFound?: (rate: number) => void;
}

export function AnnualRateAiHint({
  institutionName,
  productType,
  onRateFound,
}: AnnualRateAiHintProps) {
  const handleClick = async () => {
    const result = await lookupAnnualRate({
      institution: institutionName,
      productType,
    });

    if (result.rate != null && onRateFound) {
      onRateFound(result.rate);
      sileo.success({ title: `Tasa encontrada: ${result.rate}%` });
      return;
    }

    sileo.info({
      title: result.error ?? "No se pudo consultar la tasa",
    });
  };

  return (
    <p className="text-xs text-muted-foreground">
      ¿No recuerdas la tasa anual?{" "}
      <button
        type="button"
        onClick={handleClick}
        className="text-primary underline-offset-2 hover:underline font-medium"
      >
        Puedes consultarla con nuestro agente de IA aquí
      </button>
    </p>
  );
}
