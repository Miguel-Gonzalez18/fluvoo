import { createAdminClient } from "@/src/lib/admin";
import type { PaymentCycleStatus } from "@/modules/dashboard/employee/lib/obligations/payment-cycle.types";

interface LoanRow {
  id: string;
  monthly_payment: number;
  payment_due_day: number | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
}

function parseYmd(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

function formatYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function clampDueDay(year: number, month: number, dueDay: number): number {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Math.min(dueDay, daysInMonth);
}

function buildDueDates(
  startDate: string,
  endDate: string,
  paymentDueDay: number
): string[] {
  const start = parseYmd(startDate);
  const end = parseYmd(endDate);
  const dates: string[] = [];

  let year = start.year;
  let month = start.month;

  while (year < end.year || (year === end.year && month <= end.month)) {
    const day = clampDueDay(year, month, paymentDueDay);
    const due = formatYmd(year, month, day);
    if (due >= startDate && due <= endDate) {
      dates.push(due);
    }
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return dates;
}

function resolveCycleStatus(dueDate: string, todayYmd: string): PaymentCycleStatus {
  if (dueDate > todayYmd) return "projected";
  return "pending";
}

export function getTodayYmdInSantoDomingo(reference: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(reference);

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export async function ensureLoanPaymentCycles(
  userId: string,
  loans: LoanRow[],
  referenceDate: Date = new Date()
): Promise<void> {
  const admin = createAdminClient();
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);

  for (const loan of loans) {
    if (loan.status !== "active" || !loan.payment_due_day) continue;
    if (!loan.start_date || !loan.end_date) continue;

    const dueDates = buildDueDates(
      loan.start_date,
      loan.end_date,
      loan.payment_due_day
    );

    for (const dueDate of dueDates) {
      const { data: existing } = await admin
        .from("loan_payment_cycles")
        .select("id, status")
        .eq("loan_id", loan.id)
        .eq("due_date", dueDate)
        .maybeSingle();

      if (existing) {
        if (
          existing.status === "projected" &&
          resolveCycleStatus(dueDate, todayYmd) === "pending"
        ) {
          await admin
            .from("loan_payment_cycles")
            .update({ status: "pending" })
            .eq("id", existing.id);
        }
        continue;
      }

      const status = resolveCycleStatus(dueDate, todayYmd);
      await admin.from("loan_payment_cycles").insert({
        loan_id: loan.id,
        user_id: userId,
        due_date: dueDate,
        expected_amount: loan.monthly_payment,
        status,
      });
    }
  }
}

export async function syncLoanCycleStatuses(
  userId: string,
  referenceDate: Date = new Date()
): Promise<void> {
  const admin = createAdminClient();
  const todayYmd = getTodayYmdInSantoDomingo(referenceDate);

  const { data: cycles } = await admin
    .from("loan_payment_cycles")
    .select("id, due_date, status")
    .eq("user_id", userId)
    .eq("status", "projected");

  if (!cycles?.length) return;

  for (const cycle of cycles) {
    if (cycle.due_date <= todayYmd) {
      await admin
        .from("loan_payment_cycles")
        .update({ status: "pending" })
        .eq("id", cycle.id);
    }
  }
}

export async function loadLoanPaymentCyclesByLoanIds(
  loanIds: string[]
): Promise<
  Map<
    string,
    Array<{
      id: string;
      due_date: string;
      expected_amount: number;
      status: PaymentCycleStatus;
      confirmed_at: string | null;
    }>
  >
> {
  const result = new Map<
    string,
    Array<{
      id: string;
      due_date: string;
      expected_amount: number;
      status: PaymentCycleStatus;
      confirmed_at: string | null;
    }>
  >();

  if (loanIds.length === 0) return result;

  const admin = createAdminClient();
  const { data } = await admin
    .from("loan_payment_cycles")
    .select("id, loan_id, due_date, expected_amount, status, confirmed_at")
    .in("loan_id", loanIds)
    .order("due_date", { ascending: true });

  for (const row of data ?? []) {
    const list = result.get(row.loan_id) ?? [];
    list.push({
      id: row.id,
      due_date: row.due_date,
      expected_amount: Number(row.expected_amount),
      status: row.status as PaymentCycleStatus,
      confirmed_at: row.confirmed_at,
    });
    result.set(row.loan_id, list);
  }

  return result;
}
