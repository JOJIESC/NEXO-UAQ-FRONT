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
    CardTitle,
    CardFooter // <--- IMPORTAMOS CardFooter
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button" // <--- IMPORTAMOS Button
import { Eye, Users } from "lucide-react" // <--- IMPORTAMOS Iconos

export default function MyPostsPage() {
    const { user } = useAuth();

    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchMyProjects() {
            if (!user) return;

            setIsLoading(true);
            const response = await getMyProjectsAction();

            if (response.success && response.data) {
                setProjects(response.data);
            } else {
                toast.error(response.error || "Error al cargar los proyectos.");
            }
            setIsLoading(false);
        }

        fetchMyProjects().catch(console.error);
    }, []);

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mis Proyectos</h1>
                        <p className="text-muted-foreground">Administra los proyectos y talleres de los que eres propietario.</p>
                    </div>
                </div>

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
                                /* 1. Quitamos el <Link> padre y pasamos los estilos de hover a la Card */
                                <Card
                                    key={project.id}
                                    className="h-full flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-md rounded-xl"
                                >
                                    <div>
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
                                    </div>

                                    {/* 2. Agregamos el CardFooter con los dos botones de acción */}
                                    <CardFooter className="flex gap-2 pt-0">
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href={`/posts/${project.id}`}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver
                                            </Link>
                                        </Button>
                                        <Button asChild className="flex-1">
                                            <Link href={`/posts/${project.id}/candidates`}>
                                                <Users className="w-4 h-4 mr-2" />
                                                Candidatos
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    )
}