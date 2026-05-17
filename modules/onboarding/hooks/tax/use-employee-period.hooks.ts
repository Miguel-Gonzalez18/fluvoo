"use client";

import { useState, useMemo, useCallback } from "react";
import { PeriodType, PeriodConfig } from "../../types/tax/employee.types";

const PERIOD_CONFIGS: Record<PeriodType, PeriodConfig> = {
  annual: { multiplier: 1, label: "anual" },
  monthly: { multiplier: 1 / 12, label: "mensual" },
  biweekly: { multiplier: 1 / 24, label: "quincenal" },
};

interface UseEmployeePeriodReturn {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  periodConfig: PeriodConfig;
}

export function useEmployeePeriod(): UseEmployeePeriodReturn {
  const [period, setPeriod] = useState<PeriodType>("monthly");

  const periodConfig = useMemo(() => PERIOD_CONFIGS[period], [period]);

  const handleSetPeriod = useCallback((newPeriod: PeriodType) => {
    setPeriod(newPeriod);
  }, []);

  return {
    period,
    setPeriod: handleSetPeriod,
    periodConfig,
  };
}
