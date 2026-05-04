import { Shield, Filter, XCircle, type LucideIcon } from "lucide-react";

export const SUPPORTED_BANKS = [
  "Banreservas",
  "Popular",
  "BHD",
  "APAP",
  "Scotiabank",
  "Qik",
  "Santa Cruz",
  "Cibao",
] as const;

export type SupportedBank = (typeof SUPPORTED_BANKS)[number];

export interface GmailFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const GMAIL_FEATURES: GmailFeature[] = [
  {
    icon: Shield,
    title: "Solo lectura",
    description: "Nunca podremos enviar correos por ti.",
  },
  {
    icon: Filter,
    title: "Privacidad",
    description: "Solo filtramos correos de entidades bancarias.",
  },
  {
    icon: XCircle,
    title: "Control",
    description: "Puedes desconectarlo en cualquier momento.",
  },
];
