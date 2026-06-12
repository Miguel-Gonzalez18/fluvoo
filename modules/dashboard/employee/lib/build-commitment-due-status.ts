import { computeNextDueDate } from "./computeNextDueDate";
import type { CommitmentDueStatus } from "@/modules/dashboard/employee/types/transactions.types";

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function buildCommitmentDueStatus(
  paymentDueDay: number,
  referenceDate: Date = new Date()
): CommitmentDueStatus {
  const dueDate = computeNextDueDate(paymentDueDay, referenceDate);
  const today = startOfDay(referenceDate);
  const due = startOfDay(dueDate);
  const diffDays = Math.round(
    (due.getTime() - today.getTime()) / 86_400_000
  );

  let urgency: CommitmentDueStatus["urgency"] = "ok";
  if (diffDays <= 3) {
    urgency = "urgent";
  } else if (diffDays <= 7) {
    urgency = "soon";
  }

  let dueLabel: string;
  if (diffDays < 0) {
    dueLabel = `Vencido hace ${Math.abs(diffDays)} d`;
  } else if (diffDays === 0) {
    dueLabel = "Vence hoy";
  } else if (diffDays === 1) {
    dueLabel = "Vence mañana";
  } else if (diffDays <= 7) {
    dueLabel = `En ${diffDays} días`;
  } else {
    dueLabel = `Día ${paymentDueDay}`;
  }

  return {
    urgency,
    dueDay: paymentDueDay,
    dueLabel,
  };
}
