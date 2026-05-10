import { Palette, Paintbrush, User as UserIcon, Lock, ShieldAlert } from 'lucide-react';
import { getSessionUser, logoutAction } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { ThemePresetSelector } from '@/components/settings/theme-preset-selector';
import { ChangePasswordForm } from '@/components/settings/change-password-form';
import { EditProfileForm } from '@/components/settings/edit-profile-form';
import { DeleteAccountDialog } from '@/components/settings/delete-account-dialog';

export default async function SettingsPage() {
    const user = await getSessionUser();

    if (!user) return null;

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-3xl mx-auto mt-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">
                    Personaliza la apariencia y administra tu cuenta.
                </p>
            </header>

            {/* Apariencia */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        Apariencia
                    </CardTitle>
                    <CardDescription>
                        Elige cómo se ve NEXO UAQ. Por defecto se usa el tema de tu sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeSelector />
                </CardContent>
            </Card>

            {/* Tema de color (presets) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Paintbrush className="h-5 w-5 text-muted-foreground" />
                        Paleta de color
                    </CardTitle>
                    <CardDescription>
                        Cambia el color de acento de la interfaz. Los presets están inspirados en{' '}
                        <a
                            href="https://tweakcn.com/editor/theme"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground underline underline-offset-2"
                        >
                            tweakcn
                        </a>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemePresetSelector />
                </CardContent>
            </Card>

            {/* Perfil */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        Perfil
                    </CardTitle>
                    <CardDescription>
                        Administra la información que la comunidad ve sobre ti. Tu correo no se puede cambiar.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditProfileForm
                        user={{
                            name: user.name,
                            lastname: user.lastname,
                            bio: user.bio,
                        }}
                    />
                </CardContent>
            </Card>

            {/* Seguridad */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        Cambiar contraseña
                    </CardTitle>
                    <CardDescription>
                        Tu sesión se mantiene activa por 24 horas. Cambiar la contraseña no cierra sesiones existentes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>

            <Separator />

            {/* Zona peligrosa */}
            <Card className="border-destructive/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <ShieldAlert className="h-5 w-5" />
                        Zona peligrosa
                    </CardTitle>
                    <CardDescription>
                        Acciones irreversibles relacionadas con tu cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium">Cerrar sesión</p>
                            <p className="text-sm text-muted-foreground">
                                Saldrás de NEXO UAQ en este navegador.
                            </p>
                        </div>
                        <form action={logoutAction}>
                            <Button type="submit" variant="outline">
                                Cerrar sesión
                            </Button>
                        </form>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium">Eliminar cuenta</p>
                            <p className="text-sm text-muted-foreground">
                                Tus posts y postulaciones permanecen visibles, pero tu perfil queda oculto.
                            </p>
                        </div>
                        <DeleteAccountDialog />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
