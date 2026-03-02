import { getProjectCandidatesAction } from "@/app/actions/applications"
import { getProjectDetailsAction } from "@/app/actions/posts"
import { CandidatesTable } from "@/components/applications/candidates-table"
import { notFound } from "next/navigation"
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

export default async function ProjectCandidatesPage({
                                                        params,
                                                    }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // Disparamos ambas peticiones al backend en paralelo para ahorrar tiempo
    const [projectResponse, candidatesResponse] = await Promise.all([
        getProjectDetailsAction(id),
        getProjectCandidatesAction(id)
    ]);

    if (!projectResponse.success || !projectResponse.data) {
        notFound();
    }

    const project = projectResponse.data;
    const candidates = candidatesResponse.success && candidatesResponse.data ? candidatesResponse.data : [];

    return (
        <>

            {/* Contenido Principal */}
            <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Candidatos</h1>
                    <p className="text-muted-foreground mt-1">
                        Revisa y aprueba a los usuarios que se han postulado para participar en <strong>{project.title}</strong>.
                    </p>
                </div>

                {/* Renderizamos el Componente de Cliente y le pasamos la data */}
                <CandidatesTable candidates={candidates} postId={id} />
            </div>
        </>
    )
}