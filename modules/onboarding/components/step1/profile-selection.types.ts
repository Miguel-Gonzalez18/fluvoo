import { ProfileType } from "../../types/onboarding";

export interface Step1ProfileSelectionProps {
  selectedProfile: ProfileType | null;
  onSelect: (profile: ProfileType) => void;
}
