import { z } from "zod";
import { creditCardInstallmentSchema } from "./creditCardInstallmentSchema";
import {
  paymentDueDayField,
  positiveAmountField,
  requiredNonNegativeAmountField,
} from "./shared-fields";

export const creditCardSchema = z
  .object({
    id: z.string().uuid(),
    issuerName: z.string().min(1, "Selecciona el banco emisor"),
    cardLabel: z.string().optional(),
    currencyMode: z.enum(["dop_only", "usd_only", "mixed"], {
      required_error: "Selecciona la moneda de la tarjeta",
    }),
    creditLimit: requiredNonNegativeAmountField("El límite de crédito"),
    currentBalance: requiredNonNegativeAmountField("El saldo actual"),
    minimumPayment: requiredNonNegativeAmountField("El pago mínimo"),
    creditLimitUsd: z.number().min(0).optional().nullable(),
    currentBalanceUsd: z.number().min(0).optional().nullable(),
    minimumPaymentUsd: z.number().min(0).optional().nullable(),
    statementCloseDay: paymentDueDayField,
    paymentDueDay: paymentDueDayField,
    annualRate: z
      .number()
      .min(0, "La tasa anual no puede ser negativa")
      .optional()
      .nullable(),
    installments: z.array(creditCardInstallmentSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.currencyMode === "dop_only" || data.currencyMode === "mixed") {
      if (data.creditLimit <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El límite en RD$ debe ser mayor a 0",
          path: ["creditLimit"],
        });
      }
      if (data.currentBalance > data.creditLimit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El saldo en RD$ no puede superar el límite",
          path: ["currentBalance"],
        });
      }
    }

    if (data.currencyMode === "usd_only" || data.currencyMode === "mixed") {
      if ((data.creditLimitUsd ?? 0) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El límite en USD debe ser mayor a 0",
          path: ["creditLimitUsd"],
        });
      }
      if (
        data.currentBalanceUsd != null &&
        data.creditLimitUsd != null &&
        data.currentBalanceUsd > data.creditLimitUsd
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El saldo en USD no puede superar el límite",
          path: ["currentBalanceUsd"],
        });
      }
    }

    if (data.currencyMode === "dop_only") {
      if (data.minimumPayment < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El pago mínimo en RD$ es requerido",
          path: ["minimumPayment"],
        });
      }
    }

    if (data.currencyMode === "usd_only") {
      if (data.minimumPaymentUsd == null || data.minimumPaymentUsd < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El pago mínimo en USD es requerido",
          path: ["minimumPaymentUsd"],
        });
      }
    }

    if (data.currencyMode === "mixed") {
      if (data.minimumPayment < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El pago mínimo en RD$ es requerido",
          path: ["minimumPayment"],
        });
      }
      if (data.minimumPaymentUsd == null || data.minimumPaymentUsd < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El pago mínimo en USD es requerido",
          path: ["minimumPaymentUsd"],
        });
      }
    }
  });

export type CreditCardSchemaInput = z.input<typeof creditCardSchema>;
export type CreditCardSchemaOutput = z.output<typeof creditCardSchema>;
