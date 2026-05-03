"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  error?: string;
}

export function AuthInput({
  icon: Icon,
  className,
  error,
  id,
  ...props
}: AuthInputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-colors",
          "focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500",
          error
            ? "border-destructive/50 focus-within:border-destructive focus-within:ring-destructive/20"
            : "border-neutral-200",
          className
        )}
      >
        <Icon className="size-5 text-neutral-400 shrink-0" />
        <input
          id={inputId}
          className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}