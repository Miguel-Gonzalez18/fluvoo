import { Briefcase, Laptop, Store, type LucideIcon } from "lucide-react";
import { ProfileType } from "../types/onboarding";

export interface ProfileConfig {
  id: ProfileType;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  disabled: boolean;
}

export const PROFILES: ProfileConfig[] = [
  {
    id: "employee",
    icon: Briefcase,
    title: "Empleado Asalariado",
    description: "Recibo un sueldo fijo en una empresa o institución.",
    disabled: false,
  },
  {
    id: "freelancer",
    icon: Laptop,
    title: "Freelancer / Independiente",
    description: "Trabajo por cuenta propia con ingresos variables.",
    disabled: false,
  },
  {
    id: "business_owner",
    icon: Store,
    title: "Dueño de Negocio",
    description: "Próximamente disponible para usuarios Premium.",
    badge: "PRO",
    disabled: true,
  },
];

export const getProfileById = (id: ProfileType): ProfileConfig | undefined =>
  PROFILES.find((p) => p.id === id);

export const getActiveProfiles = (): ProfileConfig[] =>
  PROFILES.filter((p) => !p.disabled);
