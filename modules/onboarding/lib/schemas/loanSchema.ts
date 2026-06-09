import { z } from "zod";
import { monthsBetweenDates, resolveStartDate } from "./date-helpers";
import {
  optionalDateField,
  paymentDueDayField,
  positiveAmountField,
  requiredDateField,
} from "./shared-fields";

export const loanSchema = z
  .object({
    id: z.string().uuid(),
    loanType: z.enum(["personal", "mortgage", "vehicle", "business"], {
      required_error: "Selecciona el tipo de préstamo",
    }),
    lenderName: z.string().min(1, "La entidad prestamista es requerida"),
    originalAmount: positiveAmountField("El monto original"),
    annualRate: z
      .number({ invalid_type_error: "La tasa anual es requerida" })
      .min(0, "La tasa anual no puede ser negativa"),
    termMonths: z
      .number({ invalid_type_error: "El plazo es requerido" })
      .int("El plazo debe ser un número entero")
      .positive("El plazo debe ser mayor a 0"),
    monthlyPayment: positiveAmountField("La cuota mensual"),
    paymentDueDay: paymentDueDayField,
    startDate: optionalDateField,
    endDate: requiredDateField,
  })
  .superRefine((data, ctx) => {
    const start = data.startDate?.trim();
    if (start && start.length > 0) {
      if (data.endDate <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha final debe ser posterior a la fecha de inicio",
          path: ["endDate"],
        });
        return;
      }

      const diffMonths = monthsBetweenDates(start, data.endDate);
      if (Math.abs(diffMonths - data.termMonths) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "El plazo en meses no coincide con las fechas de inicio y fin",
          path: ["termMonths"],
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    startDate: resolveStartDate(
      data.startDate?.trim() || undefined,
      data.endDate,
      data.termMonths
    ),
  }));

export type LoanSchemaInput = z.input<typeof loanSchema>;
export type LoanSchemaOutput = z.output<typeof loanSchema>;
