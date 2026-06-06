"use server";

import { createClient } from "@/src/lib/server";
import { OnboardingData } from "../types/onboarding";

/**
 * Save onboarding data to the database
 * TODO: Implement this function after setting up the database tables
 */
export async function saveOnboardingData(data: OnboardingData) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // 1. Update users table with profile data (never wipe profile_type with null from client state)
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
    .from('users')
    .update(userUpdate)
    .eq('id', user.id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  // 2. Insert health insurances
  if (data.healthInsurances.length > 0) {
    const { error: insuranceError } = await supabase
      .from('health_insurances')
      .insert(
        data.healthInsurances.map(insurance => ({
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

  // 3. Insert loans
  if (data.loans.length > 0) {
    const { error: loanError } = await supabase
      .from('loans')
      .insert(
        data.loans.map(loan => ({
          user_id: user.id,
          loan_type: loan.loanType,
          lender_name: loan.lenderName,
          original_amount: loan.originalAmount,
          annual_rate: loan.annualRate,
          term_months: loan.termMonths,
          monthly_payment: loan.monthlyPayment,
          start_date: loan.startDate,
        }))
      );

    if (loanError) {
      return { success: false, error: loanError.message };
    }
  }

  return { success: true };
}

/**
 * Complete onboarding and mark user as onboarded
 * TODO: Implement this function after setting up the database tables
 */
export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // First save all onboarding data
  const saveResult = await saveOnboardingData(data);
  if (!saveResult.success) {
    return saveResult;
  }

  // Mark onboarding as completed
  const { error } = await supabase
    .from('users')
    .update({
      onboarding_completed: true,
      onboarding_step: 3,
      gmail_connected: data.gmailConnected,
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Check if user has completed onboarding
 * TODO: Implement this function after setting up the database tables
 */
export async function checkOnboardingStatus() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { completed: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  if (error) {
    return { completed: false, error: error.message };
  }

  return { completed: data?.onboarding_completed ?? false };
}

