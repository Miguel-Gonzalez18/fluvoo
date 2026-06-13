"use server";

import { revalidatePath } from "next/cache";
import { loanSchema } from "@/modules/onboarding/lib/schemas/loanSchema";
import { createClient } from "@/src/lib/server";

function formatZodErrors(error: {
  issues: { message: string }[];
}): string {
  return error.issues.map((i) => i.message).join("; ");
}

export async function updateLoan(
  loanId: string,
  payload: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "No autenticado" };
  }

  const parsed = loanSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: formatZodErrors(parsed.error) };
  }

  const loan = parsed.data;

  const { error } = await supabase
    .from("loans")
    .update({
      loan_alias: loan.loanAlias,
      loan_type: loan.loanType,
      lender_name: loan.lenderName,
      original_amount: loan.originalAmount,
      annual_rate: loan.annualRate,
      term_months: loan.termMonths,
      monthly_payment: loan.monthlyPayment,
      payment_due_day: loan.paymentDueDay,
      start_date: loan.startDate,
      end_date: loan.endDate,
      current_balance: loan.currentBalance,
    })
    .eq("id", loanId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/employee/transactions");
  revalidatePath("/employee");
  return { success: true };
}

export async function confirmLoanPayment(cycleId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: cycle, error: cycleError } = await supabase
    .from("loan_payment_cycles")
    .select("id, loan_id, expected_amount, status")
    .eq("id", cycleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (cycleError || !cycle) {
    return { success: false, error: "Cuota no encontrada" };
  }

  if (cycle.status === "confirmed") {
    return { success: true };
  }

  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .select("id, current_balance, original_amount, status")
    .eq("id", cycle.loan_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loanError || !loan) {
    return { success: false, error: "Préstamo no encontrado" };
  }

  const paymentAmount = Number(cycle.expected_amount);
  const currentBalance =
    loan.current_balance != null
      ? Number(loan.current_balance)
      : Number(loan.original_amount);
  const newBalance = Math.max(
    0,
    Math.round((currentBalance - paymentAmount) * 100) / 100
  );

  const now = new Date().toISOString();

  const { error: cycleUpdateError } = await supabase
    .from("loan_payment_cycles")
    .update({
      status: "confirmed",
      confirmed_at: now,
      source: "user",
    })
    .eq("id", cycleId);

  if (cycleUpdateError) {
    return { success: false, error: cycleUpdateError.message };
  }

  const loanUpdate: {
    current_balance: number;
    status?: "paid_off" | "active";
  } = { current_balance: newBalance };

  if (newBalance <= 0) {
    loanUpdate.status = "paid_off";
  }

  const { error: loanUpdateError } = await supabase
    .from("loans")
    .update(loanUpdate)
    .eq("id", cycle.loan_id);

  if (loanUpdateError) {
    return { success: false, error: loanUpdateError.message };
  }

  revalidatePath("/employee/transactions");
  revalidatePath("/employee");
  return { success: true };
}

export async function dismissLoanPaymentReminder(_cycleId: string): Promise<{
  success: boolean;
}> {
  revalidatePath("/employee/transactions");
  return { success: true };
}
