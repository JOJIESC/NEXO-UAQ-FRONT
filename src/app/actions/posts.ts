'use server';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { revalidateTag } from 'next/cache';
import { CreatePostDto, UpdatePostDto } from '@/lib/schemas/posts.schemas';

export async function createPostAction(data: CreatePostDto) {
    try {
        const post = await apiClient.postServer(
            API_ENDPOINTS.POSTS.CREATE,
            data
        );

        // Revalidar el caché de posts
        revalidateTag('posts',"max");

        return { success: true, data: post };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear post'
        };
    }
}

export async function updatePostAction(id: string, data: UpdatePostDto) {
    // try {
    //     const post = await apiClient.patchServer(
    //         API_ENDPOINTS.POSTS.(id),
    //         data
    //     );
    //
    //     revalidateTag('posts',"max");
    //     revalidateTag(`post-${id}`,"max");
    //
    //     return { success: true, data: post };
    // } catch (error) {
    //     return {
    //         success: false,
    //         error: error instanceof Error ? error.message : 'Error al actualizar post'
    //     };
    // }
}

export async function deletePostAction(id: string) {
    // try {
    //     await apiClient.deleteServer(API_ENDPOINTS.POSTS.DELETE(id));
    //
    //     revalidateTag('posts',"max");
    //
    //     return { success: true };
    // } catch (error) {
    //     return {
    //         success: false,
    //         error: error instanceof Error ? error.message : 'Error al eliminar post'
    //     };
    // }
}

export async function getMyProjectsAction(){
    try {
        // Como esto se ejecuta en el servidor, usar apiClient aquí es 100% seguro y legal
        const posts = await apiClient.getServer<any[]>(API_ENDPOINTS.POSTS.GET_MY_PROJECTS);
        return { success: true, data: posts };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener proyectos'
        };
    }
}

export async function getProjectDetailsAction(id: string) {
    try {
        // Hacemos la petición al backend con el ID
        const post = await apiClient.getServer<any>(API_ENDPOINTS.POSTS.GET_PROJECT_DETAILS(id));
        return { success: true, data: post };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener el proyecto'
        };
    }
}