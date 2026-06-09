import {
  Laptop,
  PiggyBank,
  ShoppingCart,
  TrendingDown,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import type { FiscalTip, RecentTransaction } from "@/modules/dashboard/employee/types/dashboard.types";

export const MOCK_DISPLAY_NAME = "Carlos";

export const FISCAL_ANALYSIS_DESCRIPTION =
  "Basado en tus gastos actuales, podrías aumentar tu devolución de impuestos (ISR) aplicando estas estrategias antes del cierre de mes.";

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

export const FISCAL_TIPS: FiscalTip[] = [
  {
    id: "education",
    title: "Deducir Gastos Educativos",
    description:
      "Tienes RD$4,200 en facturas de idiomas sin reportar este mes.",
    icon: Laptop,
  },
  {
    id: "afp",
    title: "Aporte Voluntario AFP",
    description:
      "Un aporte de RD$1,500 reduciría tu base imponible en un 2%.",
    icon: PiggyBank,
  },
];

