"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/shared/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";

type PeriodKey = "this-month" | "last-month";

const chartConfig = {
  amount: { label: "Gasto", color: "var(--chart-1)" },
} satisfies ChartConfig;

function chartFill(colorIndex: CategoryExpense["colorIndex"]): string {
  return `var(--chart-${colorIndex})`;
}

interface ExpenseCategoryChartProps {
  thisMonth: CategoryExpense[];
  lastMonth: CategoryExpense[];
  className?: string;
}

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

export function ExpenseCategoryChart({
  thisMonth,
  lastMonth,
  className,
}: ExpenseCategoryChartProps) {
  const [period, setPeriod] = useState<PeriodKey>("this-month");
  const { ref: chartContainerRef, ready: chartReady } =
    useChartContainerReady<HTMLDivElement>();

  const periodData = period === "this-month" ? thisMonth : lastMonth;

  const chartData = useMemo(
    () =>
      periodData.map((item) => ({
        category: item.category,
        fullLabel: item.fullLabel,
        amount: item.amount,
        fill: chartFill(item.colorIndex),
      })),
    [periodData]
  );

  const isEmpty = chartData.length === 0;

  return (
    <DashboardCard className={cn("gap-4 rounded-md py-6", className)}>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 px-5 pb-0">
        <h2 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Gastos por Categoría
        </h2>
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as PeriodKey)}
        >
          <TabsList className="h-8 bg-muted">
            <TabsTrigger value="this-month" className="px-3">
              Este Mes
            </TabsTrigger>
            <TabsTrigger value="last-month" className="px-3">
              Pasado
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="px-2 pb-2 sm:px-5">
        {isEmpty ? (
          <div className="flex min-h-[260px] items-center justify-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              {period === "this-month"
                ? "Sin gastos categorizados este mes"
                : "Sin gastos categorizados el mes pasado"}
            </p>
          </div>
        ) : (
          <div
            ref={chartContainerRef}
            className="h-[320px] min-h-[320px] min-w-0 w-full"
          >
            {chartReady ? (
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-full min-h-[320px] min-w-0 w-full"
              >
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="font-label text-[11px]"
                  />
                  <YAxis hide domain={[0, "dataMax + 2000"]} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) => {
                          const item = payload?.[0]?.payload as
                            | { fullLabel?: string }
                            | undefined;
                          return item?.fullLabel ?? "";
                        }}
                        formatter={(value) => [
                          `Gasto: ${formatDOP(Number(value))}`,
                          "",
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={48}>
                    {chartData.map((entry) => (
                      <Cell key={entry.category} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-full w-full rounded-md bg-muted/30" aria-hidden />
            )}
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}
