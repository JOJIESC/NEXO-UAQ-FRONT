import Link from 'next/link';
import { GraduationCap, Lightbulb, type LucideIcon } from 'lucide-react';

import { Post } from '@/features/posts/types/posts.types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TypeMeta {
    label: string;
    icon: LucideIcon;
    /** Tonalidad pastel para light mode + tono profundo para dark mode */
    iconBg: string;
    iconText: string;
}

const TYPE_META: Record<string, TypeMeta> = {
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
};

const STATUS_LABELS: Record<string, string> = {
    OPEN: 'Abierto',
    CLOSED: 'Cerrado',
    IN_PROGRESS: 'En curso',
    COMPLETED: 'Completado',
};

export interface PostCardProps {
    post: Post;
    /** Texto pequeño en footer (ej: "Tus posts", "Aplica ahora"). Default: estado del post. */
    footerHint?: string;
    className?: string;
}

/**
 * Card estilo iOS widget: superficie blanca/dark, sombra sutil, icon badge
 * coloreado por tipo, footer con autor.
 */
export function PostCard({ post, footerHint, className }: PostCardProps) {
    const meta = TYPE_META[post.type] ?? TYPE_META.PROJECT;
    const TypeIcon = meta.icon;

    const date = post.createdAt ? new Date(post.createdAt) : null;
    const dateLabel = date
        ? date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
        : '—';

    const authorName = post.author
        ? `${post.author.name ?? ''} ${post.author.lastname ?? ''}`.trim() || 'Anónimo'
        : 'Anónimo';
    const authorInitials = post.author
        ? `${post.author.name?.charAt(0) ?? ''}${post.author.lastname?.charAt(0) ?? ''}`.toUpperCase() || '?'
        : '?';

    const statusLabel = STATUS_LABELS[post.status ?? ''] ?? 'Activo';

    return (
        <Link
            href={`/posts/${post.id}`}
            className={cn(
                'group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl',
                className,
            )}
        >
            <article className="h-full flex flex-col rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold leading-snug line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {meta.label} · {dateLabel}
                        </p>
                    </div>
                    <div
                        className={cn(
                            'shrink-0 flex h-10 w-10 items-center justify-center rounded-full',
                            meta.iconBg,
                            meta.iconText,
                        )}
                    >
                        <TypeIcon className="h-5 w-5" />
                    </div>
                </div>

                {/* Descripción */}
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                </p>

                <div className="flex-1" />

                {/* Footer mini-card: autor + estado */}
                <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-muted/50 dark:bg-muted/30 p-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-[11px] font-semibold bg-background border">
                                {authorInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-xs text-muted-foreground leading-tight">
                                {footerHint ?? 'Autor'}
                            </p>
                            <p className="text-sm font-semibold truncate leading-tight">
                                {authorName}
                            </p>
                        </div>
                    </div>
                    <span
                        className={cn(
                            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                            'bg-background text-foreground border',
                        )}
                    >
                        {statusLabel}
                    </span>
                </div>
            </article>
        </Link>
    );
}
