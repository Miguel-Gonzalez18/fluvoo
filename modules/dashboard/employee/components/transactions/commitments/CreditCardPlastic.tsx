import { cn } from "@/lib/utils";
import { CreditCardBalanceBlock } from "@/modules/dashboard/employee/components/transactions/commitments/CreditCardBalanceBlock";
import { formatDOP, formatUSD } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { CreditCardCommitmentItem } from "@/modules/dashboard/employee/types/transactions.types";

interface CreditCardPlasticProps {
  card: CreditCardCommitmentItem;
  onClick?: () => void;
  className?: string;
}

export function CreditCardPlastic({
  card,
  onClick,
  className,
}: CreditCardPlasticProps) {
  const ariaLabel = [
    card.alias,
    card.issuerLabel,
    card.cardholderName,
    `saldo total ${formatDOP(card.totalBalanceDop)}`,
    formatUSD(card.totalBalanceUsd),
    `saldo al corte ${formatDOP(card.statementBalanceDop)}`,
    card.dueStatus.dueLabel,
  ].join(", ");

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "w-full cursor-pointer rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[1.586/1] overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white shadow-md",
          card.gradientClass,
          card.patternClass
        )}
      >
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-label text-xs font-semibold uppercase tracking-wide">
              {card.alias}
            </p>
            <p className="max-w-[45%] truncate text-right text-[10px] font-semibold uppercase tracking-wider opacity-90">
              {card.issuerLabel}
            </p>
          </div>

          <div className="flex flex-1 flex-col items-start justify-center gap-1">
            <p className="truncate text-left font-medium capitalize">
              {card.cardholderName}
            </p>
            {card.trackingEnabled && card.lastFour && (
              <p className="font-mono text-xs tracking-widest opacity-80">
                •••• •••• •••• {card.lastFour}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between gap-3">
            <CreditCardBalanceBlock
              label="Saldo total"
              amountDop={card.totalBalanceDop}
              amountUsd={card.totalBalanceUsd}
            />
            <CreditCardBalanceBlock
              label="Saldo al corte"
              amountDop={card.statementBalanceDop}
              amountUsd={card.statementBalanceUsd}
              align="right"
            />
          </div>
        </div>
      </div>
    </button>
  );
}
