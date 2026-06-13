"use server";

import { revalidatePath } from "next/cache";
import { creditCardSchema } from "@/modules/onboarding/lib/schemas/creditCardSchema";
import {
  CREDIT_CARD_PAYMENT_AFTER_CLOSE_MESSAGE,
  isPaymentDueAfterStatementClose,
} from "@/modules/dashboard/employee/lib/credit-card-dates";
import { createClient } from "@/src/lib/server";

function formatZodErrors(error: {
  issues: { message: string }[];
}): string {
  return error.issues.map((i) => i.message).join("; ");
}

export async function updateCreditCardTracking(input: {
  cardId: string;
  trackingEnabled: boolean;
  lastFour?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "No autenticado" };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("gmail_connected")
    .eq("id", user.id)
    .maybeSingle();

  if (input.trackingEnabled && !profile?.gmail_connected) {
    return {
      success: false,
      error: "Conecta Gmail en Configuración para activar el seguimiento",
    };
  }

  const lastFour = input.lastFour?.trim() ?? "";
  if (input.trackingEnabled && !/^\d{4}$/.test(lastFour)) {
    return {
      success: false,
      error: "Ingresa los últimos 4 dígitos de la tarjeta",
    };
  }

  if (input.trackingEnabled) {
    const { data: duplicate } = await supabase
      .from("credit_cards")
      .select("id")
      .eq("user_id", user.id)
      .eq("last_four", lastFour)
      .eq("tracking_enabled", true)
      .neq("id", input.cardId)
      .maybeSingle();

    if (duplicate) {
      return {
        success: false,
        error: "Esos 4 dígitos ya están en uso en otra tarjeta",
      };
    }
  }

  const { error } = await supabase
    .from("credit_cards")
    .update({
      tracking_enabled: input.trackingEnabled,
      last_four: input.trackingEnabled ? lastFour : null,
    })
    .eq("id", input.cardId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/employee/transactions");
  return { success: true };
}

export async function updateCreditCard(
  cardId: string,
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

  const parsed = creditCardSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: formatZodErrors(parsed.error) };
  }

  const card = parsed.data;

  const { error } = await supabase
    .from("credit_cards")
    .update({
      issuer_name: card.issuerName,
      card_label: card.cardLabel,
      currency_mode: card.currencyMode,
      credit_limit: card.creditLimit,
      current_balance: card.currentBalance,
      minimum_payment: card.minimumPayment,
      statement_balance: card.statementBalance,
      credit_limit_usd: card.creditLimitUsd ?? null,
      current_balance_usd: card.currentBalanceUsd ?? null,
      minimum_payment_usd: card.minimumPaymentUsd ?? null,
      statement_balance_usd: card.statementBalanceUsd,
      next_statement_close_date: card.nextStatementCloseDate,
      next_payment_due_date: card.nextPaymentDueDate,
      annual_rate: card.annualRate ?? null,
    })
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase
    .from("credit_card_installments")
    .delete()
    .eq("credit_card_id", cardId)
    .eq("user_id", user.id);

  if (card.installments.length > 0) {
    const { error: installmentError } = await supabase
      .from("credit_card_installments")
      .insert(
        card.installments.map((installment) => ({
          user_id: user.id,
          credit_card_id: cardId,
          description: installment.description || null,
          original_amount: installment.originalAmount,
          remaining_balance: installment.amountOwed,
          monthly_payment: installment.monthlyPayment,
          term_months: installment.termMonths,
          annual_rate: installment.annualRate,
          end_date: installment.endDate || null,
          start_date: installment.startDate || null,
          status: "active" as const,
        }))
      );

    if (installmentError) {
      return { success: false, error: installmentError.message };
    }
  }

  revalidatePath("/employee/transactions");
  return { success: true };
}

export async function deleteCreditCard(
  cardId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .from("credit_cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/employee/transactions");
  return { success: true };
}

export async function confirmCreditCardPayment(cycleId: string): Promise<{
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
    .from("credit_card_payment_cycles")
    .select("id, credit_card_id, expected_amount, status")
    .eq("id", cycleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (cycleError || !cycle) {
    return { success: false, error: "Cuota no encontrada" };
  }

  if (cycle.status === "confirmed") {
    return { success: true };
  }

  const { data: card, error: cardError } = await supabase
    .from("credit_cards")
    .select(
      "id, current_balance, statement_balance, minimum_payment, status"
    )
    .eq("id", cycle.credit_card_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (cardError || !card) {
    return { success: false, error: "Tarjeta no encontrada" };
  }

  const paymentAmount = Number(cycle.expected_amount);
  const newBalance = Math.max(
    0,
    Math.round((Number(card.current_balance) - paymentAmount) * 100) / 100
  );
  const newStatement = Math.max(
    0,
    Math.round((Number(card.statement_balance) - paymentAmount) * 100) / 100
  );

  const now = new Date().toISOString();

  const { error: cycleUpdateError } = await supabase
    .from("credit_card_payment_cycles")
    .update({
      status: "confirmed",
      confirmed_at: now,
      source: "user",
    })
    .eq("id", cycleId);

  if (cycleUpdateError) {
    return { success: false, error: cycleUpdateError.message };
  }

  const { error: cardUpdateError } = await supabase
    .from("credit_cards")
    .update({
      current_balance: newBalance,
      statement_balance: newStatement,
      minimum_payment: newStatement > 0 ? card.minimum_payment : 0,
    })
    .eq("id", cycle.credit_card_id);

  if (cardUpdateError) {
    return { success: false, error: cardUpdateError.message };
  }

  revalidatePath("/employee/transactions");
  return { success: true };
}

export async function dismissCreditCardPaymentReminder(_cycleId: string): Promise<{
  success: boolean;
}> {
  revalidatePath("/employee/transactions");
  return { success: true };
}

export interface ApplyStatementInput {
  cardId: string;
  storagePath: string;
  statementBalance: number;
  statementBalanceUsd: number;
  minimumPayment: number;
  currentBalance: number;
  nextStatementCloseDate?: string | null;
  nextPaymentDueDate?: string | null;
  parsedSnapshot: Record<string, unknown>;
}

export async function applyStatementUpload(
  input: ApplyStatementInput
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "No autenticado" };
  }

  if (
    input.nextStatementCloseDate &&
    input.nextPaymentDueDate &&
    !isPaymentDueAfterStatementClose(
      input.nextPaymentDueDate,
      input.nextStatementCloseDate
    )
  ) {
    return { success: false, error: CREDIT_CARD_PAYMENT_AFTER_CLOSE_MESSAGE };
  }

  const now = new Date().toISOString();

  const { error: uploadError } = await supabase
    .from("credit_card_statement_uploads")
    .insert({
      credit_card_id: input.cardId,
      user_id: user.id,
      storage_path: input.storagePath,
      applied_at: now,
      parsed_snapshot: input.parsedSnapshot,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  const cardUpdate: Record<string, unknown> = {
    statement_balance: input.statementBalance,
    statement_balance_usd: input.statementBalanceUsd,
    minimum_payment: input.minimumPayment,
    current_balance: input.currentBalance,
    last_statement_upload_at: now,
  };

  if (input.nextStatementCloseDate) {
    cardUpdate.next_statement_close_date = input.nextStatementCloseDate;
  }
  if (input.nextPaymentDueDate) {
    cardUpdate.next_payment_due_date = input.nextPaymentDueDate;
  }

  const { error: cardError } = await supabase
    .from("credit_cards")
    .update(cardUpdate)
    .eq("id", input.cardId)
    .eq("user_id", user.id);

  if (cardError) {
    return { success: false, error: cardError.message };
  }

  revalidatePath("/employee/transactions");
  return { success: true };
}

export async function getStatementUploadSignedUrl(
  cardId: string,
  fileName: string
): Promise<{ signedUrl: string; path: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "No autenticado" };
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${cardId}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("statement-uploads")
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { error: error?.message ?? "No se pudo preparar la subida" };
  }

  return { signedUrl: data.signedUrl, path };
}
