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
  { label: "Inicio", href: "/employee", icon: LayoutDashboard },
  { label: "Presupuesto", href: "/employee/budget", icon: Wallet },
  { label: "Objetivos y Ahorros", href: "/employee/goals", icon: PiggyBank },
  { label: "Transacciones", href: "/employee/transactions", icon: ArrowLeftRight },
  { label: "Herramientas", href: "/employee/tools", icon: Wrench },
];

export const bottomItems: NavItem[] = [
  { label: "Configuración", href: "/employee/settings", icon: Settings },
];
