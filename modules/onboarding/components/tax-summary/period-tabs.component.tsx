"use client";

import { cn } from "@/lib/utils";
import { PeriodTabsProps } from "../../types/tax/summary.types";

type PeriodOption = { value: "annual" | "monthly" | "biweekly"; label: string };

const PERIODS: PeriodOption[] = [
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" },
  { value: "annual", label: "Anual" },
];

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  return (
    <div className="flex bg-muted rounded-lg p-0.5">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
            period === p.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
