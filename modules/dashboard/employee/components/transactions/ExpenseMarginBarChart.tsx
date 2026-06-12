"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardFooter, CardHeader } from "@/modules/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/shared/components/ui/chart";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { ExpenseMarginBucket } from "@/modules/dashboard/employee/types/transactions.types";

const chartConfig = {
  expenses: { label: "Gastos", color: "var(--chart-1)" },
} satisfies ChartConfig;

function useChartContainerReady<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setReady(width > 0 && height > 0);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, ready };
}

interface ExpenseMarginBarChartProps {
  buckets: ExpenseMarginBucket[];
  periodLabel: string;
  className?: string;
}

export function ExpenseMarginBarChart({
  buckets,
  periodLabel,
  className,
}: ExpenseMarginBarChartProps) {
  const { ref: chartContainerRef, ready: chartReady } =
    useChartContainerReady<HTMLDivElement>();

  const chartData = useMemo(
    () =>
      buckets.map((bucket) => ({
        label: bucket.label,
        expenses: bucket.expenses,
        marginPct: bucket.marginPct,
      })),
    [buckets]
  );

  const isEmpty = chartData.every((item) => item.expenses === 0);
  const lastBucket = chartData[chartData.length - 1];
  const prevBucket = chartData[chartData.length - 2];
  const marginTrend =
    lastBucket && prevBucket
      ? lastBucket.marginPct - prevBucket.marginPct
      : 0;

  return (
    <DashboardCard className={cn("gap-4 rounded-md py-6", className)}>
      <CardHeader className="space-y-1 px-5 pb-0">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Gastos vs Margen
        </h2>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </CardHeader>

      <CardContent className="px-2 pb-2 sm:px-5">
        {isEmpty ? (
          <div className="flex min-h-[280px] items-center justify-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sin datos de gastos en este periodo
            </p>
          </div>
        ) : (
          <div
            ref={chartContainerRef}
            className="h-[300px] min-h-[300px] min-w-0 w-full"
          >
            {chartReady ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-full min-h-[300px] min-w-0 w-full"
              >
                <BarChart data={chartData} margin={{ top: 28 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="font-label text-[11px]"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value, _name, item) => {
                          const payload = item.payload as {
                            marginPct?: number;
                          };
                          return [
                            `${formatDOP(Number(value))} · Margen ${payload.marginPct ?? 0}%`,
                            "Gastos",
                          ];
                        }}
                      />
                    }
                  />
                  <Bar
                    dataKey="expenses"
                    fill="var(--color-expenses)"
                    radius={[8, 8, 8, 8]}
                    maxBarSize={40}
                  >
                    <LabelList
                      dataKey="expenses"
                      position="top"
                      className="fill-foreground text-[10px] font-medium tabular-nums"
                      formatter={(value) => formatDOP(Number(value ?? 0))}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-full w-full rounded-md bg-muted/30" aria-hidden />
            )}
          </div>
        )}
      </CardContent>

      {!isEmpty && lastBucket ? (
        <CardFooter className="flex-col items-start gap-1 px-5 pt-0 text-sm">
          <div className="flex items-center gap-1 font-medium leading-none">
            {marginTrend >= 0 ? "Margen al alza" : "Margen a la baja"} en{" "}
            {Math.abs(marginTrend)} pts
            <TrendingUp
              className={cn(
                "size-4",
                marginTrend < 0 && "rotate-180 text-destructive"
              )}
            />
          </div>
          <p className="text-muted-foreground">
            Porcentaje de margen sobre ingreso prorrateado por periodo
          </p>
        </CardFooter>
      ) : null}
    </DashboardCard>
  );
}
