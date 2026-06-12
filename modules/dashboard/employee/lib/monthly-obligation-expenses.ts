import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";
import { resolveExpenseCategory } from "@/modules/shared/lib/resolve-expense-category";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import type { FinancialObligationsSnapshot } from "./financial-obligations.types";
import { isObligationActiveForMonth } from "./computeNextDueDate";
import { resolveCardPaymentTotalInDop } from "./resolve-card-payment-total";
import { buildCategoryExpense } from "@/modules/shared/lib/build-category-expense";
import type { CategoryColorMap } from "@/modules/shared/lib/expense-category-colors.types";

function addCategoryAmount(
  totals: Map<ExpenseCategorySlug, number>,
  slug: ExpenseCategorySlug,
  amount: number
) {
  if (amount <= 0) return;
  totals.set(slug, (totals.get(slug) ?? 0) + amount);
}

export function sumMonthlyObligationsForMonth(
  snapshot: FinancialObligationsSnapshot,
  referenceDate: Date = new Date(),
  usdToDopRate: number = 1
): number {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  let total = 0;
  const consolidatedCardIds = new Set<string>();

  for (const obligation of snapshot.fixedObligations) {
    if (obligation.status !== "active") continue;
    total += obligation.monthly_amount;
  }

  for (const loan of snapshot.loans) {
    if (loan.status !== "active") continue;
    if (!isObligationActiveForMonth(loan.end_date, year, month)) continue;
    total += loan.monthly_payment;
  }

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;
    consolidatedCardIds.add(card.id);
    total += resolveCardPaymentTotalInDop(
      card,
      snapshot.creditCardInstallments,
      usdToDopRate,
      year,
      month
    );
  }

  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    if (!isObligationActiveForMonth(installment.end_date, year, month)) continue;
    total += installment.monthly_payment;
  }

  return Math.round(total * 100) / 100;
}

export function buildMonthlyObligationCategoryExpenses(
  snapshot: FinancialObligationsSnapshot,
  colorMap: CategoryColorMap,
  referenceDate: Date = new Date(),
  usdToDopRate: number = 1
): CategoryExpense[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const totals = new Map<ExpenseCategorySlug, number>();
  const consolidatedCardIds = new Set<string>();

  for (const obligation of snapshot.fixedObligations) {
    if (obligation.status !== "active") continue;
    const { slug } = resolveExpenseCategory({
      source: "fixed_obligation",
      obligationType: obligation.obligation_type,
    });
    addCategoryAmount(totals, slug, obligation.monthly_amount);
  }

  for (const loan of snapshot.loans) {
    if (loan.status !== "active") continue;
    if (!isObligationActiveForMonth(loan.end_date, year, month)) continue;
    const { slug } = resolveExpenseCategory({ source: "loan" });
    addCategoryAmount(totals, slug, loan.monthly_payment);
  }

  for (const card of snapshot.creditCards) {
    if (card.status !== "active") continue;
    consolidatedCardIds.add(card.id);
    const { slug } = resolveExpenseCategory({ source: "credit_card" });
    addCategoryAmount(
      totals,
      slug,
      resolveCardPaymentTotalInDop(
        card,
        snapshot.creditCardInstallments,
        usdToDopRate,
        year,
        month
      )
    );
  }

  for (const installment of snapshot.creditCardInstallments) {
    if (installment.status !== "active") continue;
    if (consolidatedCardIds.has(installment.credit_card_id)) continue;
    if (!isObligationActiveForMonth(installment.end_date, year, month)) continue;
    const { slug } = resolveExpenseCategory({ source: "credit_card" });
    addCategoryAmount(totals, slug, installment.monthly_payment);
  }

  return Array.from(totals.entries()).map(([slug, amount]) =>
    buildCategoryExpense(slug, amount, colorMap)
  );
}

export function mergeCategoryExpenses(
  colorMap: CategoryColorMap,
  ...groups: CategoryExpense[][]
): CategoryExpense[] {
  const totals = new Map<ExpenseCategorySlug, number>();

  for (const group of groups) {
    for (const item of group) {
      totals.set(item.slug, (totals.get(item.slug) ?? 0) + item.amount);
    }
  }

  return Array.from(totals.entries())
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, amount]) => buildCategoryExpense(slug, amount, colorMap));
}
