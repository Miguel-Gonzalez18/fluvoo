import { Suspense } from "react";
import { GmailSyncButton } from "@/modules/dashboard/employee/components/GmailSyncButton";
import { NotificationBell } from "@/modules/notifications/components/NotificationBell";
import {
  formatLongDate,
  getInitials,
} from "@/modules/dashboard/employee/lib/formatDate";
import { getTimeGreeting } from "@/modules/dashboard/employee/lib/greeting";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";
import { ThemeToggle } from "@/modules/shared/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  name: string;
  gmailStatus: GmailStatus;
  className?: string;
}

export function DashboardHeader({
  name,
  gmailStatus,
  className,
}: DashboardHeaderProps) {
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
        <Suspense fallback={null}>
          <GmailSyncButton status={gmailStatus} />
        </Suspense>

        <ThemeToggle />

        <Suspense fallback={null}>
          <NotificationBell />
        </Suspense>

        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary-100 text-xs font-semibold text-primary-800">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
