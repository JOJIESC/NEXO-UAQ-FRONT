import {
    School,
    Users,
    Lightbulb,
    Handshake,
    Github,
    Mail,
    BookOpen,
    UserPlus,
    LogIn,
    LogOut,
    Search,
    Plus,
    Inbox,
    HelpCircle,
    AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-4xl mx-auto mt-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Acerca de NEXO UAQ</h1>
                <p className="text-muted-foreground">
                    Conoce la plataforma y aprende a usarla.
                </p>
            </header>

            <Tabs defaultValue="platform" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="platform">Sobre la plataforma</TabsTrigger>
                    <TabsTrigger value="manual">Manual de usuario</TabsTrigger>
                </TabsList>

                {/* ───────── Sobre la plataforma ───────── */}
                <TabsContent value="platform" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                    <School className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">¿Qué es NEXO UAQ?</CardTitle>
                                    <CardDescription>
                                        Una plataforma para conectar a la comunidad universitaria.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed">
                            <p>
                                <strong>NEXO UAQ</strong> es una plataforma exclusiva para estudiantes de
                                la <strong>Universidad Autónoma de Querétaro</strong> donde puedes publicar
                                proyectos en los que necesitas colaboradores, anunciar talleres que organizas,
                                y descubrir oportunidades creadas por otros estudiantes.
                            </p>
                            <p>
                                El propósito es <strong>romper las barreras entre facultades</strong> y
                                facilitar la colaboración interdisciplinaria. Si estás en arquitectura y
                                buscas a alguien de sistemas para tu proyecto de tesis, o si organizas un
                                taller de fotografía y necesitas asistentes — NEXO UAQ es el lugar.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <Users className="h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-base">Comunidad</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Conéctate con estudiantes de todas las facultades de la UAQ.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-base">Proyectos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Encuentra colaboradores para tus ideas o súmate a las de otros.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Handshake className="h-8 w-8 text-primary mb-2" />
                                <CardTitle className="text-base">Talleres</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Comparte conocimiento o aprende habilidades nuevas.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Información del proyecto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Versión</span>
                                <Badge variant="secondary">v0.1.0</Badge>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Repositorio</span>
                                <a
                                    href="https://github.com/JOJIESC/NEXO-UAQ-FRONT"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:underline"
                                >
                                    <Github className="h-4 w-4" />
                                    JOJIESC/NEXO-UAQ-FRONT
                                </a>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Contacto</span>
                                <a href="mailto:soporte@nexo-uaq.mx" className="flex items-center gap-2 hover:underline">
                                    <Mail className="h-4 w-4" />
                                    soporte@nexo-uaq.mx
                                </a>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Stack</span>
                                <span className="text-right">Next.js 16 · React 19 · TypeScript · TailwindCSS</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ───────── Manual de usuario ───────── */}
                <TabsContent value="manual" className="space-y-6 mt-6">

                    {/* Empezar */}
                    <ManualSection
                        icon={<UserPlus className="h-5 w-5" />}
                        title="1. Crear una cuenta"
                    >
                        <ol className="list-decimal pl-5 space-y-1.5 text-sm">
                            <li>Ve a la página de inicio y haz clic en <strong>&quot;Regístrate&quot;</strong>.</li>
                            <li>Completa el formulario con tu nombre, apellido, correo (preferentemente institucional) y contraseña (mínimo 6 caracteres).</li>
                            <li>Opcionalmente añade una breve <em>bio</em> sobre ti — ayuda a los dueños de proyectos a conocerte.</li>
                            <li>Pulsa <strong>&quot;Crear cuenta&quot;</strong> y luego inicia sesión.</li>
                        </ol>
                    </ManualSection>

                    <ManualSection
                        icon={<LogIn className="h-5 w-5" />}
                        title="2. Iniciar sesión"
                    >
                        <p className="text-sm">
                            Usa tu correo y contraseña en <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/login</code>.
                            Tu sesión permanece activa por <strong>24 horas</strong>; después tendrás que volver a iniciar sesión.
                        </p>
                    </ManualSection>

                    <ManualSection
                        icon={<Search className="h-5 w-5" />}
                        title="3. Explorar y buscar publicaciones"
                    >
                        <p className="text-sm mb-2">
                            En el <strong>Dashboard</strong> verás todas las publicaciones de la comunidad.
                            Cada tarjeta muestra el autor, tipo (Proyecto o Taller), título y descripción.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Usa los botones <strong>Todos / Proyectos / Talleres</strong> para filtrar por tipo.</li>
                            <li>Pulsa <strong>&quot;Ver Detalles&quot;</strong> para abrir la página completa.</li>
                            <li>Para búsquedas más específicas, ve a la sección <strong>Buscar</strong> y escribe palabras clave del título o descripción.</li>
                        </ul>
                    </ManualSection>

                    <ManualSection
                        icon={<Handshake className="h-5 w-5" />}
                        title="4. Postularte a un proyecto o taller"
                    >
                        <ol className="list-decimal pl-5 space-y-1.5 text-sm">
                            <li>Encuentra una publicación que te interese.</li>
                            <li>Haz clic en <strong>&quot;Aplicar&quot;</strong>.</li>
                            <li>Opcionalmente, agrega un mensaje explicando por qué te interesa o qué puedes aportar.</li>
                            <li>Confirma. Recibirás una notificación cuando el dueño acepte o rechace tu solicitud.</li>
                        </ol>
                        <p className="text-sm text-muted-foreground mt-3">
                            ⚠️ No puedes postularte a tus propias publicaciones.
                        </p>
                    </ManualSection>

                    <ManualSection
                        icon={<Plus className="h-5 w-5" />}
                        title="5. Crear una publicación"
                    >
                        <ol className="list-decimal pl-5 space-y-1.5 text-sm">
                            <li>Pulsa <strong>&quot;Crear post&quot;</strong> en el menú lateral.</li>
                            <li>Elige <strong>Proyecto</strong> o <strong>Taller</strong>:</li>
                        </ol>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div className="border rounded-lg p-3 bg-muted/30">
                                <p className="font-semibold text-sm mb-1">Proyecto</p>
                                <p className="text-xs text-muted-foreground">
                                    Construir algo en equipo a mediano-largo plazo. Ej: app móvil, investigación, producción audiovisual.
                                </p>
                            </div>
                            <div className="border rounded-lg p-3 bg-muted/30">
                                <p className="font-semibold text-sm mb-1">Taller</p>
                                <p className="text-xs text-muted-foreground">
                                    Enseñar o aprender una habilidad en sesiones puntuales. Ej: curso de Python, taller de soldadura.
                                </p>
                            </div>
                        </div>
                        <ol start={3} className="list-decimal pl-5 space-y-1.5 text-sm mt-3">
                            <li><strong>Título</strong> entre 5 y 100 caracteres — claro y específico.</li>
                            <li><strong>Descripción</strong> entre 10 y 1000 caracteres — explica el objetivo, qué buscas y qué ofreces.</li>
                            <li>Pulsa <strong>&quot;Guardar&quot;</strong>. Tu publicación aparecerá en el feed inmediatamente.</li>
                        </ol>
                    </ManualSection>

                    <ManualSection
                        icon={<Inbox className="h-5 w-5" />}
                        title="6. Administrar tus publicaciones y candidatos"
                    >
                        <p className="text-sm mb-2">
                            Ve a <strong>&quot;Mis posts&quot;</strong> para ver tus publicaciones. Cada tarjeta tiene:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>Ver</strong> — abre el detalle público.</li>
                            <li><strong>Candidatos</strong> — abre la lista de personas que se postularon.</li>
                        </ul>
                        <p className="text-sm mt-3 mb-1">
                            Desde la tabla de candidatos puedes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Aceptar o rechazar individualmente con los botones de cada fila.</li>
                            <li>Aceptar varios a la vez seleccionando con las casillas y usando el botón en lote.</li>
                        </ul>
                    </ManualSection>

                    <ManualSection
                        icon={<LogOut className="h-5 w-5" />}
                        title="7. Cerrar sesión"
                    >
                        <p className="text-sm">
                            Ve a <strong>Configuración → Zona peligrosa</strong>, o haz clic en tu nombre en el menú lateral y selecciona <strong>&quot;Cerrar sesión&quot;</strong>.
                        </p>
                    </ManualSection>

                    {/* FAQ */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <HelpCircle className="h-5 w-5" />
                                Preguntas frecuentes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <Faq question="¿Es gratuito usar NEXO UAQ?">
                                Sí, completamente gratis para estudiantes de la UAQ.
                            </Faq>
                            <Faq question="¿Puedo postularme a varios proyectos a la vez?">
                                Sí, sin límite. Solo recuerda comprometerte únicamente con los que realmente puedas atender.
                            </Faq>
                            <Faq question="¿Cuánto tiempo dura mi sesión?">
                                24 horas. Después tendrás que iniciar sesión nuevamente.
                            </Faq>
                            <Faq question="¿Puedo editar una publicación después de crearla?">
                                La función de edición está en desarrollo. Por ahora, elimínala y créala de nuevo si necesitas cambios.
                            </Faq>
                            <Faq question="¿Cómo me notifican cuando alguien se postula?">
                                Por ahora debes revisar la sección <strong>Candidatos</strong> manualmente. Las notificaciones automáticas están en el roadmap.
                            </Faq>
                        </CardContent>
                    </Card>

                    {/* Solución de problemas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertTriangle className="h-5 w-5" />
                                Solución de problemas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <Issue title="No puedo iniciar sesión">
                                Verifica que tu correo y contraseña no tengan espacios. Si ves &quot;Sesión expirada&quot;, simplemente vuelve a iniciar sesión.
                            </Issue>
                            <Issue title="El sitio no carga o se ve raro">
                                Refresca con Ctrl+R / ⌘+R. Borra la caché del navegador. Prueba en otro navegador actualizado.
                            </Issue>
                            <Issue title="Mi publicación no aparece en el feed">
                                Refresca la página. Verifica que no tengas un filtro activo (Proyectos/Talleres). Confirma en &quot;Mis posts&quot; que se haya creado correctamente.
                            </Issue>
                            <Issue title="El botón Aplicar no funciona">
                                Asegúrate de haber iniciado sesión. No puedes postularte a tus propias publicaciones. Si ya te habías postulado, el botón puede estar deshabilitado.
                            </Issue>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 flex items-start gap-3">
                            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium mb-1">¿Necesitas más ayuda?</p>
                                <p className="text-muted-foreground">
                                    Escríbenos a <a href="mailto:soporte@nexo-uaq.mx" className="underline">soporte@nexo-uaq.mx</a> indicando qué intentabas hacer y el mensaje de error si lo viste.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ───────── Helpers de presentación ─────────

function ManualSection({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-primary">{icon}</span>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function Faq({ question, children }: { question: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="font-medium mb-1">{question}</p>
            <p className="text-muted-foreground">{children}</p>
        </div>
    );
}

function Issue({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="font-medium mb-1">{title}</p>
            <p className="text-muted-foreground">{children}</p>
        </div>
    );
}
