import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/avatar";
import { Button } from "@/modules/shared/components/ui/button";
import { ThemeToggle } from "@/modules/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  formatLongDate,
  getInitials,
} from "@/modules/dashboard/employee/lib/formatDate";
import { getTimeGreeting } from "@/modules/dashboard/employee/lib/greeting";

interface DashboardHeaderProps {
  name: string;
  className?: string;
}

export function DashboardHeader({ name, className }: DashboardHeaderProps) {
  const greeting = getTimeGreeting();
  const todayLabel = formatLongDate();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {greeting}, {name}
        </h1>
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
      </div>

      <div className="flex items-center gap-1 self-end sm:self-auto">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificaciones"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </Button>

        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary-100 text-xs font-semibold text-primary-800">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
