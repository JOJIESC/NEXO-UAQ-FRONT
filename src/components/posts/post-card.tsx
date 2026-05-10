import Link from 'next/link';
import { Post } from '@/features/posts/types/posts.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const TYPE_GRADIENTS: Record<string, string> = {
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

export interface PostCardProps {
    post: Post;
    /** Texto adicional opcional (ej: número de candidatos). Default: estado del post. */
    metric?: string;
    /** Etiqueta secundaria pequeña debajo del autor. */
    actionLabel?: string;
    className?: string;
}

/**
 * Card estilo "folder tab" con banner colorido y card oscura sobrepuesta.
 * Inspirado en la referencia de tarjeta tipo widget de iOS.
 */
export function PostCard({ post, metric, actionLabel, className }: PostCardProps) {
    const isProject = post.type === 'PROJECT';
    const date = post.createdAt ? new Date(post.createdAt) : null;
    const day = date ? String(date.getDate()).padStart(2, '0') : '--';
    const monthShort = date
        ? date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '').toLowerCase()
        : '';

    const authorName = post.author
        ? `${post.author.name ?? ''} ${post.author.lastname ?? ''}`.trim() || 'Anónimo'
        : 'Anónimo';
    const authorInitials = post.author
        ? `${post.author.name?.charAt(0) ?? ''}${post.author.lastname?.charAt(0) ?? ''}`.toUpperCase() || '?'
        : '?';

    const metricLabel = metric ?? STATUS_LABELS[post.status ?? ''] ?? 'Activo';

    return (
        <Link
            href={`/posts/${post.id}`}
            className={cn(
                'group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[28px]',
                className,
            )}
        >
            <article className="relative overflow-hidden rounded-[28px] bg-foreground p-1.5 shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                {/* Banner gradient */}
                <div
                    className={cn(
                        'relative h-32 overflow-hidden rounded-t-[22px]',
                        TYPE_GRADIENTS[post.type],
                    )}
                >
                    {/* Brillo decorativo */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_55%)] mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_55%)] mix-blend-overlay" />

                    {/* Etiqueta superior derecha */}
                    <div className="absolute right-4 top-3 text-right">
                        <p className="text-sm font-bold leading-tight tracking-tight text-white drop-shadow">
                            {isProject ? 'Proyecto' : 'Taller'}
                        </p>
                        <p className="text-[11px] font-medium text-white/85 mt-0.5">
                            {metricLabel}
                        </p>
                    </div>
                </div>

                {/* Card oscura folder-tab */}
                <div className="relative -mt-5 rounded-[22px] bg-card text-card-foreground p-5 pt-4">
                    {/* Pequeño tab "carpeta" en la esquina superior izquierda */}
                    <div className="absolute -top-3 left-5 h-3 w-16 rounded-t-md bg-card" />

                    <h3 className="text-xl font-bold leading-tight line-clamp-2 mb-1.5">
                        {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.description}
                    </p>

                    <div className="mt-6 flex items-end justify-between gap-3">
                        {/* Fecha */}
                        <div className="flex items-baseline gap-1.5 shrink-0">
                            <span className="text-3xl font-bold leading-none">{day}</span>
                            <span className="text-sm uppercase text-muted-foreground tracking-wider">
                                {monthShort}
                            </span>
                        </div>

                        {/* Autor */}
                        <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-8 w-8 shrink-0 border border-border">
                                <AvatarFallback className="text-[11px] font-semibold bg-muted text-muted-foreground">
                                    {authorInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 text-right">
                                <p className="text-sm font-semibold truncate leading-tight">
                                    {authorName}
                                </p>
                                {actionLabel && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                        {actionLabel}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
