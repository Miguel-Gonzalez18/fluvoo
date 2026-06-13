"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/shared/components/ui/button";
import { PaymentCycleBadge } from "@/modules/dashboard/employee/components/transactions/commitments/PaymentCycleBadge";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { PaymentCycleItem } from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";

function formatCycleDate(dueDate: string): string {
  const date = new Date(`${dueDate}T12:00:00`);
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santo_Domingo",
  }).format(date);
}

interface PaymentCycleConfirmSectionProps {
  nextCycle: PaymentCycleItem | null;
  confirmedCycles: PaymentCycleItem[];
  onConfirm: (cycleId: string) => Promise<{ success: boolean; error?: string }>;
  onDismiss?: (cycleId: string) => Promise<{ success: boolean }>;
  amountLabel?: string;
}

export function PaymentCycleConfirmSection({
  nextCycle,
  confirmedCycles,
  onConfirm,
  onDismiss,
  amountLabel = "Cuota",
}: PaymentCycleConfirmSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleConfirm = (cycleId: string) => {
    startTransition(async () => {
      const result = await onConfirm(cycleId);
      if (result.success) router.refresh();
    });
  };

  const handleDismiss = (cycleId: string) => {
    if (!onDismiss) return;
    startTransition(async () => {
      await onDismiss(cycleId);
      router.refresh();
    });
  };

  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Seguimiento de pagos
      </p>

      {nextCycle ? (
        <div className="rounded-md border border-border bg-muted/30 px-3 py-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground">
                Próxima {amountLabel.toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCycleDate(nextCycle.dueDate)} ·{" "}
                {formatDOP(nextCycle.expectedAmount)}
              </p>
            </div>
            <PaymentCycleBadge status={nextCycle.status} />
          </div>

          {nextCycle.status === "pending" && (
            <div className="space-y-2">
              <p className="text-sm text-foreground">¿Ya pagaste?</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleConfirm(nextCycle.id)}
                >
                  Sí, ya pagué
                </Button>
                {onDismiss && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleDismiss(nextCycle.id)}
                  >
                    Aún no
                  </Button>
                )}
              </div>
            </div>
          )}

          {nextCycle.status === "projected" && (
            <p className="text-xs text-muted-foreground">
              Fecha estimada según tu calendario. El saldo no cambia hasta que
              confirmes el pago.
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay cuotas pendientes en el calendario.
        </p>
      )}

      {confirmedCycles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Cuotas confirmadas</p>
          <ul className="space-y-1">
            {confirmedCycles.slice(0, 6).map((cycle) => (
              <li
                key={cycle.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <span className="text-muted-foreground">
                  {formatCycleDate(cycle.dueDate)}
                </span>
                <span className="font-medium text-foreground">
                  {formatDOP(cycle.expectedAmount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
