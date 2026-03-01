"use client"

import * as React from "react"
import {
  BookOpen,
  CirclePlus,
  StickyNote,
  Folder, // Asegúrate de importar Folder
  School,
  type LucideIcon // <--- 1. Importamos el tipo para los íconos
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { navItems as data } from "@/lib/navigation";
import { useAuth } from "@/providers/AuthProvider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  if (!user) return null;

  return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/dashboard">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <School className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">NEXO UAQ</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={{
            name: `${user.name} ${user.lastname}`,
            email: user.email,
            avatar: "",
          }} />
        </SidebarFooter>
      </Sidebar>
  )
}