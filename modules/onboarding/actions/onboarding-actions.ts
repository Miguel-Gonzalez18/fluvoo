"use server";

import { createClient } from "@/src/lib/server";
import { OnboardingData } from "../types/onboarding";
import {
  loanSchema,
  fixedObligationSchema,
  creditCardSchema,
  creditCardInstallmentSchema,
} from "../lib/schemas";

function formatZodErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  return error.issues.map((i) => i.message).join("; ");
}

export async function saveOnboardingData(data: OnboardingData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const userUpdate: Record<string, unknown> = {
    monthly_salary: data.monthlySalary,
    employer_name: data.employerName,
    contributes_sipen: data.contributesSipen ?? true,
    contributes_afp: data.contributesAfp ?? true,
    average_monthly_income: data.averageMonthlyIncome,
    profession_sector: data.professionSector,
    business_monthly_revenue: data.businessMonthlyRevenue,
    business_name: data.businessName,
    business_type: data.businessType,
    employee_count: data.employeeCount,
    business_rnc: data.businessRnc,
    onboarding_step: 3,
  };

  if (data.profileType) {
    userUpdate.profile_type = data.profileType;
  }

  const { error: userError } = await supabase
    .from("users")
    .update(userUpdate)
    .eq("id", user.id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  if (data.healthInsurances.length > 0) {
    const { error: insuranceError } = await supabase
      .from("health_insurances")
      .insert(
        data.healthInsurances.map((insurance) => ({
          user_id: user.id,
          ars_name: insurance.arsName,
          plan_type: insurance.planType,
          monthly_premium: insurance.monthlyPremium,
        }))
      );

    if (insuranceError) {
      return { success: false, error: insuranceError.message };
    }
  }

  if (data.fixedObligations.length > 0) {
    for (const obligation of data.fixedObligations) {
      const parsed = fixedObligationSchema.safeParse(obligation);
      if (!parsed.success) {
        return { success: false, error: formatZodErrors(parsed.error) };
      }
    }

    const { error: obligationError } = await supabase.from("fixed_obligations").insert(
      data.fixedObligations.map((obligation) => ({
        user_id: user.id,
        obligation_type: obligation.obligationType,
        name: obligation.name,
        provider_name: obligation.providerName || null,
        payment_amount: obligation.paymentAmount,
        payment_frequency: obligation.paymentFrequency,
        monthly_amount: obligation.monthlyAmount,
        payment_due_day: obligation.paymentDueDay,
        status: "active" as const,
      }))
    );

    if (obligationError) {
      return { success: false, error: obligationError.message };
    }
  }

  if (data.creditCards.length > 0) {
    for (const card of data.creditCards) {
      const parsed = creditCardSchema.safeParse(card);
      if (!parsed.success) {
        return { success: false, error: formatZodErrors(parsed.error) };
      }
      for (const installment of card.installments) {
        const installmentParsed = creditCardInstallmentSchema.safeParse({
          ...installment,
          creditCardId: card.id,
        });
        if (!installmentParsed.success) {
          return { success: false, error: formatZodErrors(installmentParsed.error) };
        }
      }
    }

    for (const card of data.creditCards) {
      const { data: insertedCard, error: cardError } = await supabase
        .from("credit_cards")
        .insert({
          user_id: user.id,
          issuer_name: card.issuerName,
          card_label: card.cardLabel || null,
          currency_mode: card.currencyMode,
          credit_limit: card.creditLimit,
          current_balance: card.currentBalance,
          minimum_payment: card.minimumPayment,
          credit_limit_usd: card.creditLimitUsd ?? null,
          current_balance_usd: card.currentBalanceUsd ?? null,
          minimum_payment_usd: card.minimumPaymentUsd ?? null,
          statement_close_day: card.statementCloseDay,
          payment_due_day: card.paymentDueDay,
          annual_rate: card.annualRate ?? null,
          status: "active",
        })
        .select("id")
        .single();

      if (cardError || !insertedCard) {
        return { success: false, error: cardError?.message ?? "Error al guardar tarjeta" };
      }

      if (card.installments.length > 0) {
        const { error: installmentError } = await supabase
          .from("credit_card_installments")
          .insert(
            card.installments.map((installment) => ({
              user_id: user.id,
              credit_card_id: insertedCard.id,
              description: installment.description || null,
              original_amount: installment.originalAmount,
              remaining_balance: installment.originalAmount,
              monthly_payment: installment.monthlyPayment,
              term_months: installment.termMonths,
              annual_rate: installment.annualRate,
              end_date: installment.endDate || null,
              start_date: installment.startDate || null,
              statement_close_day: installment.statementCloseDay,
              payment_due_day: installment.paymentDueDay,
              status: "active" as const,
            }))
          );

        if (installmentError) {
          return { success: false, error: installmentError.message };
        }
      }
    }
  }

  if (data.loans.length > 0) {
    for (const loan of data.loans) {
      const parsed = loanSchema.safeParse(loan);
      if (!parsed.success) {
        return { success: false, error: formatZodErrors(parsed.error) };
      }
    }

    const { error: loanError } = await supabase.from("loans").insert(
      data.loans.map((loan) => ({
        user_id: user.id,
        loan_type: loan.loanType,
        lender_name: loan.lenderName,
        original_amount: loan.originalAmount,
        annual_rate: loan.annualRate,
        term_months: loan.termMonths,
        monthly_payment: loan.monthlyPayment,
        payment_due_day: loan.paymentDueDay,
        start_date: loan.startDate,
        end_date: loan.endDate,
        status: "active" as const,
      }))
    );

    if (loanError) {
      return { success: false, error: loanError.message };
    }
  }

  return { success: true };
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const saveResult = await saveOnboardingData(data);
  if (!saveResult.success) {
    return saveResult;
  }

  const { error } = await supabase
    .from("users")
    .update({
      onboarding_completed: true,
      onboarding_step: 3,
      gmail_connected: data.gmailConnected,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function checkOnboardingStatus() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { completed: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("users")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (error) {
    return { completed: false, error: error.message };
  }

  return { completed: data?.onboarding_completed ?? false };
}
