"use client";

import { DashboardThemeProvider } from "@/modules/dashboard/shared/DashboardThemeProvider";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardThemeProvider>
      <main className="flex-1 p-6">{children}</main>
    </DashboardThemeProvider>
  );
}
