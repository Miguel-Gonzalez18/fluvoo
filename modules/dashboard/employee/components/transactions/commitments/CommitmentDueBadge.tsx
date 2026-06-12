import { cn } from "@/lib/utils";
import type { CommitmentDueStatus } from "@/modules/dashboard/employee/types/transactions.types";

const urgencyClassMap: Record<CommitmentDueStatus["urgency"], string> = {
  ok: "bg-muted text-muted-foreground",
  soon: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  urgent: "bg-destructive/10 text-destructive",
};

interface CommitmentDueBadgeProps {
  dueStatus: CommitmentDueStatus;
  className?: string;
}

export function CommitmentDueBadge({
  dueStatus,
  className,
}: CommitmentDueBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-md px-2 py-0.5 font-label text-[10px] font-semibold uppercase tracking-wide",
        urgencyClassMap[dueStatus.urgency],
        className
      )}
    >
      {dueStatus.dueLabel}
    </span>
  );
}
