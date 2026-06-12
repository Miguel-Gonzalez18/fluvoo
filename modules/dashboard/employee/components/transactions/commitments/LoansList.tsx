"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommitmentDueBadge } from "@/modules/dashboard/employee/components/transactions/commitments/CommitmentDueBadge";
import { LoanDetailSheet } from "@/modules/dashboard/employee/components/transactions/commitments/LoanDetailSheet";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { LoanCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface LoansListProps {
  items: LoanCommitmentItem[];
  total: number;
  className?: string;
}

export function LoansList({ items, total, className }: LoansListProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanCommitmentItem | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLoanClick = (loan: LoanCommitmentItem) => {
    setSelectedLoan(loan);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedLoan(null);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Préstamos
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatDOP(total)} · {items.length}{" "}
          {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Sin préstamos activos
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-label={`${item.label}, ${item.lenderLabel}, ${formatDOP(item.amount)}, ${item.dueStatus.dueLabel}`}
                onClick={() => handleLoanClick(item)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset cursor-pointer"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Landmark className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.lenderLabel}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {formatDOP(item.amount)}
                  </p>
                  <CommitmentDueBadge dueStatus={item.dueStatus} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <LoanDetailSheet
        loan={selectedLoan}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
      />
    </div>
  );
}
