import { z } from "zod";
import {
  deriveEndDate,
  getTodayYmdInSantoDomingo,
} from "./date-helpers";
import {
  optionalDateField,
  paymentDueDayField,
  positiveAmountField,
} from "./shared-fields";

const optionalCurrentBalanceField = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = typeof val === "number" ? val : Number(val);
    return Number.isNaN(num) ? undefined : num;
  },
  z.number().min(0, "El saldo actual no puede ser negativo").optional()
);

export const loanSchema = z
  .object({
    id: z.string().uuid(),
    loanAlias: z.string().min(1, "El alias del préstamo es requerido"),
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
    currentBalance: optionalCurrentBalanceField,
  })
  .transform((data) => {
    const startDate =
      data.startDate?.trim() && data.startDate.length > 0
        ? data.startDate.trim()
        : getTodayYmdInSantoDomingo();
    const endDate = deriveEndDate(startDate, data.termMonths);
    const currentBalance = data.currentBalance ?? data.originalAmount;

    return {
      ...data,
      startDate,
      endDate,
      currentBalance,
    };
  });

export type LoanSchemaInput = z.input<typeof loanSchema>;
export type LoanSchemaOutput = z.output<typeof loanSchema>;
