import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowRight,
    BadgeCheck,
    Calendar,
    CheckCircle2,
    GraduationCap,
    Lightbulb,
    UserPlus2,
    Users,
} from 'lucide-react';

import { getProjectDetailsAction } from '@/app/actions/posts';
import { getSessionUser } from '@/app/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ApplyButton } from '@/components/shared/ApplyButton';
import { cn } from '@/lib/utils';

const TYPE_META = {
    PROJECT: {
        label: 'Proyecto',
        icon: Lightbulb,
        iconBg: 'bg-orange-100 dark:bg-orange-500/15',
        iconText: 'text-orange-600 dark:text-orange-400',
    },
    WORKSHOP: {
        label: 'Taller',
        icon: GraduationCap,
        iconBg: 'bg-sky-100 dark:bg-sky-500/15',
        iconText: 'text-sky-600 dark:text-sky-400',
    },
} as const;

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
    const meta = TYPE_META[project.type] ?? TYPE_META.PROJECT;
    const TypeIcon = meta.icon;

    const isOwner = !!sessionUser && project.author?.id === sessionUser.id;
    const authorName = project.author
        ? `${project.author.name ?? ''} ${project.author.lastname ?? ''}`.trim() || 'Anónimo'
        : 'Anónimo';
    const authorInitials = project.author
        ? `${project.author.name?.charAt(0) ?? ''}${project.author.lastname?.charAt(0) ?? ''}`.toUpperCase() || '?'
        : '?';

    const dateLong = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '—';
    const dateShort = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
          })
        : '—';
    const day = project.createdAt
        ? String(new Date(project.createdAt).getDate()).padStart(2, '0')
        : '--';
    const monthShort = project.createdAt
        ? new Date(project.createdAt)
              .toLocaleDateString('es-MX', { month: 'short' })
              .replace('.', '')
              .toLowerCase()
        : '';

    const statusLabel = STATUS_LABELS[project.status ?? ''] ?? 'Activo';

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Publicaciones
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-w-xs">
                    {project.title}
                </span>
            </div>

            {/* ──────── BENTO GRID ──────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-min">
                {/* Hero card — ocupa 2 cols en grandes */}
                <article className="sm:col-span-2 rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                                {project.title}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-2">
                                {meta.label} · {dateLong}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl',
                                meta.iconBg,
                                meta.iconText,
                            )}
                        >
                            <TypeIcon className="h-7 w-7" />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <MiniStat label="Categoría" value={meta.label} icon={<TypeIcon className="h-4 w-4" />} />
                        <MiniStat label="Estado" value={statusLabel} icon={<BadgeCheck className="h-4 w-4" />} />
                    </div>
                </article>

                {/* Fecha card — número grande */}
                <article className="rounded-3xl border bg-card p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-5xl font-bold leading-none">{day}</p>
                            <p className="text-sm text-muted-foreground mt-1 capitalize">
                                {monthShort}
                            </p>
                        </div>
                        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-auto pt-4">
                        Publicado el {dateShort}
                    </p>
                </article>

                {/* Descripción — full width en sm, 2 cols en lg */}
                <article className="sm:col-span-2 rounded-3xl border bg-card p-6 shadow-sm">
                    <h2 className="text-base font-bold mb-3">
                        Descripción del {project.type === 'PROJECT' ? 'proyecto' : 'taller'}
                    </h2>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                    </p>
                </article>

                {/* Autor */}
                <article className="rounded-3xl border bg-card p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Autor
                    </p>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                                {authorInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="font-semibold truncate">{authorName}</p>
                            {project.author?.email && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {project.author.email}
                                </p>
                            )}
                        </div>
                    </div>
                </article>

                {/* Actividad — span 2 cols */}
                <article className="sm:col-span-2 rounded-3xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold">Actividad reciente</h2>
                        <span className="text-xs text-muted-foreground">Últimas acciones</span>
                    </div>
                    <ul className="space-y-2">
                        <ActivityRow
                            color="bg-primary/10 text-primary"
                            icon={<BadgeCheck className="h-4 w-4" />}
                            title="Publicación creada"
                            detail={dateLong}
                        />
                        <ActivityRow
                            color="bg-muted text-muted-foreground"
                            icon={<UserPlus2 className="h-4 w-4" />}
                            title="Esperando candidatos"
                            detail="Las postulaciones aparecerán aquí"
                        />
                        <ActivityRow
                            color="bg-muted text-muted-foreground"
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            title="Sin candidatos aceptados"
                            detail="Cuando aceptes a alguien, lo verás aquí"
                        />
                    </ul>
                </article>

                {/* CTA — Aplica o Ver candidatos */}
                <article
                    className={cn(
                        'rounded-3xl p-6 shadow-sm flex flex-col gap-3',
                        isOwner
                            ? 'bg-primary text-primary-foreground'
                            : 'border bg-card',
                    )}
                >
                    {isOwner ? (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-xs uppercase tracking-wider opacity-80">
                                    Eres el dueño
                                </p>
                                <Users className="h-5 w-5 opacity-80" />
                            </div>
                            <h3 className="text-xl font-bold leading-tight">
                                Gestiona tus candidatos
                            </h3>
                            <p className="text-sm opacity-90 mb-2">
                                Acepta o rechaza las postulaciones que has recibido.
                            </p>
                            <Button asChild variant="secondary" className="mt-auto">
                                <Link href={`/posts/${project.id}/candidates`}>
                                    Ver candidatos
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                ¿Te interesa?
                            </p>
                            <h3 className="text-xl font-bold leading-tight">
                                Postúlate a este {meta.label.toLowerCase()}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                El dueño verá tu solicitud y decidirá si te acepta.
                            </p>
                            <ApplyButton postId={project.id} />
                        </>
                    )}
                </article>
            </div>
        </div>
    );
}

// ───────── Helpers de presentación ─────────

function MiniStat({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-muted/50 dark:bg-muted/30 p-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground border">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-tight">
                    {label}
                </p>
                <p className="text-sm font-semibold truncate leading-tight mt-0.5">
                    {value}
                </p>
            </div>
        </div>
    );
}

function ActivityRow({
    color,
    icon,
    title,
    detail,
}: {
    color: string;
    icon: React.ReactNode;
    title: string;
    detail: string;
}) {
    return (
        <li className="flex items-center gap-3 rounded-2xl bg-muted/40 dark:bg-muted/25 p-3">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', color)}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{title}</p>
                <p className="text-xs text-muted-foreground truncate">{detail}</p>
            </div>
        </li>
    );
}
