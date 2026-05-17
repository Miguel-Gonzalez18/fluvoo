"use client";

import { useState, useEffect } from "react";
import { Tables } from "@/src/types/supabase";

type TaxParameters = Tables<"tax_parameters">;

export interface UseTaxParametersReturn {
  taxParams: TaxParameters | null;
  loading: boolean;
  error: string | null;
}

interface TaxParametersResponse {
  success: boolean;
  data?: TaxParameters;
  error?: string;
}

export function useTaxParameters(
  fetchAction: () => Promise<TaxParametersResponse>
): UseTaxParametersReturn {
  const [taxParams, setTaxParams] = useState<TaxParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchAction().then((res) => {
      if (!mounted) return;
      if (res.success && res.data) {
        setTaxParams(res.data);
      } else {
        setError(res.error || "Error cargando parámetros fiscales");
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [fetchAction]);

  return { taxParams, loading, error };
}
