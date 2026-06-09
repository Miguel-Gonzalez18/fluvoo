import {
  ShoppingCart,
  TrendingDown,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import type { RecentTransaction } from "@/modules/dashboard/employee/types/dashboard.types";

export const MOCK_DISPLAY_NAME = "Carlos";

export const RECENT_TRANSACTIONS: RecentTransaction[] = [
  {
    id: "tx-1",
    merchant: "Sirena Market",
    dateLabel: "Hoy, 10:24 AM",
    category: "ALIMENTACIÓN",
    categoryVariant: "outline",
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
    amount: 4120,
    originalAmountSubtext: null,
    direction: "expense",
    icon: UtensilsCrossed,
  },
];

