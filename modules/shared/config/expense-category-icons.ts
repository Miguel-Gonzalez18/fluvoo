import {
  ArrowLeftRight,
  Briefcase,
  Car,
  CreditCard,
  GraduationCap,
  Hammer,
  HelpCircle,
  Home,
  PawPrint,
  PiggyBank,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Tv,
  UtensilsCrossed,
  Wallet,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  type ExpenseCategoryIconKey,
  type ExpenseCategorySlug,
  getCategoryBySlug,
} from "@/modules/shared/config/expense-categories";

const iconByKey: Record<ExpenseCategoryIconKey, LucideIcon> = {
  "arrow-left-right": ArrowLeftRight,
  tv: Tv,
  "utensils-crossed": UtensilsCrossed,
  "shopping-cart": ShoppingCart,
  car: Car,
  wallet: Wallet,
  "graduation-cap": GraduationCap,
  home: Home,
  smartphone: Smartphone,
  wine: Wine,
  "shopping-bag": ShoppingBag,
  plane: Plane,
  "credit-card": CreditCard,
  briefcase: Briefcase,
  hammer: Hammer,
  "paw-print": PawPrint,
  "piggy-bank": PiggyBank,
  "help-circle": HelpCircle,
};

export function getCategoryIcon(slug: ExpenseCategorySlug): LucideIcon {
  const iconKey = getCategoryBySlug(slug).icon;
  return iconByKey[iconKey] ?? HelpCircle;
}
