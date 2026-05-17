"use client";

import { TrendingDown, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaxRowProps } from "../../types/tax/summary.types";

export function TaxRow({
  label,
  value,
  isNegative = false,
  isBold = false,
  hasIcon = null,
  className,
  children,
}: TaxRowProps) {
  const Icon = hasIcon === "up" ? TrendingUp : hasIcon === "down" ? TrendingDown : hasIcon === "info" ? Info : null;

  return (
    <div className={cn("flex justify-between items-center text-sm w-full", className)}>
      <div className="flex items-center gap-1 text-muted-foreground">
        {Icon && (
          <Icon
            className={cn(
              "w-3.5 h-3.5",
              hasIcon === "down" && "text-destructive",
              hasIcon === "up" && "text-primary",
              hasIcon === "info" && ""
            )}
          />
        )}
        <span className={cn(isBold && "font-medium text-foreground")}>{label}</span>
      </div>
      <span className={cn(isNegative && "text-destructive", isBold && "font-semibold")}>
        {value}
      </span>
      {children}
    </div>
  );
}
