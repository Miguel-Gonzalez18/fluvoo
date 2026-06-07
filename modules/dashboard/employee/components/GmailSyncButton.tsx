"use client";

import { Mail, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";
import { startGmailConnect } from "@/modules/gmail/actions/gmail-connect-actions";
import { triggerGmailSync } from "@/modules/gmail/actions/gmail-sync-actions";
import { Button } from "@/modules/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/components/ui/tooltip";

interface GmailSyncButtonProps {
  status: GmailStatus;
}

function buildConnectedTooltip(status: GmailStatus): string {
  const lastSync = formatRelativeTime(status.lastSyncAt);
  const emailPart = status.googleEmail ? ` · ${status.googleEmail}` : "";
  const errorPart =
    status.syncStatus === "error" && status.syncError
      ? ` · Error: ${status.syncError}`
      : "";

  return `Gmail conectado: Última sincronización ${lastSync}${emailPart}${errorPart}`;
}

export function GmailSyncButton({ status }: GmailSyncButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const gmail = searchParams.get("gmail");
    const message = searchParams.get("message");
    const imported = searchParams.get("imported");
    const sync = searchParams.get("sync");
    const syncMessage = searchParams.get("syncMessage");

    if (!gmail) return;

    if (gmail === "connected") {
      if (sync === "error") {
        sileo.error({
          title: syncMessage || "Error al sincronizar transacciones",
        });
      } else {
        sileo.success({
          title: imported
            ? `Gmail conectado · ${imported} transacciones importadas`
            : "Gmail conectado correctamente",
        });
      }
    } else if (gmail === "error") {
      sileo.error({
        title: message || "Error al conectar Gmail",
      });
    }

    router.replace("/employee/home");
  }, [searchParams, router]);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const result = await startGmailConnect();
      if (result.authUrl) {
        window.location.href = result.authUrl;
        return;
      }
      sileo.error({ title: result.error || "No se pudo iniciar la conexión con Gmail" });
    } catch {
      sileo.error({ title: "Error al conectar Gmail" });
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleSync = useCallback(() => {
    if (isSyncing) return;

    setIsSyncing(true);

    sileo.promise(
      async () => {
        try {
          const result = await triggerGmailSync();
          if (result.error || !result.success) {
            throw new Error(result.error || "Error al sincronizar transacciones");
          }
          router.refresh();
          return result;
        } finally {
          setIsSyncing(false);
        }
      },
      {
        loading: { title: "Sincronizando transacciones..." },
        success: (result) => {
          if (result.imported > 0) {
            return { title: `${result.imported} transacciones importadas` };
          }
          if (result.processed === 0) {
            return { title: "No se encontraron correos bancarios recientes" };
          }
          const noAmount = result.skippedNoAmount ?? 0;
          const skipped = result.skipped ?? 0;
          return {
            title: `0 importadas · ${skipped} correos omitidos (${noAmount} sin monto legible)`,
          };
        },
        error: (error) => ({
          title:
            error instanceof Error
              ? error.message
              : "Error al sincronizar transacciones",
        }),
      }
    );
  }, [isSyncing, router]);

  if (!status.connected) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 px-2.5"
        onClick={handleConnect}
        disabled={isConnecting}
        aria-label="Conectar Gmail"
      >
        <Mail className="size-3.5" />
        <span className="text-xs font-medium">Conectar</span>
      </Button>
    );
  }

  const isSpinning = isSyncing || status.syncStatus === "syncing";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          onClick={handleSync}
          disabled={isSyncing}
          aria-label="Sincronizar transacciones de Gmail"
        >
          <RefreshCw
            className={cn("size-4", isSpinning && "animate-spin")}
          />
          {status.syncStatus === "error" ? (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
          ) : null}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs text-center">
        {buildConnectedTooltip(status)}
      </TooltipContent>
    </Tooltip>
  );
}
