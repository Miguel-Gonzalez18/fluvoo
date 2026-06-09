import {
  Briefcase,
  Calendar,
  Car,
  CreditCard,
  GraduationCap,
  Hammer,
  HelpCircle,
  Home,
  Laptop,
  PiggyBank,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FiscalTipIconKey } from "@/modules/shared/ai/fiscal-analysis.schema";

const iconByKey: Record<FiscalTipIconKey, LucideIcon> = {
  "piggy-bank": PiggyBank,
  "credit-card": CreditCard,
  "graduation-cap": GraduationCap,
  wallet: Wallet,
  home: Home,
  smartphone: Smartphone,
  car: Car,
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  hammer: Hammer,
  "help-circle": HelpCircle,
  laptop: Laptop,
  "shield-check": ShieldCheck,
  "trending-down": TrendingDown,
  sparkles: Sparkles,
  calendar: Calendar,
};

export function getFiscalTipIcon(iconKey: FiscalTipIconKey): LucideIcon {
  return iconByKey[iconKey] ?? HelpCircle;
}
