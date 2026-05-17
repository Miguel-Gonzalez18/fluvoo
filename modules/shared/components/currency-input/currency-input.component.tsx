"use client";

import { Input } from "@/modules/shared/components/ui/input";
import { CurrencyInputProps } from "./currency-input.types";
import { useCurrencyInput } from "./currency-input.hooks";

export function CurrencyInput({ id, value, onChange, placeholder }: CurrencyInputProps) {
  const { handleChange, handleFocus, handleBlur, getDisplayValue } = useCurrencyInput(value);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        RD$
      </span>
      <Input
        id={id}
        type="text"
        placeholder={placeholder || "0.00"}
        className="pl-12"
        value={getDisplayValue(value)}
        onChange={(e) => handleChange(e, onChange)}
        onBlur={handleBlur}
        onFocus={() => handleFocus(value)}
      />
    </div>
  );
}
