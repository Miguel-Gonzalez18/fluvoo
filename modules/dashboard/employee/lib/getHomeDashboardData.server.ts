import { mapTransactionToRecent } from "@/modules/dashboard/employee/lib/mapTransactionToRecent";
import type {
  GmailStatus,
  GmailSyncStatus,
  HomeDashboardData,
} from "@/modules/dashboard/employee/types/dashboard.types";
import { createAdminClient } from "@/src/lib/admin";
import { createClient } from "@/src/lib/server";

const EMPTY_GMAIL_STATUS: GmailStatus = {
  connected: false,
  googleEmail: null,
  syncStatus: null,
  lastSyncAt: null,
  syncError: null,
};

const EMPTY_DASHBOARD_DATA: HomeDashboardData = {
  netIncome: {
    value: 0,
    subtext: "Sin datos de salario",
    hasSalary: false,
  },
  recentTransactions: [],
  gmailStatus: EMPTY_GMAIL_STATUS,
};

const GMAIL_SYNC_STATUSES = new Set<GmailSyncStatus>([
  "pending",
  "syncing",
  "active",
  "error",
]);

function parseGmailSyncStatus(value: string | null | undefined): GmailSyncStatus | null {
  if (!value || !GMAIL_SYNC_STATUSES.has(value as GmailSyncStatus)) {
    return null;
  }

  return value as GmailSyncStatus;
}

async function getGmailStatus(
  userId: string,
  gmailConnected: boolean | null
): Promise<GmailStatus> {
  if (!gmailConnected) {
    return EMPTY_GMAIL_STATUS;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("gmail_connections")
      .select("google_email, sync_status, last_sync_at, sync_error")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return {
        connected: true,
        googleEmail: null,
        syncStatus: null,
        lastSyncAt: null,
        syncError: null,
      };
    }

    return {
      connected: true,
      googleEmail: data.google_email,
      syncStatus: parseGmailSyncStatus(data.sync_status),
      lastSyncAt: data.last_sync_at,
      syncError: data.sync_error,
    };
  } catch {
    return {
      connected: Boolean(gmailConnected),
      googleEmail: null,
      syncStatus: null,
      lastSyncAt: null,
      syncError: null,
    };
  }
}

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
        .limit(4),
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
