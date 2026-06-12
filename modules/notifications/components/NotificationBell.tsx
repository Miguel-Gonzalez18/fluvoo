"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDOP } from "@/modules/dashboard/employee/lib/formatCurrency";
import { formatRelativeTime } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import {
  getNotificationsInboxAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/modules/notifications/actions/notification-inbox-actions";
import type { UserNotificationItem } from "@/modules/notifications/types/notification.types";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/shared/components/ui/sheet";

function buildExpenseSummary(notification: UserNotificationItem): string {
  const { newExpenses } = notification.payload;
  if (newExpenses.length === 0) return "Gasto detectado";

  const primary = newExpenses[0];
  if (newExpenses.length === 1) {
    return `${primary.merchant} · ${formatDOP(primary.amountDop)}`;
  }

  return `${newExpenses.length} gastos nuevos · ${formatDOP(primary.amountDop)} y más`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<UserNotificationItem[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshInbox = useCallback(async () => {
    const inbox = await getNotificationsInboxAction();
    setNotifications(inbox.notifications);
    setUnreadCount(inbox.unreadCount);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshInbox();
  }, [refreshInbox]);

  useEffect(() => {
    if (open) {
      void refreshInbox();
    }
  }, [open, refreshInbox]);

  const handleNotificationClick = async (notification: UserNotificationItem) => {
    if (!notification.readAt) {
      await markNotificationReadAction(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }

    setOpen(false);
    router.push(notification.payload.deepLink || "/employee");
  };

  const handleMarkAllRead = async () => {
    const result = await markAllNotificationsReadAction();
    if (!result.success) return;

    const now = new Date().toISOString();
    setNotifications((current) =>
      current.map((item) => ({ ...item, readAt: item.readAt ?? now }))
    );
    setUnreadCount(0);
  };

  const badgeLabel =
    unreadCount > 9 ? "9+" : unreadCount > 0 ? String(unreadCount) : null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notificaciones, ${unreadCount} sin leer`
              : "Notificaciones"
          }
        >
          <Bell className="size-5" />
          {badgeLabel ? (
            <span className="absolute top-1 right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {badgeLabel}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-4 py-4">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <SheetTitle>Notificaciones</SheetTitle>
              <SheetDescription>
                Alertas de gastos detectados y resumen del mes.
              </SheetDescription>
            </div>
            {unreadCount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => void handleMarkAllRead()}
              >
                Marcar leídas
              </Button>
            ) : null}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : notifications.length === 0 ? (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Aún no hay alertas. Cuando detectemos un gasto nuevo te avisaremos
                por email, push o aquí.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/employee/settings">
                  <Settings className="size-4" />
                  Configurar avisos
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => void handleNotificationClick(notification)}
                    className={cn(
                      "w-full rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/50",
                      !notification.readAt && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">
                        {buildExpenseSummary(notification)}
                      </p>
                      {!notification.readAt ? (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRelativeTime(notification.createdAt)} · Gastos mes{" "}
                      {formatDOP(notification.payload.monthlyExpenses)} · Margen{" "}
                      {formatDOP(notification.payload.marginMonthly)}
                    </p>
                    {notification.payload.aiDiagnosis ? (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {truncateText(notification.payload.aiDiagnosis, 140)}
                      </p>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="border-t border-border px-4 py-3">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/employee/settings">
                <Settings className="size-4" />
                Preferencias de notificaciones
              </Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
