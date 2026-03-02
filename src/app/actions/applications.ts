'use server';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { revalidatePath } from 'next/cache';

export async function applyToProjectAction(postId: string, message?: string) {
    try {
        // Construimos el payload. Si hay mensaje lo enviamos, si no, enviamos un objeto vacío.
        const payload = message ? { message } : {};

        // Hacemos el POST usando el endpoint que configuraste: /applications/${postId}
        const application = await apiClient.postServer(
            API_ENDPOINTS.APPLICATIONS.APPLY(postId),
            payload
        );

        // Revalidamos la página de detalles de este proyecto en específico
        // para que si muestras un botón de "Ya postulado", la UI se actualice automáticamente.
        revalidatePath(`/dashboard/projects/${postId}`);

        return { success: true, data: application };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al enviar la solicitud'
        };
    }
}

export async function getProjectCandidatesAction(postId: string) {
    try {
        // Hacemos el GET al endpoint que configuraste: /applications/posts/${postId}
        const candidates = await apiClient.getServer<any[]>(
            API_ENDPOINTS.APPLICATIONS.GET_PARTICIPANTS(postId),
        );

        return { success: true, data: candidates };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener los candidatos'
        };
    }
}

export async function acceptBulkApplicationsAction(applicationIds: string[], postId: string) {
    try {
        // Ejecutamos las peticiones PATCH en paralelo para todos los IDs seleccionados
        await Promise.all(
            applicationIds.map(id =>
                // Asumiendo que tu apiClient tiene el método patchServer (o similar para hacer PATCH)
                apiClient.patchServer(API_ENDPOINTS.APPLICATIONS.PATCH_ACCEPT_REQUEST(id), {})
            )
        );

        // Revalidamos la ruta para que la tabla de la página se actualice al instante
        revalidatePath(`/posts/${postId}/candidates`);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al aceptar candidatos'
        };
    }
}

// Añade esto al final de src/app/actions/applications.ts

export async function updateApplicationStatusAction(
    applicationId: string,
    action: 'accept' | 'reject',
    postId: string
) {
    try {
        // Seleccionamos el endpoint correcto según la acción solicitada
        const endpoint = action === 'accept'
            ? API_ENDPOINTS.APPLICATIONS.PATCH_ACCEPT_REQUEST(applicationId)
            : API_ENDPOINTS.APPLICATIONS.PATCH_REJECT_REQUEST(applicationId);

        // Hacemos la petición PATCH
        await apiClient.patchServer(endpoint, {});

        // Revalidamos la ruta para que los cambios se reflejen inmediatamente
        revalidatePath(`/posts/${postId}/candidates`);

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar el estado'
        };
    }
}