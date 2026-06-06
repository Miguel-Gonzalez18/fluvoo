"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useDashboardTheme } from "@/modules/dashboard/shared/DashboardThemeProvider";
import { Button } from "@/modules/shared/components/ui/button";

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme } = useDashboardTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )
      ) : (
        <Sun className="size-5 opacity-0" aria-hidden />
      )}
    </Button>
  );
}
