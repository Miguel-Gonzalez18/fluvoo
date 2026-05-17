"use client";

import { useState, useCallback } from "react";

export function useCurrencyInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const formatCurrency = useCallback((val: number | undefined) => {
    if (val === undefined || val === 0) return "";
    return val.toLocaleString("es-DO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const parseCurrency = useCallback((str: string): number => {
    if (!str) return 0;
    const cleaned = str.replace(/[^\d.,]/g, "");
    if (!cleaned) return 0;
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    onValueChange: (val: number) => void
  ) => {
    setInputValue(e.target.value);
    const parsed = parseCurrency(e.target.value);
    onValueChange(parsed);
  }, [parseCurrency]);

  const handleFocus = useCallback((value?: number) => {
    setIsFocused(true);
    setInputValue(value?.toString() || "");
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const getDisplayValue = useCallback((value?: number) => {
    return isFocused ? inputValue : formatCurrency(value);
  }, [isFocused, inputValue, formatCurrency]);

  return {
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    getDisplayValue,
  };
}
