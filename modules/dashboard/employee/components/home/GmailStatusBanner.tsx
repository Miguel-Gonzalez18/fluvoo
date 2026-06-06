import { AlertCircle, CheckCircle2, Loader2, Mail, MailX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/modules/dashboard/employee/lib/formatTransactionDate";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";

interface GmailStatusBannerProps {
  status: GmailStatus;
  className?: string;
}

const statusConfig = {
  disconnected: {
    icon: MailX,
    title: "Gmail no conectado",
    description:
      "Conecta tu correo en el onboarding para importar movimientos bancarios automáticamente.",
    className: "border-border/60 bg-muted/40",
    iconClassName: "text-muted-foreground",
  },
  active: {
    icon: CheckCircle2,
    title: "Gmail conectado",
    description: null as string | null,
    className: "border-primary-100 bg-primary-50/60 dark:border-primary-900 dark:bg-primary-950/30",
    iconClassName: "text-primary-600",
  },
  error: {
    icon: AlertCircle,
    title: "Error al sincronizar Gmail",
    description: null as string | null,
    className: "border-destructive/30 bg-destructive/5",
    iconClassName: "text-destructive",
  },
  syncing: {
    icon: Loader2,
    title: "Sincronizando transacciones",
    description: "Estamos importando tus movimientos bancarios desde Gmail.",
    className: "border-border/60 bg-muted/40",
    iconClassName: "text-muted-foreground animate-spin",
  },
  pending: {
    icon: Mail,
    title: "Gmail conectado",
    description: "La primera sincronización está pendiente.",
    className: "border-border/60 bg-muted/40",
    iconClassName: "text-muted-foreground",
  },
} as const;

function resolveStatusKey(status: GmailStatus): keyof typeof statusConfig {
  if (!status.connected) {
    return "disconnected";
  }

  if (status.syncStatus === "error") {
    return "error";
  }

  if (status.syncStatus === "syncing") {
    return "syncing";
  }

  if (status.syncStatus === "pending") {
    return "pending";
  }

  return "active";
}

export function GmailStatusBanner({ status, className }: GmailStatusBannerProps) {
  const statusKey = resolveStatusKey(status);
  const config = statusConfig[statusKey];
  const Icon = config.icon;

  const detail =
    statusKey === "error" && status.syncError
      ? status.syncError
      : statusKey === "active" && status.connected
        ? `Última sincronización ${formatRelativeTime(status.lastSyncAt)}${
            status.googleEmail ? ` · ${status.googleEmail}` : ""
          }`
        : config.description;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 shadow-sm",
        config.className,
        className
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconClassName)} />
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{config.title}</p>
        {detail ? (
          <p className="text-sm text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
