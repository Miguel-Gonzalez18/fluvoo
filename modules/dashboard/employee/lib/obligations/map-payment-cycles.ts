import type { PaymentCycleItem } from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";

export function mapDbCycleToItem(row: {
  id: string;
  due_date: string;
  expected_amount: number;
  status: PaymentCycleItem["status"];
  confirmed_at: string | null;
}): PaymentCycleItem {
  return {
    id: row.id,
    dueDate: row.due_date,
    expectedAmount: row.expected_amount,
    status: row.status,
    confirmedAt: row.confirmed_at,
  };
}

export function pickNextPaymentCycle(
  cycles: PaymentCycleItem[]
): PaymentCycleItem | null {
  const open = cycles.filter((c) => c.status !== "confirmed");
  if (open.length === 0) return null;
  return open.sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0] ?? null;
}

export function pickConfirmedCycles(
  cycles: PaymentCycleItem[]
): PaymentCycleItem[] {
  return cycles
    .filter((c) => c.status === "confirmed")
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}
