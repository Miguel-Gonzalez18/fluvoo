import { mapTransactionToRecent } from "@/modules/dashboard/employee/lib/mapTransactionToRecent";
import type { HomeDashboardData } from "@/modules/dashboard/employee/types/dashboard.types";
import {
  EMPTY_GMAIL_STATUS,
  getGmailStatus,
} from "@/modules/gmail/lib/get-gmail-status.server";
import { createClient } from "@/src/lib/server";

export const RECENT_TRANSACTIONS_LIMIT = 15;

const EMPTY_DASHBOARD_DATA: HomeDashboardData = {
  netIncome: {
    value: 0,
    subtext: "Sin datos de salario",
    hasSalary: false,
  },
  recentTransactions: [],
  gmailStatus: EMPTY_GMAIL_STATUS,
};

export async function getHomeDashboardData(): Promise<HomeDashboardData> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return EMPTY_DASHBOARD_DATA;
    }

    const [profileResult, transactionsResult] = await Promise.all([
      supabase
        .from("users")
        .select("monthly_salary, monthly_tss_deduction, gmail_connected")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("transactions")
        .select(
          "id, merchant_name, amount, transaction_date, transaction_type, bank_name, description"
        )
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .limit(RECENT_TRANSACTIONS_LIMIT),
    ]);

    const profile = profileResult.data;
    const salary = profile?.monthly_salary ?? 0;
    const tssDeduction = profile?.monthly_tss_deduction ?? 0;
    const hasSalary = salary > 0;
    const netIncomeValue = hasSalary ? salary - tssDeduction : 0;

    const resolvedGmailStatus = await getGmailStatus(
      user.id,
      profile?.gmail_connected ?? null
    );

    if (transactionsResult.error) {
      return {
        netIncome: {
          value: netIncomeValue,
          subtext: hasSalary
            ? "Salario mensual − deducciones TSS"
            : "Configura tu salario en el perfil",
          hasSalary,
        },
        recentTransactions: [],
        gmailStatus: resolvedGmailStatus,
      };
    }

    return {
      netIncome: {
        value: netIncomeValue,
        subtext: hasSalary
          ? "Salario mensual − deducciones TSS"
          : "Configura tu salario en el perfil",
        hasSalary,
      },
      recentTransactions: (transactionsResult.data ?? []).map(mapTransactionToRecent),
      gmailStatus: resolvedGmailStatus,
    };
  } catch {
    return EMPTY_DASHBOARD_DATA;
  }
}
