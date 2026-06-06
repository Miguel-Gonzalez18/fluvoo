import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/modules/shared/components/ui/card";
import {
  FISCAL_ANALYSIS_DESCRIPTION,
  FISCAL_TIPS,
} from "@/modules/dashboard/employee/config/dashboardMock";

interface FiscalAnalysisCardProps {
  className?: string;
}

export function FiscalAnalysisCard({ className }: FiscalAnalysisCardProps) {
  return (
    <Card
      className={cn(
        "gap-5 rounded-2xl border-primary-100 bg-primary-50/70 py-6 shadow-sm",
        className
      )}
    >
      <CardContent className="space-y-5 px-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary-600" />
            <h2 className="font-label text-xs font-semibold uppercase tracking-wide text-primary-800">
              Análisis Fiscal IA
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {FISCAL_ANALYSIS_DESCRIPTION}
          </p>
        </div>

        <div className="space-y-3">
          {FISCAL_TIPS.map((tip) => {
            const Icon = tip.icon;

            return (
              <button
                key={tip.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-white p-4 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {tip.title}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
