export type PaymentCycleStatus = "projected" | "pending" | "confirmed";

export interface PaymentCycleItem {
  id: string;
  dueDate: string;
  expectedAmount: number;
  status: PaymentCycleStatus;
  confirmedAt: string | null;
}

export const PAYMENT_CYCLE_STATUS_LABELS: Record<PaymentCycleStatus, string> = {
  projected: "Estimado",
  pending: "Pendiente",
  confirmed: "Confirmado",
};
