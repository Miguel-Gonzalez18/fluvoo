import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Dumbbell,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";
import type { ObligationType } from "@/modules/onboarding/types/onboarding";

const obligationIconMap: Record<ObligationType, LucideIcon> = {
  rent: Home,
  electricity: Zap,
  water: Droplets,
  gas: Flame,
  internet: Wifi,
  transport: Home,
  insurance: Shield,
  gym: Dumbbell,
  university: GraduationCap,
  other: HelpCircle,
};

export function getObligationIcon(type: ObligationType): LucideIcon {
  return obligationIconMap[type] ?? HelpCircle;
}
