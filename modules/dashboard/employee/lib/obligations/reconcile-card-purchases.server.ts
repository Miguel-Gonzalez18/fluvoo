import type { SupportedBank } from "@/modules/onboarding/config/gmail";
import { FINANCIAL_INSTITUTIONS } from "@/modules/onboarding/config/financial";
import {
  extractCardLastFour,
  isLikelyCreditCardPurchase,
} from "@/modules/gmail/lib/extract-card-last-four";
import { createAdminClient } from "@/src/lib/admin";

function issuerMatchesBank(issuerName: string, bankName: string): boolean {
  const normalizedBank = bankName.toLowerCase();
  const normalizedIssuer = issuerName.toLowerCase();

  if (normalizedIssuer === normalizedBank) return true;

  const institution = FINANCIAL_INSTITUTIONS.find(
    (item) =>
      item.value.toLowerCase() === normalizedIssuer ||
      item.label.toLowerCase().includes(normalizedIssuer)
  );

  if (!institution) {
    return (
      normalizedIssuer.includes(normalizedBank) ||
      normalizedBank.includes(normalizedIssuer)
    );
  }

  return (
    institution.value.toLowerCase() === normalizedBank ||
    institution.label.toLowerCase().includes(normalizedBank)
  );
}

export interface ReconcileCardPurchasesResult {
  linked: number;
  skipped: number;
}

export async function reconcileCardPurchases(
  userId: string,
  transactionIds: string[]
): Promise<ReconcileCardPurchasesResult> {
  const result: ReconcileCardPurchasesResult = { linked: 0, skipped: 0 };

  if (transactionIds.length === 0) return result;

  const admin = createAdminClient();

  const { data: cards } = await admin
    .from("credit_cards")
    .select("id, issuer_name, last_four, tracking_enabled, current_balance")
    .eq("user_id", userId)
    .eq("tracking_enabled", true)
    .eq("status", "active");

  if (!cards?.length) return result;

  const { data: transactions } = await admin
    .from("transactions")
    .select(
      "id, amount, bank_name, transaction_type, merchant_name, description, raw_subject"
    )
    .eq("user_id", userId)
    .in("id", transactionIds);

  if (!transactions?.length) return result;

  for (const tx of transactions) {
    if (tx.transaction_type !== "debit" && tx.transaction_type !== "unknown") {
      result.skipped += 1;
      continue;
    }

    const searchText = [
      tx.description,
      tx.merchant_name,
      tx.raw_subject,
    ]
      .filter(Boolean)
      .join("\n");

    if (!isLikelyCreditCardPurchase(searchText)) {
      result.skipped += 1;
      continue;
    }

    const lastFour = extractCardLastFour(searchText);
    const bankName = tx.bank_name as SupportedBank;

    const matches = cards.filter((card) => {
      if (!issuerMatchesBank(card.issuer_name, bankName)) return false;
      if (card.last_four && lastFour) {
        return card.last_four === lastFour;
      }
      if (card.last_four && !lastFour) return false;
      return cards.filter((c) => issuerMatchesBank(c.issuer_name, bankName)).length === 1;
    });

    if (matches.length !== 1) {
      result.skipped += 1;
      continue;
    }

    const card = matches[0];
    const amount = Number(tx.amount);

    const { data: existingLink } = await admin
      .from("obligation_transaction_links")
      .select("id")
      .eq("transaction_id", tx.id)
      .maybeSingle();

    if (existingLink) {
      result.skipped += 1;
      continue;
    }

    const newBalance =
      Math.round((Number(card.current_balance) + amount) * 100) / 100;

    const { error: linkError } = await admin
      .from("obligation_transaction_links")
      .insert({
        user_id: userId,
        credit_card_id: card.id,
        transaction_id: tx.id,
        event_type: "purchase",
        amount,
      });

    if (linkError) {
      result.skipped += 1;
      continue;
    }

    await admin
      .from("credit_cards")
      .update({ current_balance: newBalance })
      .eq("id", card.id);

    card.current_balance = newBalance;
    result.linked += 1;
  }

  return result;
}
