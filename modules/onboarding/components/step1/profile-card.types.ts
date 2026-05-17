import { ProfileType } from "../../types/onboarding";
import { ProfileConfig } from "../../config/profiles";

export interface ProfileCardProps {
  profile: ProfileConfig;
  isSelected: boolean;
  onSelect: (profile: ProfileType) => void;
}
