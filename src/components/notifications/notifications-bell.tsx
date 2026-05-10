'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Bell, BellOff, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import {
    getNotificationsAction,
    getUnreadCountAction,
    markAllNotificationsReadAction,
    markNotificationReadAction,
} from '@/app/actions/notifications';
import type { Notification } from '@/features/notifications/types/notifications.types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

const POLL_INTERVAL_MS = 60_000; // 1 min

export function NotificationsBell() {
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [items, setItems] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();

    /** Refresca el contador (silenciosamente). */
    const refreshUnreadCount = useCallback(async () => {
        const result = await getUnreadCountAction();
        if (result.success) setUnreadCount(result.count);
    }, []);

    /** Carga la lista (cuando se abre el popover). */
    const loadList = useCallback(async () => {
        setIsLoading(true);
        const result = await getNotificationsAction();
        if (result.success && result.data) {
            setItems(result.data);
        }
        setIsLoading(false);
    }, []);

    // Polling silencioso del contador
    useEffect(() => {
        refreshUnreadCount();
        const id = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [refreshUnreadCount]);

    // Cargar lista al abrir
    useEffect(() => {
        if (open) loadList();
    }, [open, loadList]);

    function handleMarkRead(n: Notification) {
        if (n.readAt) return;
        // Optimistic update
        setItems((prev) =>
            prev.map((it) => (it.id === n.id ? { ...it, readAt: new Date().toISOString() } : it)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));

        startTransition(async () => {
            const result = await markNotificationReadAction(n.id);
            if (!result.success) {
                toast.error('No se pudo marcar como leída');
                refreshUnreadCount();
                loadList();
            }
        });
    }

    async function handleMarkAllRead() {
        const had = unreadCount;
        setItems((prev) => prev.map((it) => ({ ...it, readAt: it.readAt ?? new Date().toISOString() })));
        setUnreadCount(0);

        const result = await markAllNotificationsReadAction();
        if (result.success) {
            toast.success(`${had} notificaciones marcadas como leídas`);
        } else {
            toast.error('Error al marcar todas');
            refreshUnreadCount();
            loadList();
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                    aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" sideOffset={8} className="w-96 p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                    <div>
                        <p className="font-semibold text-sm">Notificaciones</p>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0
                                ? `${unreadCount} sin leer`
                                : 'Estás al día'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                            <CheckCheck className="mr-2 h-3.5 w-3.5" />
                            Marcar todas
                        </Button>
                    )}
                </div>

                {/* Lista */}
                <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Spinner className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <BellOff className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-sm">No tienes notificaciones</p>
                        </div>
                    ) : (
                        <ul className="divide-y">
                            {items.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onMarkRead={() => handleMarkRead(n)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function NotificationItem({
    notification: n,
    onMarkRead,
}: {
    notification: Notification;
    onMarkRead: () => void;
}) {
    const isUnread = !n.readAt;
    const date = new Date(n.createdAt);
    const dateLabel = formatRelative(date);

    const typeStyles = {
        APPLICATION_RECEIVED: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
        APPLICATION_ACCEPTED:
            'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        APPLICATION_REJECTED:
            'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    };

    const content = (
        <div
            className={cn(
                'flex gap-3 p-3 transition-colors',
                isUnread ? 'bg-muted/40' : 'hover:bg-muted/30',
            )}
        >
            {/* Bullet/dot de no leído */}
            <div className="shrink-0 pt-1.5">
                <div
                    className={cn(
                        'h-2 w-2 rounded-full',
                        isUnread ? 'bg-primary' : 'bg-transparent',
                    )}
                />
            </div>
            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className={cn('text-sm leading-tight', isUnread && 'font-semibold')}>
                            {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                        </p>
                    </div>
                    <span
                        className={cn(
                            'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                            typeStyles[n.type],
                        )}
                    >
                        {n.type === 'APPLICATION_RECEIVED'
                            ? 'Postulación'
                            : n.type === 'APPLICATION_ACCEPTED'
                              ? 'Aceptada'
                              : 'Rechazada'}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-[11px] text-muted-foreground">{dateLabel}</span>
                    {isUnread && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                onMarkRead();
                            }}
                            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                            <Check className="h-3 w-3" />
                            Leída
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    if (n.postId) {
        return (
            <li>
                <Link
                    href={`/posts/${n.postId}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => isUnread && onMarkRead()}
                >
                    {content}
                </Link>
            </li>
        );
    }

    return <li>{content}</li>;
}

function formatRelative(date: Date): string {
    const now = Date.now();
    const diffSec = Math.floor((now - date.getTime()) / 1000);

    if (diffSec < 60) return 'ahora';
    if (diffSec < 3600) return `hace ${Math.floor(diffSec / 60)} min`;
    if (diffSec < 86400) return `hace ${Math.floor(diffSec / 3600)} h`;
    if (diffSec < 7 * 86400) return `hace ${Math.floor(diffSec / 86400)} d`;
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}
