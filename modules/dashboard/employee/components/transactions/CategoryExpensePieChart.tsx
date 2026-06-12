"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/shared/components/ui/chart";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";

function chartFill(colorIndex: CategoryExpense["colorIndex"]): string {
  return `var(--chart-${colorIndex})`;
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

interface CategoryPieLegendProps {
  data: Array<{
    slug: string;
    category: string;
    amount: number;
    fill: string;
  }>;
}

function CategoryPieLegend({ data }: CategoryPieLegendProps) {
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1 pb-1">
      {data.map((entry) => {
        const pct =
          total > 0 ? Math.round((entry.amount / total) * 100) : 0;

        return (
          <div
            key={entry.slug}
            className="flex items-center gap-1.5 text-xs text-foreground"
          >
            <div
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: entry.fill }}
            />
            <span>
              {entry.category}{" "}
              <span className="text-muted-foreground">({pct}%)</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface CategoryExpensePieChartProps {
  categories: CategoryExpense[];
  periodLabel: string;
  className?: string;
}

export function CategoryExpensePieChart({
  categories,
  periodLabel,
  className,
}: CategoryExpensePieChartProps) {
  const { ref: chartContainerRef, ready: chartReady } =
    useChartContainerReady<HTMLDivElement>();

  const chartData = useMemo(
    () =>
      categories.map((item) => ({
        slug: item.slug,
        category: item.category,
        fullLabel: item.fullLabel,
        amount: item.amount,
        fill: chartFill(item.colorIndex),
      })),
    [categories]
  );

  const chartConfig = useMemo(
    () =>
      categories.reduce<ChartConfig>((acc, item) => {
        acc[item.category] = {
          label: item.category,
          color: chartFill(item.colorIndex),
        };
        return acc;
      }, {}),
    [categories]
  );

  const isEmpty = chartData.length === 0;
  const topCategory = chartData[0];

  return (
    <DashboardCard className={cn("gap-4 rounded-md py-6", className)}>
      <CardHeader className="space-y-1 px-5 pb-0">
        <h2 className="font-heading text-base font-semibold text-foreground">
          Gastos por Categoría
        </h2>
        <p className="text-sm text-muted-foreground">{periodLabel}</p>
      </CardHeader>

      <CardContent className="px-2 pb-4 sm:px-5">
        {isEmpty ? (
          <div className="flex min-h-[280px] items-center justify-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sin gastos categorizados en este periodo
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex w-full max-w-[360px] flex-col gap-4">
              <div
                ref={chartContainerRef}
                className="h-[240px] min-h-[240px] w-full"
              >
                {chartReady ? (
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-square h-full min-h-[240px] w-full"
                  >
                    <PieChart>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelFormatter={(_, payload) => {
                              const item = payload?.[0]?.payload as
                                | { fullLabel?: string; category?: string }
                                | undefined;
                              return item?.fullLabel ?? item?.category ?? "";
                            }}
                            formatter={(value) => [
                              `Gasto: ${formatDOP(Number(value))}`,
                              "",
                            ]}
                          />
                        }
                      />
                      <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={0}
                        strokeWidth={2}
                      >
                        {chartData.map((entry) => (
                          <Cell key={entry.slug} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="h-full w-full rounded-md bg-muted/30" aria-hidden />
                )}
              </div>

              {chartReady ? <CategoryPieLegend data={chartData} /> : null}
            </div>

            <p className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
              {topCategory
                ? `${topCategory.category} concentra la mayor parte de tus gastos`
                : "Distribución de gastos por categoría"}
            </p>
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}
