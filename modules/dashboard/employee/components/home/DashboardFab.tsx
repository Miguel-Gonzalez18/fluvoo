"use client";

import { Plus } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardFabProps {
  className?: string;
}

export function DashboardFab({ className }: DashboardFabProps) {
  return (
    <Button
      type="button"
      size="icon-lg"
      aria-label="Acción rápida"
      className={cn(
        "fixed bottom-6 right-6 z-40 size-14 rounded-2xl bg-foreground text-background shadow-lg hover:bg-foreground/90",
        className
      )}
    >
      <Plus className="size-6" />
    </Button>
  );
}
