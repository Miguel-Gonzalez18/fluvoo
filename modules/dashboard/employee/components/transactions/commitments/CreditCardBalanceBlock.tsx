import { cn } from "@/lib/utils";
import { formatDOP, formatUSD } from "@/modules/dashboard/employee/lib/formatCurrency";

interface CreditCardBalanceBlockProps {
  label: string;
  amountDop: number;
  amountUsd: number;
  align?: "left" | "right";
  className?: string;
}

export function CreditCardBalanceBlock({
  label,
  amountDop,
  amountUsd,
  align = "left",
  className,
}: CreditCardBalanceBlockProps) {
  return (
    <div
      className={cn(
        "min-w-0 space-y-0.5",
        align === "right" && "text-right",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="truncate text-sm font-semibold">{formatDOP(amountDop)}</p>
      <p className="truncate text-xs opacity-90">{formatUSD(amountUsd)}</p>
    </div>
  );
}
