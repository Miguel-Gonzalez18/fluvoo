"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  navItems,
  bottomItems,
} from "@/modules/dashboard/employee/config/sidebarNav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/modules/shared/components/ui/sidebar";
import Image from "next/image";
import { FluvooLogo } from "@/modules/shared/components/FluvooLogo";
import { useSignOut } from "@/modules/shared/hooks/useSignOut";

export function EmployeeSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  const handleSignOut = useSignOut();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="border-b border-gray-600 px-4 py-3">
        {open ? (
          <FluvooLogo variant="white" />
        ) : (
          <Image
            src="/favicon.ico"
            alt="Fluvoo"
            width={24}
            height={24}
            className="size-6 object-contain"
          />
        )}
        {open && <span className="text-xs text-neutral-400">Empleado</span>}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={label}
                  >
                    <Link href={href} className={cn("flex items-center gap-2")}>
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-600">
        <SidebarMenu>
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton asChild tooltip={label}>
                <Link href={href}>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Cerrar sesión" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
