"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dashboard-theme";

type DashboardTheme = "light" | "dark";

interface DashboardThemeContextValue {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
}

const DashboardThemeContext =
  createContext<DashboardThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readTheme(): DashboardTheme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function writeTheme(theme: DashboardTheme) {
  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.classList.remove("dark");
  emitChange();
}

interface DashboardThemeProviderProps {
  children: React.ReactNode;
}

export function DashboardThemeProvider({
  children,
}: DashboardThemeProviderProps) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  const setTheme = useCallback((next: DashboardTheme) => {
    writeTheme(next);
  }, []);

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={cn(
          "min-h-dvh bg-background text-foreground",
          theme === "dark" && "dark",
        )}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const context = useContext(DashboardThemeContext);

  if (!context) {
    throw new Error(
      "useDashboardTheme must be used within a DashboardThemeProvider.",
    );
  }

  return context;
}
