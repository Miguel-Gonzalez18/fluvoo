"use client";

import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/modules/shared/components/ui/sidebar";
import { FreelancerSidebar } from "@/modules/dashboard/freelancer/components/FreelancerSidebar";
import { DashboardThemeProvider } from "@/modules/dashboard/shared/DashboardThemeProvider";
import { ServiceWorkerRegister } from "@/modules/shared/components/ServiceWorkerRegister";

export default function FreelanceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardThemeProvider>
    <ServiceWorkerRegister />
    <TooltipProvider>
      <SidebarProvider>
        <FreelancerSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-gray-300 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
    </DashboardThemeProvider>
  );
}