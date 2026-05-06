'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { User } from '@/features/auth/types/auth.types';

export async function loginAction(email: string, password: string) {
    try {
        const response = await apiClient.post<{ access_token: string; user: User }>(
            API_ENDPOINTS.AUTH.LOGIN,
            { email, password },
        );

        const cookieStore = await cookies();
        cookieStore.set('access_token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        return { success: true, user: response.user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
        };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    revalidatePath('/', 'layout');
    redirect('/login');
}

export async function signupAction(email: string, password: string, name: string, lastname: string, bio?: string) {
    try {
        const response = await apiClient.post<{ user: User }>(
            API_ENDPOINTS.USERS.CREATE_USER,
            { password, email, name, lastname, bio },
        );
        return { success: true, user: response.user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al registrarse',
        };
    }
}

export async function getSessionUser(): Promise<User | null> {
    const cookieStore = await cookies();
    if (!cookieStore.get('access_token')?.value) return null;

    try {
        return await apiClient.getServer<User>(API_ENDPOINTS.USERS.ME);
    } catch (error) {
        console.error('Error fetching session user:', error);
        return null;
    }
}