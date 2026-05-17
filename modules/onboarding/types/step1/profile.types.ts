import { ProfileType as BaseProfileType } from "../onboarding";
import { ProfileConfig } from "../../config/profiles";

export type ProfileType = BaseProfileType;

export interface Step1ProfileSelectionProps {
  selectedProfile: ProfileType | null;
  onSelect: (profile: ProfileType) => void;
}

export interface ProfileCardProps {
  profile: ProfileConfig;
  isSelected: boolean;
  onSelect: (profile: ProfileType) => void;
}
