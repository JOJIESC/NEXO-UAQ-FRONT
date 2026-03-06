import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

// 1. Importamos el componente que acabamos de crear
import { DynamicBreadcrumb } from "@/components/layout/dynamic-breadcrumb"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className='dark:bg-gradient-to-r from-slate-900 to-slate-700 bg-gradient-to-r from-blue-200 to-cyan-700'>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />

                        {/* 2. Reemplazamos el Breadcrumb estático por el dinámico */}
                        <DynamicBreadcrumb />

                    </div>
                </header>
                {/* Aquí se renderizarán todas las páginas (page.tsx) que estén dentro de (dashboard) */}
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}