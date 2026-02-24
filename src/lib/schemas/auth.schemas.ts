import {z} from 'zod';

export const loginSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(6, 'Must be at least 6 characters long')
});

export const registerSchema = z.object({
    email: z.email(),
    password: z
    .string()
    .min(6, 'Must be at least 6 characters long'),
    name: z
        .string()
        .min(4, 'Must be at least 4 characters long'),
    lastname: z
        .string()
        .min(4, 'Must be at least 4 characters long'),
    bio: z
        .string()
        .optional()
})

// Tipos inferidos desde los schemas
export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;