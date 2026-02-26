"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  BookOpen,
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

// 2. ELIMINAMOS los imports de apiClient y API_ENDPOINTS
// 3. IMPORTAMOS la acción del servidor
import { getMyProjectsAction } from "@/app/actions/posts";
import {toast} from "sonner";

// 4. Definimos la forma exacta que espera el estado para evitar el error de TypeScript
type SidebarProject = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  // 5. Le decimos explícitamente a TypeScript qué tipo de array guardaremos
  const [projects, setProjects] = useState<SidebarProject[]>(data.projects);

  useEffect(() => {
    async function fetchMyProjects() {
      if (!user) return;

      // 6. Usamos nuestra acción de servidor
      const response = await getMyProjectsAction();

      if (response.success && response.data) {
        // Al indicarle el tipo :SidebarProject[] aquí también, evitamos conflictos
        const formattedProjects: SidebarProject[] = response.data.map((post: any) => ({
          name: post.title,
          url: `/posts/${post.id}`,
          icon: post.type === 'PROJECT' ? Folder : BookOpen,
        }));

        setProjects(formattedProjects);
      } else {
        toast.error("Error .");
      }
    }

    fetchMyProjects().catch(console.error);
  }, [user]);

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
          {/* NavProjects recibirá correctamente el tipado */}
          <NavProjects projects={projects} />
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