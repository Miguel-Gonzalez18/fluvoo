"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CircleHelp, TrendingUp } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/components/ui/tooltip";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { ExpenseMarginBucket } from "@/modules/dashboard/employee/types/transactions.types";

const BAR_SIZE = 40;

const PRORATED_INCOME_HELP =
  "Parte de tu ingreso neto mensual repartida por día en cada tramo del gráfico. Te permite comparar cuánto gastaste frente a cuánto te correspondía en ese periodo. No es el pago exacto de esos días.";

const chartConfig = {
  proratedIncome: {
    label: "Ingreso prorrateado",
    color: "var(--chart-2)",
  },
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

function ExpenseMarginChartLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className="size-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: "var(--chart-1)" }}
          aria-hidden
        />
        <span>Gastos</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className="size-2 shrink-0 rounded-[2px] opacity-35"
          style={{ backgroundColor: "var(--chart-2)" }}
          aria-hidden
        />
        <span>Ingreso prorrateado</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Qué es ingreso prorrateado"
              className="inline-flex text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              <CircleHelp className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-[240px] border-border bg-muted text-muted-foreground"
          >
            {PRORATED_INCOME_HELP}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

interface ExpenseMarginBarChartProps {
  buckets: ExpenseMarginBucket[];
  periodLabel: string;
  periodName: string;
  className?: string;
}

export function ExpenseMarginBarChart({
  buckets,
  periodLabel,
  periodName,
  className,
}: ExpenseMarginBarChartProps) {
  const { ref: chartContainerRef, ready: chartReady } =
    useChartContainerReady<HTMLDivElement>();

  const chartData = useMemo(
    () =>
      buckets.map((bucket) => ({
        label: bucket.label,
        expenses: bucket.expenses,
        proratedIncome: bucket.proratedIncome,
        marginPct: bucket.marginPct,
        marginAmount: bucket.marginAmount,
      })),
    [buckets]
  );

  const periodTotals = useMemo(() => {
    const totalExpenses = buckets.reduce((sum, b) => sum + b.expenses, 0);
    const totalIncome = buckets.reduce((sum, b) => sum + b.proratedIncome, 0);
    const totalMargin = Math.round((totalIncome - totalExpenses) * 100) / 100;
    const marginPct =
      totalIncome > 0 ? Math.round((totalMargin / totalIncome) * 100) : 0;

    return {
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalMargin,
      marginPct,
    };
  }, [buckets]);

  const isEmpty = chartData.every(
    (item) => item.expenses === 0 && item.proratedIncome === 0
  );
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
          <>
            <div
              ref={chartContainerRef}
              className="h-[300px] min-h-[300px] min-w-0 w-full"
            >
              {chartReady ? (
                <ChartContainer
                  config={chartConfig}
                  className="aspect-auto h-full min-h-[300px] min-w-0 w-full"
                >
                  <BarChart
                    data={chartData}
                    margin={{ top: 28 }}
                    barGap={-BAR_SIZE}
                  >
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
                          formatter={(value, name, item) => {
                            const payload = item.payload as {
                              marginPct?: number;
                            };
                            if (name === "expenses") {
                              return [
                                `${formatDOP(Number(value))} · Margen ${payload.marginPct ?? 0}%`,
                                "Gastos",
                              ];
                            }
                            return [
                              formatDOP(Number(value)),
                              "Ingreso prorrateado",
                            ];
                          }}
                        />
                      }
                    />
                    <Bar
                      dataKey="proratedIncome"
                      fill="var(--color-proratedIncome)"
                      radius={[8, 8, 8, 8]}
                      maxBarSize={BAR_SIZE}
                      fillOpacity={0.35}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="var(--color-expenses)"
                      radius={[8, 8, 8, 8]}
                      maxBarSize={BAR_SIZE}
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
            <ExpenseMarginChartLegend />
          </>
        )}
      </CardContent>

      {!isEmpty && lastBucket ? (
        <CardFooter className="flex-col items-start gap-3 px-5 pt-0 text-sm">
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

          <div className="w-full space-y-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total del periodo · {periodName}
            </p>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Total gastado</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatDOP(periodTotals.totalExpenses)}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Margen</span>
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    periodTotals.totalMargin >= 0
                      ? "text-foreground"
                      : "text-destructive"
                  )}
                >
                  {formatDOP(periodTotals.totalMargin)}
                  {periodTotals.totalIncome > 0 && (
                    <span className="ml-1 font-normal text-muted-foreground">
                      ({periodTotals.marginPct}%)
                    </span>
                  )}
                </span>
              </li>
            </ul>
          </div>
        </CardFooter>
      ) : null}
    </DashboardCard>
  );
}
