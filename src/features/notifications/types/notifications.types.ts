export type NotificationType =
    | 'APPLICATION_RECEIVED'
    | 'APPLICATION_ACCEPTED'
    | 'APPLICATION_REJECTED';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    postId?: string;
    applicationId?: string;
    /** ISO 8601, null si no leída */
    readAt?: string | null;
    createdAt: string;
}
