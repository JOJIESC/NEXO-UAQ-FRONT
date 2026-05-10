import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    Bell,
    UserPlus2,
    CheckCircle2,
    Calendar,
    Eye,
    Globe2,
    Users,
    BadgeCheck,
} from 'lucide-react';

import { getProjectDetailsAction } from '@/app/actions/posts';
import { getSessionUser } from '@/app/actions/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ApplyButton } from '@/components/shared/ApplyButton';

const TYPE_BANNERS: Record<string, string> = {
    PROJECT:
        'bg-[radial-gradient(ellipse_at_30%_50%,#ff8a3d_0%,transparent_60%),radial-gradient(ellipse_at_70%_60%,#ff3b3b_0%,transparent_55%),linear-gradient(135deg,#7a1414,#ff5722)]',
    WORKSHOP:
        'bg-[radial-gradient(ellipse_at_30%_50%,#3dd2ff_0%,transparent_60%),radial-gradient(ellipse_at_70%_60%,#22d3aa_0%,transparent_55%),linear-gradient(135deg,#0e2c5c,#0ea5e9)]',
};

const STATUS_LABELS: Record<string, string> = {
    OPEN: 'Abierto',
    CLOSED: 'Cerrado',
    IN_PROGRESS: 'En curso',
    COMPLETED: 'Completado',
};

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [response, sessionUser] = await Promise.all([
        getProjectDetailsAction(id),
        getSessionUser(),
    ]);

    if (!response.success || !response.data) notFound();

    const project = response.data;
    const isOwner = sessionUser && project.author?.id === sessionUser.id;
    const authorInitials = `${project.author?.name?.charAt(0) ?? ''}${project.author?.lastname?.charAt(0) ?? ''}`.toUpperCase();
    const createdLabel = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString('es-MX', {
              month: 'short',
              year: 'numeric',
          })
        : '—';
    const statusLabel = STATUS_LABELS[project.status ?? ''] ?? 'Activo';

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-6xl mx-auto">
            {/* Breadcrumb local */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Link
                    href="/dashboard"
                    className="hover:text-foreground transition-colors"
                >
                    Publicaciones
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-w-xs">
                    {project.title}
                </span>
            </div>

            {/* Hero banner */}
            <div
                className={`relative h-56 sm:h-72 w-full overflow-hidden rounded-3xl ${TYPE_BANNERS[project.type] ?? TYPE_BANNERS.PROJECT}`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.45),transparent_55%)] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Tipo top-right */}
                <div className="absolute right-5 top-5">
                    <Badge className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30">
                        {project.type === 'PROJECT' ? 'Proyecto' : 'Taller'}
                    </Badge>
                </div>

                {/* Título sobre el banner */}
                <div className="absolute bottom-5 left-6 right-6 text-white drop-shadow-lg">
                    <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
                        {project.title}
                    </h1>
                </div>
            </div>

            {/* Layout main / sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Columna principal — Tabs */}
                <div>
                    <Tabs defaultValue="feed" className="w-full">
                        <TabsList>
                            <TabsTrigger value="feed">Feed</TabsTrigger>
                            <TabsTrigger value="description">Descripción</TabsTrigger>
                            <TabsTrigger value="members">Miembros</TabsTrigger>
                        </TabsList>

                        {/* Feed (placeholder) */}
                        <TabsContent value="feed" className="mt-6">
                            <div className="space-y-3">
                                <ActivityRow
                                    icon={<Bell className="h-4 w-4" />}
                                    type="info"
                                    title="Publicación creada"
                                    detail={`${createdLabel}`}
                                    label="Update"
                                />
                                <ActivityRow
                                    icon={<UserPlus2 className="h-4 w-4" />}
                                    type="muted"
                                    title="Esperando candidatos"
                                    detail="Los postulantes aparecerán aquí"
                                    label="Pendiente"
                                />
                                <ActivityRow
                                    icon={<CheckCircle2 className="h-4 w-4" />}
                                    type="muted"
                                    title="Sin candidatos aceptados"
                                    detail="Cuando aceptes, lo verás aquí"
                                    label="Acción"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-6">
                                El feed mostrará la actividad real una vez que la API de notificaciones esté lista.
                            </p>
                        </TabsContent>

                        {/* Descripción */}
                        <TabsContent value="description" className="mt-6">
                            <div className="rounded-3xl border bg-card p-6">
                                <h3 className="text-lg font-semibold mb-3">
                                    Descripción del {project.type === 'PROJECT' ? 'proyecto' : 'taller'}
                                </h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>
                            </div>
                        </TabsContent>

                        {/* Miembros (placeholder, link a candidates) */}
                        <TabsContent value="members" className="mt-6">
                            <div className="rounded-3xl border bg-card p-6 flex flex-col items-center text-center gap-3">
                                <Users className="h-8 w-8 text-muted-foreground" />
                                <p className="font-medium">Gestión de miembros</p>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    {isOwner
                                        ? 'Como propietario, puedes ver los candidatos y aceptar/rechazar postulaciones.'
                                        : 'Solo el propietario puede ver y gestionar los miembros de esta publicación.'}
                                </p>
                                {isOwner && (
                                    <Button asChild className="mt-2">
                                        <Link href={`/posts/${project.id}/candidates`}>
                                            <Users className="mr-2 h-4 w-4" />
                                            Ver candidatos
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar derecha */}
                <aside className="space-y-4">
                    {/* Card autor + visibilidad */}
                    <div className="rounded-3xl border bg-card p-5 space-y-4">
                        <div>
                            <h2 className="font-semibold text-base">Sobre la publicación</h2>
                            <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                                {project.description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="gap-1.5">
                                <Globe2 className="h-3 w-3" /> Público
                            </Badge>
                            <Badge variant="outline" className="gap-1.5">
                                <BadgeCheck className="h-3 w-3" /> Creado {createdLabel}
                            </Badge>
                        </div>

                        <Separator />

                        <Stat
                            icon={<Eye className="h-4 w-4" />}
                            label="Estado"
                            value={statusLabel}
                        />
                        {project.author && (
                            <Stat
                                icon={
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px] font-semibold">
                                            {authorInitials || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                }
                                label="Autor"
                                value={`${project.author.name} ${project.author.lastname}`.trim()}
                            />
                        )}
                        <Stat
                            icon={<Calendar className="h-4 w-4" />}
                            label="Fecha de creación"
                            value={
                                project.createdAt
                                    ? new Date(project.createdAt).toLocaleDateString('es-MX')
                                    : '—'
                            }
                        />
                    </div>

                    {/* Card de acción */}
                    {!isOwner ? (
                        <div className="rounded-3xl border bg-card p-5 space-y-3">
                            <h3 className="font-semibold">¿Te interesa?</h3>
                            <p className="text-sm text-muted-foreground">
                                Postúlate y el dueño verá tu solicitud.
                            </p>
                            <ApplyButton postId={project.id} />
                        </div>
                    ) : (
                        <div className="rounded-3xl border bg-card p-5 space-y-3">
                            <h3 className="font-semibold">Eres el dueño</h3>
                            <p className="text-sm text-muted-foreground">
                                Gestiona los candidatos que se postulen.
                            </p>
                            <Button asChild className="w-full">
                                <Link href={`/posts/${project.id}/candidates`}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Ver candidatos
                                </Link>
                            </Button>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

// ───────── Helpers de presentación ─────────

function ActivityRow({
    icon,
    type,
    title,
    detail,
    label,
}: {
    icon: React.ReactNode;
    type: 'info' | 'muted';
    title: string;
    detail: string;
    label: string;
}) {
    const colorByType: Record<string, string> = {
        info: 'bg-primary/10 text-primary',
        muted: 'bg-muted text-muted-foreground',
    };

    return (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorByType[type]}`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-muted-foreground truncate">{detail}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{label}</span>
        </div>
    );
}

function Stat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>{icon}</span>
                <span>{label}</span>
            </div>
            <span className="text-sm font-medium text-right truncate max-w-[60%]">
                {value}
            </span>
        </div>
    );
}
