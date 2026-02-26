import { notFound } from "next/navigation"
import { getProjectDetailsAction } from "@/app/actions/posts"
import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export default async function ProjectDetailsPage({
                                                     params,
                                                 }: {
    params: Promise<{ id: string }>
}) {
    // 1. Extraemos el ID de la URL
    const { id } = await params;

    // 2. Buscamos el proyecto desde el servidor
    const response = await getProjectDetailsAction(id);

    // 3. Si falla o no existe, mostramos la página 404
    if (!response.success || !response.data) {
        notFound();
    }

    const project = response.data;

    // Extraemos iniciales para el Avatar del autor
    const authorInitials = `${project.author?.name?.charAt(0) || ''}${project.author?.lastname?.charAt(0) || ''}`.toUpperCase();

    return (
        <section>
            {/* Contenido principal del proyecto */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card className="max-w-4xl">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-4">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-foreground">
                      {project.author?.name} {project.author?.lastname}
                    </span>
                                    <span>•</span>
                                    <span>{new Date(project.createdAt).toLocaleDateString('es-MX')}</span>
                                </CardDescription>
                            </div>

                            {/* Badges para el Tipo y Estado (Hechos con Tailwind simple) */}
                            <div className="flex gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {project.type === 'PROJECT' ? 'Proyecto' : 'Taller'}
                  </span>
                                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                    {project.status}
                  </span>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="mb-6" />
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-3">Descripción del proyecto</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}