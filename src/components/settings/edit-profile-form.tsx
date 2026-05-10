'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { updateProfileAction } from '@/app/actions/users';
import { updateProfileSchema, type UpdateProfileDto } from '@/lib/schemas/users.schemas';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { User } from '@/features/auth/types/auth.types';

interface EditProfileFormProps {
    user: Pick<User, 'name' | 'lastname' | 'bio'>;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileDto>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name,
            lastname: user.lastname,
            bio: user.bio ?? '',
        },
    });

    async function onSubmit(data: UpdateProfileDto) {
        setIsLoading(true);
        const toastId = toast.loading('Guardando cambios...');

        const result = await updateProfileAction(data);

        if (result.success) {
            toast.success('Perfil actualizado', { id: toastId });
            router.refresh();
        } else {
            toast.error(result.error || 'Error al actualizar', { id: toastId });
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input id="name" disabled={isLoading} {...register('name')} />
                    {errors.name && (
                        <FieldDescription className="text-destructive">
                            {errors.name.message}
                        </FieldDescription>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="lastname">Apellidos</FieldLabel>
                    <Input id="lastname" disabled={isLoading} {...register('lastname')} />
                    {errors.lastname && (
                        <FieldDescription className="text-destructive">
                            {errors.lastname.message}
                        </FieldDescription>
                    )}
                </Field>
            </div>

            <Field>
                <FieldLabel htmlFor="bio">Biografía</FieldLabel>
                <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Cuéntale a la comunidad sobre ti..."
                    disabled={isLoading}
                    {...register('bio')}
                />
                {errors.bio && (
                    <FieldDescription className="text-destructive">
                        {errors.bio.message}
                    </FieldDescription>
                )}
            </Field>

            <Button type="submit" disabled={isLoading || !isDirty}>
                {isLoading ? (
                    <>
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar cambios
                    </>
                )}
            </Button>
        </form>
    );
}
