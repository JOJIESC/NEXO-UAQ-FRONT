import { getSessionUser } from "@/app/actions/auth"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {logoutAction} from "@/app/actions/auth";
import { User, Mail, ShieldAlert, BookOpen } from "lucide-react"
import {Button} from "@/components/ui/button";

export default async function AccountPage() {
    // Obtenemos los datos del usuario directamente desde las cookies en el servidor
    const user = await getSessionUser();

    if (!user) return null; // El proxy ya se encarga de redirigir si no hay sesión

    const initials = `${user.name?.charAt(0) || ''}${user.lastname?.charAt(0) || ''}`.toUpperCase();

    // Formateamos el rol para que sea más legible en la UI
    const roleLabels: Record<string, string> = {
        STUDENT: 'Estudiante',
        ADMIN: 'Administrador',
        MODERATOR: 'Moderador'
    };
    const displayRole = roleLabels[user.role] || user.role;

    return (
        <>
            {/* Contenedor Principal */}
            <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-3xl mx-auto mt-4">

                <Card className="overflow-hidden">
                    {/* Cabecera visual de la tarjeta */}
                    <div className="h-32 bg-primary/10 w-full relative">
                        <Avatar className="h-24 w-24 absolute -bottom-12 left-6 border-4 border-background">
                            <AvatarFallback className="text-3xl font-semibold bg-primary text-primary-foreground">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <CardHeader className="pt-16 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    {user.name} {user.lastname}
                                </CardTitle>
                                <CardDescription className="text-base mt-1">
                                    {user.email}
                                </CardDescription>
                            </div>
                            <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'} className="px-3 py-1 text-sm">
                                {displayRole}
                            </Badge>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6 grid gap-6">
                        {/* Sección de Información de Perfil */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-muted-foreground" />
                                Información Personal
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
                                    <p className="font-medium">{user.name} {user.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5" /> Correo Institucional
                                    </p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Rol de Cuenta
                                    </p>
                                    <p className="font-medium">{displayRole}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Biografía */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                                Biografía
                            </h3>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                {user.bio ? (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {user.bio}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Aún no has escrito una biografía.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant='destructive' onClick={logoutAction}>Cerrar Sesión</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}