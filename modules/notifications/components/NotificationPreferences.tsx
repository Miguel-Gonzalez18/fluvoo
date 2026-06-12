"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getNotificationPreferencesAction,
  saveNotificationPreferencesAction,
} from "@/modules/notifications/actions/notification-preferences-actions";
import { usePushSubscription } from "@/modules/notifications/hooks/usePushSubscription";
import { DashboardCard } from "@/modules/dashboard/shared/DashboardCard";
import { Button } from "@/modules/shared/components/ui/button";
import { CardContent, CardHeader } from "@/modules/shared/components/ui/card";
import { Label } from "@/modules/shared/components/ui/label";
import { Switch } from "@/modules/shared/components/ui/switch";

export function NotificationPreferences() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { subscribe, isSubscribing, isSubscribed, error: pushError } =
    usePushSubscription();

  useEffect(() => {
    let mounted = true;

    getNotificationPreferencesAction().then((preferences) => {
      if (!mounted) return;
      setEmailEnabled(preferences.emailEnabled);
      setPushEnabled(preferences.pushEnabled);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const persistPreferences = (nextEmail: boolean, nextPush: boolean) => {
    startTransition(async () => {
      const result = await saveNotificationPreferencesAction({
        emailEnabled: nextEmail,
        pushEnabled: nextPush,
        minAmountDop: 0,
      });

      setSaveMessage(
        result.success
          ? "Preferencias guardadas."
          : result.error ?? "No se pudieron guardar las preferencias."
      );
    });
  };

  const handleEmailChange = (checked: boolean) => {
    setEmailEnabled(checked);
    persistPreferences(checked, pushEnabled);
  };

  const handlePushChange = (checked: boolean) => {
    setPushEnabled(checked);
    persistPreferences(emailEnabled, checked);
  };

  return (
    <DashboardCard className="rounded-md py-5">
      <CardHeader className="gap-2 px-5 pb-0">
        <p className="font-label text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Notificaciones
        </p>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Avisos de gastos nuevos
        </h2>
        <p className="text-sm text-muted-foreground">
          Recibe alertas cuando Fluvoo detecte un gasto en tu correo, con el
          análisis IA actualizado y el resumen del mes.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 px-5 pt-4">
        <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-primary" />
            <div>
              <Label htmlFor="email-notifications" className="text-base">
                Email
              </Label>
              <p className="text-sm text-muted-foreground">
                Te enviamos un correo con el gasto, margen y análisis IA.
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={emailEnabled}
            disabled={isLoading || isPending}
            onCheckedChange={handleEmailChange}
          />
        </div>

        <div className="space-y-3 rounded-md border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Bell className="mt-0.5 size-5 text-primary" />
              <div>
                <Label htmlFor="push-notifications" className="text-base">
                  Web Push
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificación en el navegador aunque no tengas Fluvoo abierto.
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={pushEnabled}
              disabled={isLoading || isPending}
              onCheckedChange={handlePushChange}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={!pushEnabled || isSubscribing}
            onClick={() => subscribe()}
          >
            {isSubscribed ? "Notificaciones activadas" : "Activar en este dispositivo"}
          </Button>

          {pushError ? (
            <p className="text-sm text-destructive">{pushError}</p>
          ) : null}
        </div>

        {saveMessage ? (
          <p
            className={cn(
              "text-sm",
              saveMessage.includes("guardadas")
                ? "text-primary"
                : "text-destructive"
            )}
          >
            {saveMessage}
          </p>
        ) : null}
      </CardContent>
    </DashboardCard>
  );
}
