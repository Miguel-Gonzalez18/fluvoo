"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/modules/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/modules/shared/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import {
  EXPENSE_CATEGORIES_LAST_MONTH,
  EXPENSE_CATEGORIES_THIS_MONTH,
  EXPENSE_CHART_CONFIG,
} from "@/modules/dashboard/employee/config/dashboardMock";
import type { CategoryExpense } from "@/modules/dashboard/employee/types/dashboard.types";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";

type PeriodKey = "this-month" | "last-month";

const periodDataMap: Record<PeriodKey, CategoryExpense[]> = {
  "this-month": EXPENSE_CATEGORIES_THIS_MONTH,
  "last-month": EXPENSE_CATEGORIES_LAST_MONTH,
};

const chartConfig = {
  amount: { label: "Gasto", color: "var(--chart-1)" },
  budget: { label: "Presupuesto", color: "var(--muted)" },
  housing: EXPENSE_CHART_CONFIG.housing,
  food: EXPENSE_CHART_CONFIG.food,
  transport: EXPENSE_CHART_CONFIG.transport,
  leisure: EXPENSE_CHART_CONFIG.leisure,
  other: EXPENSE_CHART_CONFIG.other,
} satisfies ChartConfig;

const barFillMap: Record<CategoryExpense["colorKey"], string> = {
  housing: "var(--color-housing)",
  food: "var(--color-food)",
  transport: "var(--color-transport)",
  leisure: "var(--color-leisure)",
  other: "var(--color-other)",
};

interface ExpenseCategoryChartProps {
  className?: string;
}

export function ExpenseCategoryChart({ className }: ExpenseCategoryChartProps) {
  const [period, setPeriod] = useState<PeriodKey>("this-month");

  const chartData = useMemo(
    () =>
      periodDataMap[period].map((item) => ({
        category: item.category,
        amount: item.amount,
        budget: item.budget,
        fill: barFillMap[item.colorKey],
      })),
    [period]
  );

  return (
    <Card
      className={cn(
        "gap-4 rounded-md border-border/60 py-6 shadow-sm",
        className
      )}
    >
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
        <ChartContainer config={chartConfig} className="aspect-4/3 min-h-[260px] w-full">
          <BarChart data={chartData} barGap={-32} barCategoryGap="20%">
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
                  formatter={(value, name) =>
                    name === "budget"
                      ? [`Presupuesto: ${formatDOP(Number(value))}`, ""]
                      : [`Gasto: ${formatDOP(Number(value))}`, ""]
                  }
                />
              }
            />
            <Bar
              dataKey="budget"
              fill="var(--color-budget)"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              opacity={0.35}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
