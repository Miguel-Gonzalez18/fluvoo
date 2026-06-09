"use client";

import { useMemo } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { CardContent } from "@/modules/shared/components/ui/card";
import type { FiscalAnalysisData } from "@/modules/dashboard/employee/types/dashboard.types";
import { useSequentialTypewriter } from "@/modules/shared/hooks/useSequentialTypewriter";
import { getFiscalTipIcon } from "@/modules/shared/ai/fiscal-tip-icons";

interface FiscalAnalysisCardProps {
  analysis: FiscalAnalysisData;
  className?: string;
}

function TypewriterCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-px animate-pulse bg-primary-600 align-middle dark:bg-primary-400"
    />
  );
}

export function FiscalAnalysisCard({
  analysis,
  className,
}: FiscalAnalysisCardProps) {
  const segments = useMemo(
    () => [
      analysis.diagnosis,
      ...analysis.tips.flatMap((tip) => [tip.title, tip.description]),
    ],
    [analysis]
  );

  const { displayed, activeSegmentIndex, isComplete, isTyping } =
    useSequentialTypewriter(segments, {
      initialDelay: 450,
      speed: 14,
      pauseBetween: 160,
    });

  const diagnosisText = displayed[0] ?? "";
  const showTips = activeSegmentIndex >= 1 || isComplete;

  return (
    <DashboardCard
      className={cn(
        "gap-5 rounded-md bg-primary-300/20 py-6 dark:bg-primary-800/40",
        className
      )}
    >
      <CardContent className="space-y-5 px-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles
              className={cn(
                "size-4 text-primary-600",
                isTyping && "animate-pulse"
              )}
            />
            <h2 className="font-label text-xs font-semibold uppercase tracking-wide text-primary-800 dark:text-primary-200">
              Análisis financiero IA
            </h2>
          </div>
          <p
            className="min-h-18 text-sm leading-relaxed text-foreground"
            aria-live="polite"
          >
            {diagnosisText}
            <TypewriterCursor visible={activeSegmentIndex === 0} />
          </p>
          <p
            className={cn(
              "text-[11px] leading-relaxed text-primary-900 transition-opacity duration-500",
              showTips ? "opacity-100" : "opacity-0"
            )}
          >
            Orientación personal basada en tus datos. No sustituye asesoría fiscal
            profesional.
          </p>
        </div>

        <div
          className={cn(
            "space-y-3 transition-opacity duration-500",
            showTips ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {analysis.tips.map((tip, tipIndex) => {
            const Icon = getFiscalTipIcon(tip.iconKey);
            const titleSegmentIndex = 1 + tipIndex * 2;
            const descriptionSegmentIndex = titleSegmentIndex + 1;
            const titleText = displayed[titleSegmentIndex] ?? "";
            const descriptionText = displayed[descriptionSegmentIndex] ?? "";
            const isTipActive =
              activeSegmentIndex >= titleSegmentIndex || isComplete;
            const isTipDone =
              isComplete || activeSegmentIndex > descriptionSegmentIndex;

            if (!isTipActive) return null;

            return (
              <button
                key={tip.id}
                type="button"
                className={cn(
                  "flex w-full animate-in fade-in slide-in-from-bottom-1 items-center gap-3 rounded-sm bg-card p-4 text-left duration-300",
                  isTipDone && "hover:bg-muted/40"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-primary-700 transition-opacity duration-300",
                    titleText ? "opacity-100" : "opacity-40"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="min-h-5 text-sm font-semibold text-primary-700 dark:text-primary-300/80">
                    {titleText}
                    <TypewriterCursor
                      visible={activeSegmentIndex === titleSegmentIndex}
                    />
                  </p>
                  <p className="min-h-8 text-xs leading-relaxed text-black">
                    {descriptionText}
                    <TypewriterCursor
                      visible={activeSegmentIndex === descriptionSegmentIndex}
                    />
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-opacity duration-300",
                    isTipDone ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            );
          })}
        </div>
      </CardContent>
    </DashboardCard>
  );
}
