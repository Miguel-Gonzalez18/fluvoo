import { CreditCard, Database, Eye, Globe, UserCheck, type LucideIcon } from "lucide-react";

export interface PrivacyDataRow {
  category: string;
  examples: string;
  purpose: string;
  retention: string;
  icon: LucideIcon;
}

export const privacyDataRows: PrivacyDataRow[] = [
  {
    category: "Datos de cuenta",
    examples: "Nombre, correo electrónico, contraseña (cifrada)",
    purpose: "Crear y gestionar tu cuenta en la plataforma",
    retention: "Mientras la cuenta esté activa",
    icon: UserCheck,
  },
  {
    category: "Datos financieros",
    examples: "Ingresos, gastos, metas de ahorro ingresados por el usuario",
    purpose: "Generar análisis, proyecciones y recomendaciones personalizadas",
    retention: "Mientras la cuenta esté activa + 30 días tras eliminación",
    icon: Database,
  },
  {
    category: "Datos de uso",
    examples: "Páginas visitadas, funciones utilizadas, frecuencia de acceso",
    purpose: "Mejorar la experiencia y el rendimiento del producto",
    retention: "Hasta 13 meses (anonimizados)",
    icon: Eye,
  },
  {
    category: "Datos técnicos",
    examples: "Dirección IP, tipo de navegador, sistema operativo",
    purpose: "Seguridad, prevención de fraude y soporte técnico",
    retention: "90 días",
    icon: Globe,
  },
  {
    category: "Seguimiento de tarjetas",
    examples: "Últimos 4 dígitos del plástico (opcional), PDFs de estado de cuenta subidos por ti",
    purpose: "Conciliar consumos y saldos de tarjetas de crédito cuando activas el seguimiento",
    retention: "Mientras la cuenta esté activa; PDFs eliminables desde Transacciones",
    icon: CreditCard,
  },
];

export const privacyLastUpdated = "19 de abril de 2026";
