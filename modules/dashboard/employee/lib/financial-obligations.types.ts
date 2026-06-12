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
    id: string;
    lender_name: string | null;
    loan_type: string;
    monthly_payment: number;
    payment_due_day: number | null;
    end_date: string | null;
    start_date: string | null;
    status: string | null;
    original_amount: number;
    current_balance: number | null;
    term_months: number;
    annual_rate: number;
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
    current_balance: number;
    current_balance_usd: number | null;
    statement_balance: number;
    statement_balance_usd: number;
    credit_limit: number;
    credit_limit_usd: number | null;
    statement_close_day: number | null;
    annual_rate: number | null;
  }>;
  creditCardInstallments: Array<{
    id: string;
    description: string | null;
    monthly_payment: number;
    remaining_balance: number;
    original_amount: number;
    term_months: number;
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
