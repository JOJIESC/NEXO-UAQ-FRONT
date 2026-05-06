'use server';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { revalidatePath } from 'next/cache';
import { Application } from '@/features/applications/types/applications.types';

export async function applyToProjectAction(postId: string, message?: string) {
    try {
        const payload = message ? { message } : {};

        const application = await apiClient.postServer<Application>(
            API_ENDPOINTS.APPLICATIONS.APPLY(postId),
            payload,
        );

        revalidatePath(`/dashboard/projects/${postId}`);

        return { success: true, data: application };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al enviar la solicitud',
        };
    }
}

export async function getProjectCandidatesAction(postId: string) {
    try {
        const candidates = await apiClient.getServer<Application[]>(
            API_ENDPOINTS.APPLICATIONS.GET_PARTICIPANTS(postId),
        );

        return { success: true, data: candidates };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener los candidatos',
        };
    }
}

export async function acceptBulkApplicationsAction(applicationIds: string[], postId: string) {
    try {
        await Promise.all(
            applicationIds.map(id =>
                apiClient.patchServer(API_ENDPOINTS.APPLICATIONS.PATCH_ACCEPT_REQUEST(id), {}),
            ),
        );

        revalidatePath(`/posts/${postId}/candidates`);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al aceptar candidatos',
        };
    }
}

export async function updateApplicationStatusAction(
    applicationId: string,
    action: 'accept' | 'reject',
    postId: string,
) {
    try {
        const endpoint = action === 'accept'
            ? API_ENDPOINTS.APPLICATIONS.PATCH_ACCEPT_REQUEST(applicationId)
            : API_ENDPOINTS.APPLICATIONS.PATCH_REJECT_REQUEST(applicationId);

        await apiClient.patchServer(endpoint, {});

        revalidatePath(`/posts/${postId}/candidates`);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar el estado',
        };
    }
}
