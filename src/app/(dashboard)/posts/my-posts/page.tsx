'use client'

import { useAuth } from "@/providers/AuthProvider"
import { useEffect, useState } from "react"
import { getMyProjectsAction } from "@/app/actions/posts"
import { toast } from "sonner"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"

export default function MyPostsPage() {
    const { user } = useAuth();

    // 1. Guardamos los datos completos de la API, no solo el SidebarProject
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMyProjects() {
            if (!user) return;

            setIsLoading(true);
            const response = await getMyProjectsAction();

            if (response.success && response.data) {
                // Guardamos la data cruda para usarla en las tarjetas
                setProjects(response.data);
            } else {
                toast.error(response.error || "Error al cargar los proyectos.");
            }
            setIsLoading(false);
        }

        fetchMyProjects().catch(console.error);
    }, [user]); // 2. Agregamos 'user' como dependencia para que reaccione al contexto

    return (
        <>
            {/* Contenedor Principal */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mis Proyectos</h1>
                        <p className="text-muted-foreground">Administra los proyectos y talleres de los que eres propietario.</p>
                    </div>
                    {/* Aquí podrías renderizar tu <CreatePostDialog /> si quisieras un botón rápido en esta vista */}
                </div>

                {/* Grid de Contenido */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner className="h-8 w-8 text-primary" />
                    </div>
                ) : (
                    <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                <p>Aún no has creado ningún proyecto.</p>
                            </div>
                        ) : (
                            projects.map((project: any) => (
                                <Link
                                    href={`/posts/${project.id}`}
                                    key={project.id}
                                    className="transition-transform duration-200 hover:-translate-y-1 hover:shadow-md rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Card className="h-full flex flex-col justify-between cursor-pointer">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-md tracking-wider">
                                                    {project.type === 'PROJECT' ? 'Proyecto' : 'Taller'}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {project.status}
                                                </span>
                                            </div>
                                            <CardTitle className="text-xl line-clamp-2 leading-tight">
                                                {project.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                            <CardDescription className="line-clamp-3 mb-4 text-sm">
                                                {project.description}
                                            </CardDescription>

                                            <Separator className="my-4" />

                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">
                                                    Creado el {new Date(project.createdAt).toLocaleDateString('es-MX')}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    )
}