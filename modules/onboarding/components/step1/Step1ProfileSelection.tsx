"use client";

import { PROFILES } from "../../config/profiles";
import { Step1ProfileSelectionProps } from "../../types/step1/profile.types";
import { ProfileCard } from "./profile-card.component";

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
        {PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isSelected={selectedProfile === profile.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
