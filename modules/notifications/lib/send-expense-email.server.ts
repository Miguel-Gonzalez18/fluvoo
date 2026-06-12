import { Resend } from "resend";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { ExpenseNotificationPayload } from "@/modules/notifications/types/notification.types";

function buildSubject(payload: ExpenseNotificationPayload): string {
  const primary = payload.newExpenses[0];
  if (payload.newExpenses.length === 1) {
    return `Nuevo gasto detectado en Fluvoo — ${primary.merchant} ${formatDOP(primary.amountDop)}`;
  }
  return `Fluvoo detectó ${payload.newExpenses.length} gastos nuevos`;
}

function buildMarginLine(payload: ExpenseNotificationPayload): string {
  const margin = formatDOP(payload.marginMonthly);
  if (payload.marginPercent !== null) {
    return `${margin} (${payload.marginPercent}% del ingreso)`;
  }
  return margin;
}

function buildHtml(payload: ExpenseNotificationPayload): string {
  const expenseRows = payload.newExpenses
    .map(
      (expense) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            <strong>${expense.merchant}</strong><br/>
            <span style="color:#666;font-size:14px;">${expense.categoryLabel} · ${expense.date}</span>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;">
            ${formatDOP(expense.amountDop)}
          </td>
        </tr>`
    )
    .join("");

  const tipBlock = payload.aiTopTip
    ? `<p style="margin:0 0 8px;"><strong>${payload.aiTopTip.title}</strong><br/>${payload.aiTopTip.description}</p>`
    : "";

  return `
    <div style="font-family:Manrope,Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
      <h1 style="font-size:22px;margin:0 0 16px;">Nuevo gasto detectado</h1>
      <p style="color:#444;margin:0 0 20px;">
        Hola${payload.recipientName ? ` ${payload.recipientName}` : ""}, Fluvoo detectó un movimiento nuevo en tu correo bancario.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${expenseRows}
      </table>
      <div style="background:#f6f8f7;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 8px;"><strong>Gastos del mes:</strong> ${formatDOP(payload.monthlyExpenses)}</p>
        <p style="margin:0 0 8px;"><strong>Margen del mes:</strong> ${buildMarginLine(payload)}</p>
        <p style="margin:0;color:#666;font-size:14px;">${payload.marginStatus}</p>
      </div>
      <div style="background:#eef8f2;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-weight:600;">Análisis IA</p>
        <p style="margin:0 0 12px;line-height:1.5;">${payload.aiDiagnosis}</p>
        ${tipBlock}
      </div>
      <a href="${payload.deepLink}" style="display:inline-block;background:#34a864;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;font-weight:600;">
        Ver en Fluvoo
      </a>
    </div>
  `;
}

function buildText(payload: ExpenseNotificationPayload): string {
  const expenses = payload.newExpenses
    .map(
      (expense) =>
        `- ${expense.merchant}: ${formatDOP(expense.amountDop)} (${expense.categoryLabel}, ${expense.date})`
    )
    .join("\n");

  const tip = payload.aiTopTip
    ? `\nTip: ${payload.aiTopTip.title} — ${payload.aiTopTip.description}`
    : "";

  return [
    "Nuevo gasto detectado en Fluvoo",
    "",
    expenses,
    "",
    `Gastos del mes: ${formatDOP(payload.monthlyExpenses)}`,
    `Margen del mes: ${buildMarginLine(payload)}`,
    payload.marginStatus,
    "",
    "Análisis IA:",
    payload.aiDiagnosis,
    tip,
    "",
    `Ver en Fluvoo: ${payload.deepLink}`,
  ].join("\n");
}

export async function sendExpenseEmail(
  payload: ExpenseNotificationPayload
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn("[sendExpenseEmail] RESEND_API_KEY or RESEND_FROM_EMAIL missing");
    return false;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: payload.recipientEmail,
    subject: buildSubject(payload),
    html: buildHtml(payload),
    text: buildText(payload),
  });

  if (error) {
    console.error("[sendExpenseEmail] Failed:", error);
    return false;
  }

  return true;
}
