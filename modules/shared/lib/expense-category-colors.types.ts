export interface CategoryColorRow {
  color_hex: string;
  badge_bg_hex: string | null;
  badge_text_hex: string | null;
  badge_border_hex: string | null;
}

export interface CategoryColorTokens {
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export type CategoryColorMap = Map<string, CategoryColorTokens>;

export type CategoryColorEntry = [string, CategoryColorTokens];

export interface ResolvedCategoryColors {
  system: CategoryColorMap;
  userOverrides: CategoryColorMap;
}
