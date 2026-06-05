import { BarChart3, Megaphone, ShieldCheck, type LucideIcon } from "lucide-react";

export interface CookieDataRow {
  type: string;
  purpose: string;
  examples: string;
  duration: string;
  canDisable: string;
  icon: LucideIcon;
}

export const cookieDataRows: CookieDataRow[] = [
  {
    type: "Esenciales",
    purpose: "Habilitan funciones básicas del sitio como navegación segura y gestión de sesión.",
    examples: "cookie_consent_given, cookie_preferences",
    duration: "6 meses",
    canDisable: "No",
    icon: ShieldCheck,
  },
  {
    type: "Analítica",
    purpose: "Nos ayudan a entender el uso del producto para mejorar el rendimiento y la experiencia.",
    examples: "Cookies de medición anónima (GTM/Analytics)",
    duration: "Hasta 13 meses",
    canDisable: "Sí",
    icon: BarChart3,
  },
  {
    type: "Marketing",
    purpose: "Permiten personalizar campañas y anuncios relevantes según interacción con el sitio.",
    examples: "Cookies publicitarias (si las autorizas)",
    duration: "Hasta 13 meses",
    canDisable: "Sí",
    icon: Megaphone,
  },
];

export const cookiesLastUpdated = "19 de abril de 2026";
