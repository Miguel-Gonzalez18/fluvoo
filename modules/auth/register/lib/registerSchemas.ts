import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre completo es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    email: z
      .string()
      .min(1, "El correo electrónico es requerido")
      .email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(
        /[A-Z]/,
        "La contraseña debe contener al menos una letra mayúscula"
      )
      .regex(
        /[a-z]/,
        "La contraseña debe contener al menos una letra minúscula"
      )
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .regex(
        /[^A-Za-z0-9]/,
        "La contraseña debe contener al menos un carácter especial"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmación de contraseña es requerida"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterSchemaInput = z.input<typeof registerSchema>;
export type RegisterSchemaOutput = z.output<typeof registerSchema>;
