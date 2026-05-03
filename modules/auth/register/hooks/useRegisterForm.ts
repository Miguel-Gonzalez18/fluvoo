import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchemaOutput } from "../lib/registerSchemas";

export function useRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaOutput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
  };
}
