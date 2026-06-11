import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  ArrowLeftRight,
  Wrench,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/freelancer", icon: LayoutDashboard },
  { label: "Presupuesto", href: "/freelancer/budget", icon: Wallet },
  { label: "Objetivos y Ahorros", href: "/freelancer/goals", icon: PiggyBank },
  { label: "Transacciones", href: "/freelancer/transactions", icon: ArrowLeftRight },
  { label: "Herramientas", href: "/freelancer/tools", icon: Wrench },
];

export const bottomItems: NavItem[] = [
  { label: "Configuración", href: "/freelancer/settings", icon: Settings },
];
