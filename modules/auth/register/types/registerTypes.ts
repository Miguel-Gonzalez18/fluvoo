export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export interface RegisterConfig {
  title: string;
  subtitle: string;
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  fullNameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  submitLabel: string;
  termsLabel: string;
  termsLinkLabel: string;
  privacyLinkLabel: string;
  loginLabel: string;
  loginLinkLabel: string;
  encryptionLabel: string;
}

export type PasswordStrength = "weak" | "medium" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  feedback: string;
}
