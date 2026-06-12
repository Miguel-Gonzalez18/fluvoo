"use client";

import { useState } from "react";
import { CategoryExpensePieChart } from "@/modules/dashboard/employee/components/transactions/CategoryExpensePieChart";
import { ExpenseMarginBarChart } from "@/modules/dashboard/employee/components/transactions/ExpenseMarginBarChart";
import { Tabs, TabsList, TabsTrigger } from "@/modules/shared/components/ui/tabs";
import {
  CHART_PERIOD_LABELS,
  CHART_PERIODS,
  type ChartPeriod,
  type TransactionsPageData,
} from "@/modules/dashboard/employee/types/transactions.types";

interface TransactionsChartsSectionProps {
  chartData: TransactionsPageData["chartData"];
}

export function TransactionsChartsSection({
  chartData,
}: TransactionsChartsSectionProps) {
  const [period, setPeriod] = useState<ChartPeriod>("30d");
  const activeData = chartData[period];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-label text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Análisis de Gastos
        </h2>
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as ChartPeriod)}
        >
          <TabsList className="h-8 bg-muted">
            {CHART_PERIODS.map((key) => (
              <TabsTrigger key={key} value={key} className="px-3 text-xs">
                {CHART_PERIOD_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryExpensePieChart
          categories={activeData.categories}
          periodLabel={activeData.periodLabel}
        />
        <ExpenseMarginBarChart
          buckets={activeData.marginBuckets}
          periodLabel={activeData.periodLabel}
        />
      </div>
    </section>
  );
}
