"use client";

import { cn } from "@/lib/utils";
import { TaxToggleProps } from "../../types/tax/summary.types";

export function TaxToggle({ label, description, checked, onChange }: TaxToggleProps) {
  return (
    <div className="flex items-center justify-between pt-1 pb-1">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
