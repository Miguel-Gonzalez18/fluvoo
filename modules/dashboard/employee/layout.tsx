"use client";

import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/modules/shared/components/ui/sidebar";
import { EmployeeSidebar } from "@/modules/dashboard/employee/components/EmployeeSidebar";
import { DashboardHeader } from "@/modules/dashboard/employee/components/DashboardHeader";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  displayName: string;
}

export default function EmployeeLayout({
  children,
  displayName,
}: Readonly<EmployeeLayoutProps>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <EmployeeSidebar />
        <SidebarInset>
          <header className="border-b border-border px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-start gap-3">
              <SidebarTrigger className="-ml-1 mt-2 shrink-0" />
              <DashboardHeader name={displayName} className="min-w-0 flex-1" />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
