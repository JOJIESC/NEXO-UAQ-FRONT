export type NotificationType =
    | 'APPLICATION_RECEIVED'
    | 'APPLICATION_ACCEPTED'
    | 'APPLICATION_REJECTED';

/**
 * Refleja el schema real de la tabla `notifications` del backend.
 * Body en vez de message, isRead boolean en vez de readAt timestamp,
 * y referenceId genérico (típicamente postId) en vez de
 * post_id + application_id separados.
 */
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType | string;
    title: string;
    body: string;
    /** ID del recurso al que apunta (típicamente el post). */
    referenceId?: string;
    isRead: boolean;
    createdAt: string;
}
