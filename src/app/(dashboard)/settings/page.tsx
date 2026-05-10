import Link from 'next/link';
import { Palette, User as UserIcon, Lock, Bell, ShieldAlert, ArrowRight } from 'lucide-react';
import { getSessionUser, logoutAction } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeSelector } from '@/components/settings/theme-selector';

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

            {/* Perfil */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        Perfil
                    </CardTitle>
                    <CardDescription>
                        Administra la información que la comunidad ve sobre ti.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                            <p className="font-medium">{user.name} {user.lastname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Correo</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground mb-1">Bio</p>
                            <p className="font-medium text-sm">
                                {user.bio || <span className="italic text-muted-foreground">Sin biografía</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button variant="outline" asChild>
                            <Link href="/account">
                                Ver perfil completo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Badge variant="secondary">Edición próximamente</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Seguridad */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        Seguridad
                    </CardTitle>
                    <CardDescription>
                        Tu sesión se mantiene activa por 24 horas. Después tendrás que iniciar sesión de nuevo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Cambiar contraseña</p>
                    <Badge variant="secondary">Próximamente</Badge>
                </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        Notificaciones
                    </CardTitle>
                    <CardDescription>
                        Avísame cuando alguien se postule a mis publicaciones o cuando cambie el estado de mis solicitudes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Configurar preferencias</p>
                    <Badge variant="secondary">Próximamente</Badge>
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
                            <p className="text-sm text-muted-foreground">Saldrás de NEXO UAQ en este navegador.</p>
                        </div>
                        <form action={logoutAction}>
                            <Button type="submit" variant="destructive">Cerrar sesión</Button>
                        </form>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="font-medium">Eliminar cuenta</p>
                            <p className="text-sm text-muted-foreground">Borra permanentemente tu cuenta y todas tus publicaciones.</p>
                        </div>
                        <Badge variant="secondary">Próximamente</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
