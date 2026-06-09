import { z } from "zod";
import { computeMonthlyFromFrequency } from "../compute-monthly-amount";
import { paymentDueDayField, positiveAmountField } from "./shared-fields";

export const fixedObligationSchema = z
  .object({
    id: z.string().uuid(),
    obligationType: z.enum(
      [
        "rent",
        "electricity",
        "water",
        "gas",
        "internet",
        "transport",
        "insurance",
        "gym",
        "university",
        "other",
      ],
      { required_error: "Selecciona el tipo de obligación" }
    ),
    name: z.string(),
    providerName: z.string().optional(),
    paymentAmount: positiveAmountField("El monto por pago"),
    paymentFrequency: z.enum(["monthly", "weekly", "biweekly", "daily"], {
      required_error: "Selecciona la frecuencia de pago",
    }),
    monthlyAmount: z.number().optional(),
    paymentDueDay: paymentDueDayField,
  })
  .superRefine((data, ctx) => {
    if (data.obligationType === "other" && data.name.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica el nombre de la obligación",
        path: ["name"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    monthlyAmount: computeMonthlyFromFrequency(
      data.paymentAmount,
      data.paymentFrequency
    ),
  }));

export type FixedObligationSchemaInput = z.input<typeof fixedObligationSchema>;
export type FixedObligationSchemaOutput = z.output<typeof fixedObligationSchema>;
