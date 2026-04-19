import type React from "react";
import type { NavItem } from "../types/typesHome";

export const itemsMenu: NavItem[] = [
  { label: "Inicio", href: "#inicio", id: "nav-link-inicio" },
  { label: "Nosotros", href: "#nosotros", id: "nav-link-nosotros" },
  { label: "Beneficios", href: "#beneficios", id: "nav-link-beneficios" },
  { label: "Cómo funciona", href: "#como-funciona", id: "nav-link-como-funciona" },
  { label: "FAQ", href: "#faq", id: "nav-link-faq" },
];

export const handleAnchorClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    const offset = 80;
    const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};
