import { unstable_cache } from "next/cache";
import { buildCategoryColorTokens } from "@/modules/shared/lib/derive-badge-colors";
import type {
  CategoryColorEntry,
  CategoryColorMap,
  CategoryColorRow,
} from "@/modules/shared/lib/expense-category-colors.types";
import {
  buildDefaultCategoryColorMap,
  mergeCategoryColorMaps,
} from "@/modules/shared/lib/resolve-category-color";
import { createAdminClient } from "@/src/lib/admin";
import { createClient } from "@/src/lib/server";

const CACHE_TAG = "expense-category-colors";

function entriesToColorMap(entries: CategoryColorEntry[]): CategoryColorMap {
  return new Map(entries);
}

async function fetchSystemCategoryColorEntries(): Promise<CategoryColorEntry[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("expense_categories")
      .select("slug, color_hex, badge_bg_hex, badge_text_hex, badge_border_hex")
      .eq("active", true);

    if (error || !data?.length) {
      return Array.from(buildDefaultCategoryColorMap().entries());
    }

    return data.map((row) => [
      row.slug,
      buildCategoryColorTokens(row as CategoryColorRow),
    ] satisfies CategoryColorEntry);
  } catch {
    return Array.from(buildDefaultCategoryColorMap().entries());
  }
}

async function fetchUserCategoryColorOverrides(
  userId: string
): Promise<CategoryColorMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_category_colors")
      .select(
        "category_slug, color_hex, badge_bg_hex, badge_text_hex, badge_border_hex"
      )
      .eq("user_id", userId);

    if (error || !data?.length) {
      return new Map();
    }

    return new Map(
      data.map((row) => [
        row.category_slug,
        buildCategoryColorTokens({
          color_hex: row.color_hex,
          badge_bg_hex: row.badge_bg_hex,
          badge_text_hex: row.badge_text_hex,
          badge_border_hex: row.badge_border_hex,
        }),
      ])
    );
  } catch {
    return new Map();
  }
}

export const getCachedSystemCategoryColorEntries = unstable_cache(
  fetchSystemCategoryColorEntries,
  ["expense-category-colors-system"],
  { tags: [CACHE_TAG], revalidate: 3600 }
);

export async function getExpenseCategoryColorMap(
  userId?: string | null
): Promise<CategoryColorMap> {
  const systemEntries = await getCachedSystemCategoryColorEntries();
  const systemColors = entriesToColorMap(systemEntries);

  if (!userId) {
    return systemColors;
  }

  const userOverrides = await fetchUserCategoryColorOverrides(userId);
  return mergeCategoryColorMaps(systemColors, userOverrides);
}

export { CACHE_TAG as EXPENSE_CATEGORY_COLORS_CACHE_TAG };
