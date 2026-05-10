'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2, ShieldAlert } from 'lucide-react';

import { deleteAccountAction } from '@/app/actions/users';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

const CONFIRM_TEXT = 'eliminar mi cuenta';

export function DeleteAccountDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const canDelete = confirm.trim().toLowerCase() === CONFIRM_TEXT;

    async function handleDelete() {
        setIsLoading(true);
        const toastId = toast.loading('Eliminando cuenta...');

        const result = await deleteAccountAction();

        if (result.success) {
            toast.success('Cuenta eliminada. Hasta pronto 👋', { id: toastId });
            router.push('/login');
            router.refresh();
        } else {
            toast.error(result.error || 'No se pudo eliminar la cuenta', { id: toastId });
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(o) => {
            setOpen(o);
            if (!o) setConfirm('');
        }}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar cuenta
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="mx-auto sm:mx-0 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <DialogTitle>¿Eliminar tu cuenta?</DialogTitle>
                    <DialogDescription>
                        Tus publicaciones y postulaciones permanecerán visibles para no romper el
                        historial de quienes participaron contigo, pero <strong>tu perfil quedará
                        oculto y no podrás iniciar sesión nuevamente</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Field>
                    <FieldLabel htmlFor="confirm">
                        Para confirmar, escribe{' '}
                        <span className="font-mono text-foreground">{CONFIRM_TEXT}</span>
                    </FieldLabel>
                    <Input
                        id="confirm"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                    />
                    <FieldDescription>
                        Esta acción no se puede deshacer fácilmente.
                    </FieldDescription>
                </Field>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!canDelete || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sí, eliminar
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
