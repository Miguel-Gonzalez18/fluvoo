export interface PaymentCandidate {
  label: string;
  /** Compact name for KPI subtext (e.g. card alias or bank). */
  shortLabel: string;
  amount: number;
  dueDate: Date;
  source:
    | "fixed_obligation"
    | "loan"
    | "credit_card"
    | "credit_card_installment";
  amountSubtext?: string;
}

export interface FinancialObligationsSnapshot {
  fixedObligations: Array<{
    name: string;
    obligation_type: string;
    provider_name: string | null;
    monthly_amount: number;
    payment_due_day: number;
    status: string;
  }>;
  loans: Array<{
    lender_name: string | null;
    loan_type: string;
    monthly_payment: number;
    payment_due_day: number | null;
    end_date: string | null;
    status: string | null;
  }>;
  creditCards: Array<{
    id: string;
    issuer_name: string;
    card_label: string | null;
    currency_mode: string;
    minimum_payment: number;
    minimum_payment_usd: number | null;
    payment_due_day: number;
    status: string;
  }>;
  creditCardInstallments: Array<{
    description: string | null;
    monthly_payment: number;
    payment_due_day: number | null;
    statement_close_day: number | null;
    end_date: string | null;
    status: string;
    credit_card_id: string;
    credit_cards: {
      issuer_name: string;
      card_label: string | null;
      payment_due_day: number;
      statement_close_day: number | null;
    } | null;
  }>;
}
