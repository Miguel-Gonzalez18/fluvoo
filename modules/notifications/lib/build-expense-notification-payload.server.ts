import { loadFiscalAnalysisContextForUser } from "@/modules/dashboard/employee/lib/load-fiscal-analysis-context.server";
import { getProfileHomePath } from "@/modules/dashboard/shared/profile-routes";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { ExpenseNotificationPayload } from "@/modules/notifications/types/notification.types";
import {
  getCategoryLabel,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import { createAdminClient } from "@/src/lib/admin";

function resolveAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

function formatExpenseDate(value: string): string {
  return new Intl.DateTimeFormat("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function buildExpenseNotificationPayload(
  userId: string,
  transactionIds: string[]
): Promise<ExpenseNotificationPayload | null> {
  if (transactionIds.length === 0) return null;

  const admin = createAdminClient();

  const [userResult, transactionsResult, insightResult] = await Promise.all([
    admin
      .from("users")
      .select("email, full_name, profile_type")
      .eq("id", userId)
      .maybeSingle(),
    admin
      .from("transactions")
      .select(
        "id, merchant_name, description, amount, expense_category, transaction_date"
      )
      .eq("user_id", userId)
      .in("id", transactionIds)
      .order("transaction_date", { ascending: false }),
    admin
      .from("user_ai_insights")
      .select("diagnosis, tips")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (!userResult.data?.email) return null;
  if (!transactionsResult.data?.length) return null;

  const fiscalContext = await loadFiscalAnalysisContextForUser(userId);
  if (!fiscalContext) return null;

  const marginPercent =
    fiscalContext.netIncomeMonthly > 0
      ? Math.round(
          (fiscalContext.marginMonthly / fiscalContext.netIncomeMonthly) * 1000
        ) / 10
      : null;

  const profilePath = getProfileHomePath(userResult.data.profile_type) ?? "/employee";
  const deepLink = `${resolveAppUrl()}${profilePath}`;

  const tips = Array.isArray(insightResult.data?.tips)
    ? (insightResult.data.tips as Array<{
        title?: string;
        description?: string;
      }>)
    : [];

  const firstTip = tips[0];

  return {
    newExpenses: transactionsResult.data.map((row) => ({
      merchant:
        row.merchant_name?.trim() ||
        row.description?.trim() ||
        "Comercio desconocido",
      amountDop: Number(row.amount),
      categoryLabel: row.expense_category
        ? getCategoryLabel(row.expense_category as ExpenseCategorySlug)
        : "Otros",
      date: formatExpenseDate(row.transaction_date),
    })),
    aiDiagnosis:
      insightResult.data?.diagnosis ??
      `Tus gastos del mes suman ${formatDOP(fiscalContext.expensesThisMonth)}.`,
    aiTopTip:
      firstTip?.title && firstTip?.description
        ? { title: firstTip.title, description: firstTip.description }
        : null,
    monthlyExpenses: fiscalContext.expensesThisMonth,
    marginMonthly: fiscalContext.marginMonthly,
    marginPercent,
    marginStatus: fiscalContext.marginStatus,
    deepLink,
    recipientEmail: userResult.data.email,
    recipientName: userResult.data.full_name,
  };
}
