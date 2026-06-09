import { z } from "zod";
import {
  optionalDateField,
  paymentDueDayField,
  positiveAmountField,
} from "./shared-fields";

export const creditCardInstallmentSchema = z.object({
  id: z.string().uuid(),
  creditCardId: z.string().uuid().optional(),
  description: z.string().optional(),
  originalAmount: positiveAmountField("El monto original"),
  monthlyPayment: positiveAmountField("La cuota mensual"),
  termMonths: z
    .number({ invalid_type_error: "El plazo es requerido" })
    .int("El plazo debe ser un número entero")
    .positive("El plazo debe ser mayor a 0"),
  annualRate: z
    .number({ invalid_type_error: "La tasa anual es requerida" })
    .min(0, "La tasa anual no puede ser negativa"),
  statementCloseDay: paymentDueDayField,
  paymentDueDay: paymentDueDayField,
  startDate: optionalDateField,
  endDate: optionalDateField,
});

export type CreditCardInstallmentSchemaInput = z.input<
  typeof creditCardInstallmentSchema
>;
export type CreditCardInstallmentSchemaOutput = z.output<
  typeof creditCardInstallmentSchema
>;
