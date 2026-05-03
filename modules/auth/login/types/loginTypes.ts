export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface LoginConfig {
  title: string;
  subtitle: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  emailLabel: string;
  passwordLabel: string;
  forgotPasswordLabel: string;
  submitLabel: string;
  registerLabel: string;
  registerLinkLabel: string;
}