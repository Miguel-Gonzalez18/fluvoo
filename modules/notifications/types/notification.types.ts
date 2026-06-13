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

export interface GenericNotificationPayload {
  title: string;
  body: string;
  deepLink: string;
  referenceKey?: string;
}

export type ObligationNotificationType =
  | "loan_payment_due"
  | "credit_card_payment_due"
  | "credit_card_payment_upcoming"
  | "credit_card_close_reminder"
  | "credit_card_statement_reminder"
  | "gmail_connected_enable_tracking";

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

export interface ExpenseUserNotificationItem {
  id: string;
  type: "expense_detected";
  payload: ExpenseNotificationPayload;
  readAt: string | null;
  createdAt: string;
}

export interface GenericUserNotificationItem {
  id: string;
  type: ObligationNotificationType;
  payload: GenericNotificationPayload;
  readAt: string | null;
  createdAt: string;
}

export type UserNotificationItem =
  | ExpenseUserNotificationItem
  | GenericUserNotificationItem;

export interface UserNotificationsInbox {
  notifications: UserNotificationItem[];
  unreadCount: number;
}
