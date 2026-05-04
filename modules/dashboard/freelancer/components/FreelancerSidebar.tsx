"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, bottomItems } from "@/modules/dashboard/freelancer/config/sidebarNav";
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
import { signOut } from "@/modules/shared/actions/authActions";
import { sileo } from "sileo";

export function FreelancerSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  const handleSignOut = () =>
    sileo.promise(() => signOut(), {
      loading: {title: "Cerrando sesión..."},
      success: {title: "Sesión cerrada"},
      error: {title: "Error al cerrar sesión"},
    });

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="border-b border-gray-500 px-4 py-3">
        {open ? (
          <Image src="/logo-White.svg" alt="Fluvoo" width={100} height={100} className="w-[100px] h-auto" />
        ) : (
          <Image src="/favicon.ico" alt="Fluvoo" width={24} height={24} className="w-6 h-auto" />
        )}
        {open && <span className="text-xs text-neutral-400">Freelancer</span>}
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

      <SidebarFooter className="border-t border-gray-500">
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
