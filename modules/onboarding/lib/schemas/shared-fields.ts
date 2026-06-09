import { z } from "zod";

export const paymentDueDayField = z
  .number({ invalid_type_error: "El día de pago es requerido" })
  .int("El día de pago debe ser un número entero")
  .min(1, "El día de pago debe ser entre 1 y 31")
  .max(31, "El día de pago debe ser entre 1 y 31");

export const optionalDateField = z
  .string()
  .optional()
  .or(z.literal(""));

export const requiredDateField = z
  .string()
  .min(1, "La fecha es requerida")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha válida");

export const positiveAmountField = (label: string) =>
  z
    .number({ invalid_type_error: `${label} es requerido` })
    .positive(`${label} debe ser mayor a 0`);

export const nonNegativeAmountField = (label: string) =>
  z
    .number({ invalid_type_error: `${label} es requerido` })
    .min(0, `${label} no puede ser negativo`);

/** Requerido en el formulario; permite 0 pero no vacío. */
export const requiredNonNegativeAmountField = (label: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = typeof val === "number" ? val : Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z
      .number({
        required_error: `${label} es requerido`,
        invalid_type_error: `${label} es requerido`,
      })
      .min(0, `${label} no puede ser negativo`)
  );
