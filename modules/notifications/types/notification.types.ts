export interface ExpenseNotificationItem {
  merchant: string;
  amountDop: number;
  categoryLabel: string;
  date: string;
}

export interface ExpenseNotificationTip {
  title: string;
  description: string;
}

export interface ExpenseNotificationPayload {
  newExpenses: ExpenseNotificationItem[];
  aiDiagnosis: string;
  aiTopTip: ExpenseNotificationTip | null;
  monthlyExpenses: number;
  marginMonthly: number;
  marginPercent: number | null;
  marginStatus: string;
  deepLink: string;
  recipientEmail: string;
  recipientName: string | null;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  minAmountDop: number;
}

export interface NotifyNewExpensesResult {
  notified: boolean;
  emailSent: boolean;
  pushSent: boolean;
  skippedReason?: string;
}
