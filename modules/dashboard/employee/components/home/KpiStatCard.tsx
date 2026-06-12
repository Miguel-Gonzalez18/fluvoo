import { cn } from "@/lib/utils";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { KpiStat } from "@/modules/dashboard/employee/types/dashboard.types";

const trendClassMap: Record<KpiStat["trend"], string> = {
  positive: "text-primary-600",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

interface KpiStatCardProps {
  stat: KpiStat;
  className?: string;
}

export function KpiStatCard({ stat, className }: KpiStatCardProps) {
  const Icon = stat.icon;
  const isCurrency = stat.id !== "next-payment";
  const formattedValue = isCurrency ? formatDOP(stat.value) : stat.value;
  const currencyAmount =
    isCurrency && formattedValue.startsWith("RD$ ")
      ? formattedValue.slice(4)
      : null;

  return (
    <DashboardCard className={cn("gap-4 rounded-md py-5", className)}>
      <CardHeader className="gap-2 px-5 pb-0">
        <p className="font-label text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {stat.label}
        </p>
      </CardHeader>
      <CardContent className="px-5">
        <div className="space-y-2">
          {currencyAmount ? (
            <p className="font-heading font-bold tracking-tight text-foreground">
              <span className="text-base font-normal text-muted-foreground sm:text-lg">
                RD${" "}
              </span>
              <span className="text-md sm:text-lg lg:text-xl">{currencyAmount}</span>
            </p>
          ) : (
            <p className="font-heading text-md font-bold tracking-tight text-foreground sm:text-lg lg:text-xl">
              {formattedValue}
            </p>
          )}
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              trendClassMap[stat.trend]
            )}
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span>{stat.subtext}</span>
          </p>
          {stat.breakdown && stat.breakdown.length > 0 ? (
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              {stat.breakdown.map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-2">
                  <span>{item.label}</span>
                  <span className="tabular-nums font-medium">{formatDOP(item.amount)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
