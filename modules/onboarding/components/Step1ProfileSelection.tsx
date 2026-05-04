"use client";

import { ProfileType } from "../types/onboarding";
import { PROFILES, ProfileConfig } from "../config/profiles";
import { cn } from "@/lib/utils";

interface Step1ProfileSelectionProps {
  selectedProfile: ProfileType | null;
  onSelect: (profile: ProfileType) => void;
}

interface ProfileCardProps {
  profile: ProfileConfig;
  isSelected: boolean;
  onSelect: (profile: ProfileType) => void;
}

function ProfileCard({ profile, isSelected, onSelect }: ProfileCardProps) {
  const Icon = profile.icon;
  const isDisabled = profile.disabled;

  return (
    <button
      onClick={() => !isDisabled && onSelect(profile.id)}
      disabled={isDisabled}
      className={cn(
        "relative flex flex-col items-start p-5 sm:p-6 rounded-md border-2 text-left transition-all duration-200",
        isDisabled
          ? "border-border/50 bg-muted/30 cursor-not-allowed opacity-60"
          : "hover:border-primary/50 hover:bg-primary/5 border-border bg-card",
        isSelected && !isDisabled && "border-primary bg-primary/5"
      )}
    >
      {profile.badge && (
        <span
          className={cn(
            "absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            isDisabled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {profile.badge}
        </span>
      )}

      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
          isDisabled
            ? "bg-muted text-muted-foreground"
            : isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      <h3
        className={cn(
          "font-semibold mb-1",
          isDisabled ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {profile.title}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {profile.description}
      </p>

      {isSelected && !isDisabled && (
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
}

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
