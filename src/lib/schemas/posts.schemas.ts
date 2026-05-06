import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    type: z.enum(['PROJECT', 'WORKSHOP']),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;