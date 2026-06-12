import { buildCategoryColorTokens } from "@/modules/shared/lib/derive-badge-colors";
import type {
  CategoryColorMap,
  CategoryColorTokens,
} from "@/modules/shared/lib/expense-category-colors.types";
import type { ExpenseCategorySlug } from "@/modules/shared/config/expense-categories";

export const INCOME_CATEGORY_COLOR: CategoryColorTokens = {
  colorHex: "#059669",
  badgeBg: "#ECFDF5",
  badgeText: "#047857",
  badgeBorder: "#A7F3D0",
};

export const UNCATEGORIZED_CATEGORY_COLOR: CategoryColorTokens = {
  colorHex: "#64748B",
  badgeBg: "#F1F5F9",
  badgeText: "#475569",
  badgeBorder: "#E2E8F0",
};

/** Fallback when DB is unavailable — matches migration seed */
export const DEFAULT_CATEGORY_COLOR_ROWS: Record<
  ExpenseCategorySlug,
  { color_hex: string }
> = {
  transferencias: { color_hex: "#475569" },
  entretenimiento: { color_hex: "#9333EA" },
  restaurantes: { color_hex: "#F97316" },
  supermercados: { color_hex: "#059669" },
  transporte: { color_hex: "#2563EB" },
  salud: { color_hex: "#E11D48" },
  educacion: { color_hex: "#7C3AED" },
  servicios: { color_hex: "#64748B" },
  telecom: { color_hex: "#0891B2" },
  ocio: { color_hex: "#DB2777" },
  compras: { color_hex: "#CA8A04" },
  viajes: { color_hex: "#0D9488" },
  deudas: { color_hex: "#DC2626" },
  negocios: { color_hex: "#4F46E5" },
  hogar: { color_hex: "#B45309" },
  mascotas: { color_hex: "#65A30D" },
  ahorros: { color_hex: "#10B981" },
  otros: { color_hex: "#78716C" },
};

export function buildDefaultCategoryColorMap(): CategoryColorMap {
  return new Map(
    Object.entries(DEFAULT_CATEGORY_COLOR_ROWS).map(([slug, row]) => [
      slug,
      buildCategoryColorTokens({
        color_hex: row.color_hex,
        badge_bg_hex: null,
        badge_text_hex: null,
        badge_border_hex: null,
      }),
    ])
  );
}

export function resolveCategoryColor(
  slug: ExpenseCategorySlug | string | null | undefined,
  systemColors: CategoryColorMap,
  userOverrides: CategoryColorMap = new Map()
): CategoryColorTokens {
  if (!slug) {
    return UNCATEGORIZED_CATEGORY_COLOR;
  }

  const override = userOverrides.get(slug);
  if (override) {
    return override;
  }

  return systemColors.get(slug) ?? systemColors.get("otros") ?? UNCATEGORIZED_CATEGORY_COLOR;
}

export function mergeCategoryColorMaps(
  systemColors: CategoryColorMap,
  userOverrides: CategoryColorMap
): CategoryColorMap {
  const merged = new Map(systemColors);
  for (const [slug, color] of userOverrides) {
    merged.set(slug, color);
  }
  return merged;
}
