'use server';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { revalidatePath } from 'next/cache';
import { CreatePostDto, UpdatePostDto } from '@/lib/schemas/posts.schemas';
import { Post } from '@/features/posts/types/posts.types';

export async function createPostAction(data: CreatePostDto) {
    try {
        const post = await apiClient.postServer<Post>(API_ENDPOINTS.POSTS.CREATE, data);
        revalidatePath('/posts/my-posts');
        revalidatePath('/dashboard', 'layout');
        return { success: true, data: post };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al crear post',
        };
    }
}

export async function updatePostAction(id: string, data: UpdatePostDto) {
    try {
        const post = await apiClient.patchServer<Post>(
            API_ENDPOINTS.POSTS.UPDATE_PROJECT(id),
            data,
        );
        revalidatePath('/posts/my-posts');
        revalidatePath(`/posts/${id}`);
        return { success: true, data: post };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al actualizar post',
        };
    }
}

export async function deletePostAction(id: string) {
    try {
        await apiClient.deleteServer(API_ENDPOINTS.POSTS.DELETE_PROJECT(id));
        revalidatePath('/posts/my-posts');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al eliminar post',
        };
    }
}

export async function getMyProjectsAction() {
    try {
        const posts = await apiClient.getServer<Post[]>(API_ENDPOINTS.POSTS.GET_MY_PROJECTS);
        return { success: true, data: posts };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener proyectos',
        };
    }
}

export async function getProjectDetailsAction(id: string) {
    try {
        const post = await apiClient.getServer<Post>(API_ENDPOINTS.POSTS.GET_PROJECT_DETAILS(id));
        return { success: true, data: post };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener el proyecto',
        };
    }
}

export async function getAllProjectsAction() {
    try {
        const posts = await apiClient.getServer<Post[]>(
            API_ENDPOINTS.POSTS.GET_ALL_PROJECTS,
            undefined,
            { revalidate: false },
        );
        return { success: true, data: posts };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error al obtener los proyectos',
        };
    }
}
