'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

import { changePasswordAction } from '@/app/actions/users';
import {
    changePasswordSchema,
    type ChangePasswordFormDto,
} from '@/lib/schemas/users.schemas';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormDto>({
        resolver: zodResolver(changePasswordSchema),
    });

    async function onSubmit(data: ChangePasswordFormDto) {
        setIsLoading(true);
        const toastId = toast.loading('Cambiando contraseña...');

        const result = await changePasswordAction({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });

        if (result.success) {
            toast.success('Contraseña actualizada', { id: toastId });
            reset();
        } else {
            toast.error(result.error || 'Error al cambiar la contraseña', { id: toastId });
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <Field>
                <FieldLabel htmlFor="currentPassword">Contraseña actual</FieldLabel>
                <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...register('currentPassword')}
                />
                {errors.currentPassword && (
                    <FieldDescription className="text-destructive">
                        {errors.currentPassword.message}
                    </FieldDescription>
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="newPassword">Nueva contraseña</FieldLabel>
                <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register('newPassword')}
                />
                {errors.newPassword && (
                    <FieldDescription className="text-destructive">
                        {errors.newPassword.message}
                    </FieldDescription>
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="confirmPassword">Confirma la nueva contraseña</FieldLabel>
                <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <FieldDescription className="text-destructive">
                        {errors.confirmPassword.message}
                    </FieldDescription>
                )}
            </Field>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Cambiar contraseña
                    </>
                )}
            </Button>
        </form>
    );
}
