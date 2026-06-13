"use client";

import { cn } from "@/lib/utils";
import {
  PAYMENT_CYCLE_STATUS_LABELS,
  type PaymentCycleStatus,
} from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";

const statusClassMap: Record<PaymentCycleStatus, string> = {
  projected: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  confirmed: "bg-primary/10 text-primary",
};

interface PaymentCycleBadgeProps {
  status: PaymentCycleStatus;
  className?: string;
}

export function PaymentCycleBadge({ status, className }: PaymentCycleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        statusClassMap[status],
        className
      )}
    >
      {PAYMENT_CYCLE_STATUS_LABELS[status]}
    </span>
  );
}
