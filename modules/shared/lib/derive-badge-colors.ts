import type {
  CategoryColorRow,
  CategoryColorTokens,
} from "@/modules/shared/lib/expense-category-colors.types";

function parseHex(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixWithWhite(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  return toHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = parseHex(hex);
  const factor = 1 - amount;
  return toHex(r * factor, g * factor, b * factor);
}

export function buildCategoryColorTokens(row: CategoryColorRow): CategoryColorTokens {
  const colorHex = row.color_hex.toUpperCase();

  return {
    colorHex,
    badgeBg: row.badge_bg_hex?.toUpperCase() ?? mixWithWhite(colorHex, 0.88),
    badgeText: row.badge_text_hex?.toUpperCase() ?? darken(colorHex, 0.35),
    badgeBorder: row.badge_border_hex?.toUpperCase() ?? mixWithWhite(colorHex, 0.75),
  };
}
