import { cn } from "@/lib/utils";
import { CommitmentDueBadge } from "@/modules/dashboard/employee/components/transactions/commitments/CommitmentDueBadge";
import { getObligationIcon } from "@/modules/dashboard/employee/components/transactions/commitments/obligation-icons";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { FixedCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface FixedObligationsListProps {
  items: FixedCommitmentItem[];
  total: number;
  className?: string;
}

export function FixedObligationsList({
  items,
  total,
  className,
}: FixedObligationsListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Hogar y servicios
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatDOP(total)} · {items.length}{" "}
          {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Sin obligaciones fijas registradas
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {items.map((item) => {
            const Icon = getObligationIcon(item.obligationType);
            return (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    {item.provider ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {item.provider}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {formatDOP(item.amount)}
                  </p>
                  <CommitmentDueBadge dueStatus={item.dueStatus} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
