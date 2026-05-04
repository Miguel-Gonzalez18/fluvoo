"use client";

import { Briefcase, Laptop, Store } from "lucide-react";
import { ProfileType } from "../types/onboarding";
import { cn } from "@/lib/utils";

interface Step1ProfileSelectionProps {
  selectedProfile: ProfileType | null;
  onSelect: (profile: ProfileType) => void;
}

const profiles = [
  {
    id: "employee" as ProfileType,
    icon: Briefcase,
    title: "Empleado Asalariado",
    description: "Recibo un sueldo fijo en una empresa o institución.",
  },
  {
    id: "freelancer" as ProfileType,
    icon: Laptop,
    title: "Freelancer / Independiente",
    description: "Trabajo por cuenta propia con ingresos variables.",
  },
  {
    id: "business_owner" as ProfileType,
    icon: Store,
    title: "Dueño de Negocio",
    description: "Tengo un colmado, empresa o emprendimiento.",
    badge: "PRO",
  },
];

export function Step1ProfileSelection({
  selectedProfile,
  onSelect,
}: Step1ProfileSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
          ¿Cómo describes tu situación?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Tu perfil define las herramientas y el análisis que recibirás.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          const isSelected = selectedProfile === profile.id;

          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={cn(
                "relative flex flex-col items-start p-5 sm:p-6 rounded-xl border-2 text-left transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              {profile.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {profile.badge}
                </span>
              )}

              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-semibold text-foreground mb-1">
                {profile.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {profile.description}
              </p>

              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
