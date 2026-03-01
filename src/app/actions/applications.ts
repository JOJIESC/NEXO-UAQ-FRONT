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