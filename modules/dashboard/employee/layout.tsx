"use client";

import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/modules/shared/components/ui/sidebar";
import { EmployeeSidebar } from "@/modules/dashboard/employee/components/EmployeeSidebar";
import { DashboardFab } from "@/modules/dashboard/employee/components/DashboardFab";
import { DashboardHeader } from "@/modules/dashboard/employee/components/DashboardHeader";
import type { GmailStatus } from "@/modules/dashboard/employee/types/dashboard.types";
import { DashboardThemeProvider } from "@/modules/dashboard/shared/DashboardThemeProvider";
import { ServiceWorkerRegister } from "@/modules/shared/components/ServiceWorkerRegister";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  displayName: string;
  gmailStatus: GmailStatus;
}

export default function EmployeeLayout({
  children,
  displayName,
  gmailStatus,
}: Readonly<EmployeeLayoutProps>) {
  return (
    <DashboardThemeProvider>
      <ServiceWorkerRegister />
      <TooltipProvider>
        <SidebarProvider>
          <EmployeeSidebar />
          <SidebarInset>
            <header className="border-b border-border px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-7xl items-start gap-3">
                <SidebarTrigger className="-ml-1 mt-2 shrink-0" />
                <DashboardHeader
                  name={displayName}
                  gmailStatus={gmailStatus}
                  className="min-w-0 flex-1"
                />
              </div>
            </header>
            <main className="flex-1 p-2 sm:p-4">{children}</main>
            <DashboardFab />
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </DashboardThemeProvider>
  );
}
