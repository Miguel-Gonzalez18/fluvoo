"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { EntityCardProps } from "./entity-card.types";

export function EntityCard({ title, subtitle, onEdit, onDelete }: EntityCardProps) {
  return (
    <div className="flex items-center justify-between bg-background rounded-lg p-3">
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground"
          onClick={onEdit}
        >
          Editar
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
