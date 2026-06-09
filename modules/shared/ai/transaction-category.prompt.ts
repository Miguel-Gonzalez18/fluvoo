import {
  EXPENSE_CATEGORY_CATALOG,
  type ExpenseCategorySlug,
} from "@/modules/shared/config/expense-categories";
import type { TransactionCategoryInput } from "@/modules/shared/ai/transaction-category.schema";

function buildCatalogLines(): string {
  return EXPENSE_CATEGORY_CATALOG.filter((category) => category.active)
    .map((category) => `- ${category.slug}: ${category.shortLabel}`)
    .join("\n");
}

export const TRANSACTION_CATEGORY_SYSTEM_PROMPT = `Eres un clasificador de gastos bancarios en República Dominicana.
Asigna cada transacción a exactamente un slug del catálogo. Responde solo con slugs válidos del catálogo.

Reglas importantes:
- UBER *EATS, UBER EATS, HELP.UBER.COM con señal de comida → restaurantes (NO transporte).
- UBER RIDES, UBR* PENDING, viajes sin "eats" → transporte.
- Colmados, supermercados y tiendas de abarrotes locales sin keyword conocida (ej. APREZIO, BRACHE) → supermercados si el contexto lo indica.
- Transferencias entre personas → transferencias.
- Pagos de tarjeta, préstamos, cuotas → deudas.
- Si no hay señal clara, mantén ruleSlug o usa otros.

Catálogo (slug: etiqueta corta):
${buildCatalogLines()}`;

export function buildTransactionCategoryUserPrompt(
  items: TransactionCategoryInput[]
): string {
  const lines = items.map((item, index) => {
    const merchant = item.merchantName?.trim() || "(sin comercio)";
    const description = item.description?.trim() || "(sin descripción)";
    return [
      `${index + 1}. id=${item.transactionId}`,
      `   tipo=${item.transactionType}`,
      `   comercio=${merchant}`,
      `   descripción=${description}`,
      `   categoría_keywords=${item.ruleSlug}`,
    ].join("\n");
  });

  return `Clasifica estas ${items.length} transacciones. Devuelve un ítem por cada id con el slug correcto.

${lines.join("\n\n")}`;
}

export function isValidCategorySlug(slug: string): slug is ExpenseCategorySlug {
  return EXPENSE_CATEGORY_CATALOG.some(
    (category) => category.active && category.slug === slug
  );
}
