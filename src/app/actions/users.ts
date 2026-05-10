'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { User } from '@/features/auth/types/auth.types';
import type {
    UpdateProfileDto,
    ChangePasswordDto,
} from '@/lib/schemas/users.schemas';

/** Actualiza el perfil del usuario autenticado (name, lastname, bio). */
export async function updateProfileAction(data: UpdateProfileDto) {
    try {
        const user = await apiClient.patchServer<User>(
            API_ENDPOINTS.USERS.UPDATE_ME,
            data,
        );
        revalidatePath('/', 'layout');
        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar perfil',
        };
    }
}

/** Cambia la contraseña verificando la actual. */
export async function changePasswordAction(data: ChangePasswordDto) {
    try {
        await apiClient.patchServer<{ success: true }>(
            API_ENDPOINTS.USERS.CHANGE_PASSWORD,
            data,
        );
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al cambiar la contraseña',
        };
    }
}

/**
 * Elimina la cuenta (soft delete) y limpia la cookie de sesión.
 * El componente que la llame debe redirigir manualmente a /login.
 */
export async function deleteAccountAction() {
    try {
        await apiClient.deleteServer(API_ENDPOINTS.USERS.DELETE_ME);
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al eliminar la cuenta',
        };
    }
}
