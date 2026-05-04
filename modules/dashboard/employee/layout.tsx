"use client";

import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/modules/shared/components/ui/sidebar";
import { EmployeeSidebar } from "@/modules/dashboard/employee/components/EmployeeSidebar";

export default function EmployeeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <EmployeeSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-gray-300 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}