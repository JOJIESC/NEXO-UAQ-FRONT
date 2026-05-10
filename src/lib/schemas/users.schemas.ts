import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres').optional(),
    lastname: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres').optional(),
    bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
        newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
        confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Las contraseñas nuevas no coinciden',
        path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'La nueva contraseña debe ser diferente a la actual',
        path: ['newPassword'],
    });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormDto = z.infer<typeof changePasswordSchema>;
/** Lo que enviamos al backend (sin confirmPassword) */
export type ChangePasswordDto = Pick<ChangePasswordFormDto, 'currentPassword' | 'newPassword'>;
