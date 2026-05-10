'use server';

import { revalidatePath } from 'next/cache';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Notification } from '@/features/notifications/types/notifications.types';

/** Lista las notificaciones del usuario actual. */
export async function getNotificationsAction(onlyUnread = false) {
    try {
        const data = await apiClient.getServer<Notification[]>(
            API_ENDPOINTS.NOTIFICATIONS.LIST,
            onlyUnread ? { unread: true } : undefined,
            { revalidate: false },
        );
        return { success: true, data };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al cargar notificaciones',
        };
    }
}

/** Cuenta de notificaciones no leídas (para badge). */
export async function getUnreadCountAction() {
    try {
        const data = await apiClient.getServer<{ count: number }>(
            API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
            undefined,
            { revalidate: false },
        );
        return { success: true, count: data.count };
    } catch (error) {
        return {
            success: false,
            count: 0,
            error: error instanceof Error ? error.message : 'Error',
        };
    }
}

export async function markNotificationReadAction(id: string) {
    try {
        await apiClient.patchServer(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error',
        };
    }
}

export async function markAllNotificationsReadAction() {
    try {
        const data = await apiClient.patchServer<{ updated: number }>(
            API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
        );
        revalidatePath('/', 'layout');
        return { success: true, updated: data.updated };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error',
        };
    }
}
