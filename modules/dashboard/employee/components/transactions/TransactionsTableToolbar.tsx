"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { Input } from "@/modules/shared/components/ui/input";
import { Label } from "@/modules/shared/components/ui/label";
import type { TransactionSort } from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionsTableToolbarProps {
  className?: string;
}

const SORT_LABELS: Record<TransactionSort, string> = {
  recent: "Más reciente",
  oldest: "Más antiguo",
  "amount-high": "Monto más alto",
  "amount-low": "Monto más bajo",
};

export function TransactionsTableToolbar({
  className,
}: TransactionsTableToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSort = (searchParams.get("sort") as TransactionSort) || "recent";
  const currentQuery = searchParams.get("q") ?? "";
  const currentMin = searchParams.get("minAmount") ?? "";
  const currentMax = searchParams.get("maxAmount") ?? "";

  const [query, setQuery] = useState(currentQuery);
  const [minAmount, setMinAmount] = useState(currentMin);
  const [maxAmount, setMaxAmount] = useState(currentMax);

  useEffect(() => {
    setQuery(currentQuery);
    setMinAmount(currentMin);
    setMaxAmount(currentMax);
  }, [currentQuery, currentMin, currentMax]);

  const pushParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      params.delete("page");

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (query !== currentQuery) {
        pushParams({ q: query || null });
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [query, currentQuery, pushParams]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por comercio, monto o cuenta..."
          className="h-10 pl-9"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="size-4" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={currentSort}
            onValueChange={(value) =>
              pushParams({ sort: value as TransactionSort })
            }
          >
            {(Object.keys(SORT_LABELS) as TransactionSort[]).map((key) => (
              <DropdownMenuRadioItem key={key} value={key}>
                {SORT_LABELS[key]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Rango de monto</DropdownMenuLabel>
          <div className="space-y-2 px-2 py-1.5">
            <div className="space-y-1">
              <Label htmlFor="min-amount" className="text-xs">
                Mínimo
              </Label>
              <Input
                id="min-amount"
                type="number"
                min={0}
                value={minAmount}
                onChange={(event) => setMinAmount(event.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-amount" className="text-xs">
                Máximo
              </Label>
              <Input
                id="max-amount"
                type="number"
                min={0}
                value={maxAmount}
                onChange={(event) => setMaxAmount(event.target.value)}
                placeholder="999999"
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={() =>
                pushParams({
                  minAmount: minAmount || null,
                  maxAmount: maxAmount || null,
                })
              }
            >
              Aplicar rango
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
