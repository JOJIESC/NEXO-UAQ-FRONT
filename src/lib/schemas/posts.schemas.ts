import {z} from 'zod';

const createPostSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    type: z.enum(['PROJECT', 'WORKSHOP']),
});

export const updatePostSchema = createPostSchema.partial() // Todos opcionales

// 2. Infiere el DTO desde el Schema
export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;