'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllProjectsAction } from "@/app/actions/posts"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ApplyButton } from "@/components/shared/ApplyButton"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export default function DashboardPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estado para controlar el filtro activo
    const [filter, setFilter] = useState<'ALL' | 'PROJECT' | 'WORKSHOP'>('ALL');

    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            const response = await getAllProjectsAction();
            if (response.success && response.data) {
                setProjects(response.data);
            } else {
                toast.error(response.error || "Error al cargar los proyectos.");
            }
            setIsLoading(false);
        }

        fetchProjects();
    }, []);

    // Filtramos los proyectos dependiendo del estado actual del ToggleGroup
    const filteredProjects = projects.filter(project => {
        if (filter === 'ALL') return true;
        return project.type === filter;
    });

    return (
        <div className="flex flex-1 flex-col items-center p-4 pt-0 w-full">

            {/* Cabecera del Feed con Títulos y Filtro */}
            <div className="w-full max-w-2xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Proyectos Recientes</h1>
                    <p className="text-muted-foreground">Explora y únete a proyectos creados por la comunidad.</p>
                </div>

                {/* Nuevo: Toggle Group para filtrar */}
                <ToggleGroup
                    type="single"
                    variant="outline"
                    value={filter}
                    onValueChange={(value) => {
                        // Evita que el usuario deseleccione dejando la lista vacía
                        if (value) setFilter(value as 'ALL' | 'PROJECT' | 'WORKSHOP');
                    }}
                >
                    <ToggleGroupItem value="ALL">Todos</ToggleGroupItem>
                    <ToggleGroupItem value="PROJECT">Proyectos</ToggleGroupItem>
                    <ToggleGroupItem value="WORKSHOP">Talleres</ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Feed de Proyectos */}
            <div className="w-full max-w-2xl flex flex-col gap-6">

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Spinner className="w-8 h-8 text-primary" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <p className="text-muted-foreground text-center py-10 border-2 border-dashed rounded-xl">
                        No se encontraron {filter === 'PROJECT' ? 'proyectos' : filter === 'WORKSHOP' ? 'talleres' : 'publicaciones'}.
                    </p>
                ) : (
                    filteredProjects.map((project: any) => {
                        // Calculamos iniciales del autor
                        const authorInitials = `${project.author?.name?.charAt(0) || ''}${project.author?.lastname?.charAt(0) || ''}`.toUpperCase();

                        return (
                            <Card key={project.id} className="bg-neutral-100 w-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="text-sm font-semibold bg-secondary text-secondary-foreground">
                                                {authorInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold leading-none">
                                                {project.author?.name} {project.author?.lastname}
                                            </span>
                                            <span className="text-xs text-muted-foreground mt-1.5">
                                                {new Date(project.createdAt).toLocaleDateString('es-MX', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded-full tracking-wider">
                                            {project.type === 'PROJECT' ? 'Proyecto' : 'Taller'}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium">
                                            {project.status}
                                        </span>
                                    </div>
                                </CardHeader>

                                <Separator className="opacity-50 mx-6 w-auto" />

                                <CardContent className="pt-4 pb-6">
                                    <CardTitle className="text-xl leading-snug mb-3">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-4">
                                        {project.description}
                                    </CardDescription>
                                </CardContent>

                                <CardFooter className="flex justify-between gap-4 pt-0">
                                    {/* Botón para ver detalles */}
                                    <Button variant="outline" className="flex-1" asChild>
                                        <Link href={`/posts/${project.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver Detalles
                                        </Link>
                                    </Button>

                                    {/* Botón de aplicar */}
                                    <div className="flex-1">
                                        <ApplyButton postId={project.id}/>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    )
}