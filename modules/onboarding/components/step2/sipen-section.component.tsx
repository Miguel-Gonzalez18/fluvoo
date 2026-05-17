"use client";

import { Briefcase } from "lucide-react";
import { Switch } from "@/modules/shared/components/ui/switch";
import { SipenSectionProps } from "../../types/step2/financial.types";
import { SIPEN_CONFIG } from "../../config/financial";

export function SipenSection({ data, onUpdate }: SipenSectionProps) {
  const isContributing = data.contributesSipen ?? true;

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm">
              ARS - Seguro de Salud
              <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Obligatorio</span>
            </h4>
            <p className="text-xs text-muted-foreground">Seguro Familiar de Salud (SFS)</p>
          </div>
        </div>
        <Switch
          checked={isContributing}
          disabled={SIPEN_CONFIG.isMandatory}
          onCheckedChange={(checked) => onUpdate({ contributesSipen: checked })}
        />
      </div>
      <div className="ml-13 pl-4 border-l-2 border-primary/20">
        <div className="bg-primary/5 rounded-lg px-3 py-2 inline-flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-primary">{SIPEN_CONFIG.label}</span>
          <span className="text-xs text-muted-foreground">{SIPEN_CONFIG.description}</span>
        </div>
      </div>
    </div>
  );
}
