"use client";

import { useState, useEffect } from "react";
import { getTaxParameters } from "../../actions/tax-actions";
import { Tables } from "@/src/types/supabase";

type TaxParameters = Tables<"tax_parameters">;

interface UseTaxParametersReturn {
  taxParams: TaxParameters | null;
  loading: boolean;
  error: string | null;
}

export function useTaxParameters(): UseTaxParametersReturn {
  const [taxParams, setTaxParams] = useState<TaxParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getTaxParameters().then((res) => {
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
  }, []);

  return { taxParams, loading, error };
}
