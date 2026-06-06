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
  const displayValue =
    stat.id === "next-payment" ? stat.value : formatDOP(stat.value);

  return (
    <DashboardCard className={cn("gap-4 rounded-md py-5", className)}>
      <CardHeader className="gap-2 px-5 pb-0">
        <p className="font-label text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {stat.label}
        </p>
      </CardHeader>
      <CardContent className="px-5">
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-2">
            <p className="font-heading text-md font-bold tracking-tight text-foreground sm:text-lg lg:text-xl">
              {displayValue}
            </p>
            <p className={cn("text-sm font-medium", trendClassMap[stat.trend])}>
              {stat.subtext}
            </p>
          </div>
          {Icon ? (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                stat.trend === "positive" && "bg-primary-50 text-primary-600",
                stat.trend === "negative" && "bg-destructive/10 text-destructive",
                stat.trend === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
