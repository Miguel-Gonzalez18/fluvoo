interface ResolveAccountLabelInput {
  bankName: string | null;
  description?: string | null;
  rawSubject?: string | null;
  cardLabel?: string | null;
}

const LAST_DIGITS_PATTERN =
  /(?:\*\*|··|terminada en|terminado en|ending in|finalizada en)\s*(\d{2,4})/i;

function extractLastDigits(...sources: (string | null | undefined)[]): string | null {
  for (const source of sources) {
    if (!source?.trim()) continue;
    const match = source.match(LAST_DIGITS_PATTERN);
    if (match?.[1]) {
      const digits = match[1];
      return digits.length > 2 ? digits.slice(-2) : digits;
    }
  }
  return null;
}

export function resolveAccountLabel({
  bankName,
  description,
  rawSubject,
  cardLabel,
}: ResolveAccountLabelInput): string {
  const lastDigits = extractLastDigits(description, rawSubject);
  const bank = bankName?.trim();

  if (cardLabel?.trim() && lastDigits) {
    return `${cardLabel.trim()} ··${lastDigits}`;
  }

  if (cardLabel?.trim()) {
    return cardLabel.trim();
  }

  if (bank && lastDigits) {
    return `${bank} ··${lastDigits}`;
  }

  if (bank) {
    return bank;
  }

  return "Cuenta bancaria";
}
