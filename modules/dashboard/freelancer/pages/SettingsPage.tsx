import { NotificationPreferences } from "@/modules/notifications/components/NotificationPreferences";

export function FreelancerSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra cómo quieres recibir avisos de Fluvoo.
        </p>
      </div>
      <NotificationPreferences />
    </div>
  );
}
