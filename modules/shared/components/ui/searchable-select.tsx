"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  showOtherInput?: boolean;
  otherPlaceholder?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  className,
  disabled = false,
  showOtherInput = true,
  otherPlaceholder = "Especificar...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOtherSelected = value === "Otros" || value === "Otra" || options.every(opt => opt.label !== value);
  const selectedLabel = options.find((opt) => opt.label === value)?.label || (isOtherSelected && value !== "Otros" && value !== "Otra" ? value : "");

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const handleSelect = (label: string) => {
    onChange(label);
    setSearchTerm("");
    setIsOpen(false);
    if (label !== "Otros" && label !== "Otra") {
      setOtherValue("");
    }
  };

  const handleOtherChange = (newValue: string) => {
    setOtherValue(newValue);
    onChange(newValue);
  };

  const clearSelection = () => {
    onChange("");
    setOtherValue("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          disabled && "cursor-not-allowed opacity-50",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {/* Search Input */}
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.label)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    selectedLabel === option.label && "bg-accent text-accent-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Other Input */}
      {showOtherInput && isOtherSelected && value && (
        <div className="mt-2">
          <Input
            placeholder={otherPlaceholder}
            value={otherValue || (value !== "Otros" && value !== "Otra" ? value : "")}
            onChange={(e) => handleOtherChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      )}
    </div>
  );
}
