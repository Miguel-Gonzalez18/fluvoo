import {
  ShoppingCart,
  TrendingDown,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { INCOME_CATEGORY_COLOR } from "@/modules/dashboard/employee/lib/category-badge-styles";
import type { RecentTransaction } from "@/modules/dashboard/employee/types/dashboard.types";
import { buildDefaultCategoryColorMap } from "@/modules/shared/lib/resolve-category-color";

export const MOCK_DISPLAY_NAME = "Carlos";

const defaultColors = buildDefaultCategoryColorMap();

export const RECENT_TRANSACTIONS: RecentTransaction[] = [
  {
    id: "tx-1",
    merchant: "Sirena Market",
    dateLabel: "Hoy, 10:24 AM",
    category: "ALIMENTACIÓN",
    categoryVariant: "outline",
    categoryColor: defaultColors.get("supermercados")!,
    amount: 3450,
    originalAmountSubtext: null,
    direction: "expense",
    icon: ShoppingCart,
  },
  {
    id: "tx-2",
    merchant: "Nómina Quincenal",
    dateLabel: "15 Jul, 2024",
    category: "INGRESOS",
    categoryVariant: "success",
    categoryColor: INCOME_CATEGORY_COLOR,
    amount: 21250,
    originalAmountSubtext: null,
    direction: "income",
    icon: Wallet,
  },
  {
    id: "tx-3",
    merchant: "Shell Churchill",
    dateLabel: "14 Jul, 2024",
    category: "TRANSPORTE",
    categoryVariant: "outline",
    categoryColor: defaultColors.get("transporte")!,
    amount: 2800,
    originalAmountSubtext: null,
    direction: "expense",
    icon: TrendingDown,
  },
  {
    id: "tx-4",
    merchant: "Restaurante Sophia's",
    dateLabel: "12 Jul, 2024",
    category: "OCIO",
    categoryVariant: "outline",
    categoryColor: defaultColors.get("ocio")!,
    amount: 4120,
    originalAmountSubtext: null,
    direction: "expense",
    icon: UtensilsCrossed,
  },
];

