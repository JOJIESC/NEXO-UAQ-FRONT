'use server';

import { cookies } from 'next/headers';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { redirect } from 'next/navigation';
import { User } from '@/features/auth/types/auth.types';

export async function loginAction(email: string, password: string) {
    try {
        const response = await apiClient.post<{ access_token: string; user: any }>(
            API_ENDPOINTS.AUTH.LOGIN,
            { email, password },
        );

        // Guardar token en cookie del servidor
        const cookieStore = await cookies();
        (cookieStore).set('access_token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 horas
            path: '/',
        });

        return { success: true, user: response.user, access_token: response.access_token };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
        };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    (cookieStore).delete('access_token');
    redirect('/login');
}

export async function getServerToken() {
    const cookieStore = await cookies();
    return (cookieStore).get('access_token')?.value || null;
}

export async function signupAction(email: string, password: string, name: string, lastname: string, bio?: string){
    try{
        const response = await apiClient.post<{ user: any }>(
            API_ENDPOINTS.USERS.CREATE_USER,
            {password, email, name, lastname, bio},

        )
        return { success: true, user: response.user };
    }catch (error){
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al iniciar sesión',
        };
    }
}

export async function getSessionUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) return null;

        // Utilizamos tu apiClient configurado para Server Components
        const user = await apiClient.getServer<User>(API_ENDPOINTS.USERS.ME);
        return user;
    } catch (error) {
        console.error("Error fetching session user:", error);
        return null;
    }
}