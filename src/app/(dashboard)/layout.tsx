import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DynamicBreadcrumb } from "@/components/layout/dynamic-breadcrumb"
import { NotificationsBell } from "@/components/notifications/notifications-bell"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-gradient-to-br from-background via-background to-muted/40 dark:to-muted/20">
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <DynamicBreadcrumb />
                    </div>
                    <div className="flex items-center gap-2 px-4">
                        <NotificationsBell />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
