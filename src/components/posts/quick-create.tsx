'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowUp, GraduationCap, Lightbulb, Sparkles } from 'lucide-react';

import { useAuth } from '@/providers/AuthProvider';
import { createPostAction } from '@/app/actions/posts';
import { createPostSchema } from '@/lib/schemas/posts.schemas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type PostType = 'PROJECT' | 'WORKSHOP';

const SUGGESTIONS: { type: PostType; icon: React.ComponentType<{ className?: string }>; label: string; example: string }[] = [
    {
        type: 'PROJECT',
        icon: Lightbulb,
        label: 'Proyecto',
        example: 'Busco diseñador para crear una app móvil de hábitos saludables...',
    },
    {
        type: 'WORKSHOP',
        icon: GraduationCap,
        label: 'Taller',
        example: 'Voy a impartir un taller de Python para principiantes...',
    },
];

/**
 * Input estilo "prompt IA" para crear publicaciones rápidamente.
 * Auto-deriva el título de la primera línea (o primeros 80 chars) y usa
 * el resto como descripción.
 */
export function QuickCreate() {
    const { user } = useAuth();
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [type, setType] = useState<PostType>('PROJECT');
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Auto-resize del textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = `${Math.min(ta.scrollHeight, 240)}px`;
    }, [text]);

    const greeting = user?.name ? `, ${user.name}` : '';

    /**
     * Convierte el texto del prompt en un (title, description) válido para el schema.
     * - Title: primera línea, recortada a 100 chars, mínimo 5.
     * - Description: el texto completo (mínimo 10 chars).
     * Si la primera línea es < 5 chars, se rellena con el inicio del texto.
     */
    function deriveTitleAndDescription(raw: string) {
        const trimmed = raw.trim();
        const firstLine = trimmed.split('\n')[0].trim();

        let title = firstLine.length >= 5 ? firstLine : trimmed.slice(0, 80);
        title = title.length > 100 ? title.slice(0, 100) : title;

        // Asegurar mínimo 5 caracteres
        while (title.length < 5) {
            title = `${title} `;
        }
        title = title.trim().padEnd(5, ' ');

        const description = trimmed.length >= 10 ? trimmed : trimmed.padEnd(10, ' ');
        return { title: title.slice(0, 100), description: description.slice(0, 1000) };
    }

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault();

        const trimmed = text.trim();
        if (trimmed.length < 10) {
            toast.error('Cuéntanos un poco más (al menos 10 caracteres).');
            return;
        }

        const { title, description } = deriveTitleAndDescription(trimmed);

        const parsed = createPostSchema.safeParse({ title, description, type });
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? 'Datos inválidos');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Creando publicación...');

        const result = await createPostAction(parsed.data);

        if (result.success && result.data) {
            toast.success('¡Publicación creada!', { id: toastId });
            setText('');
            router.push(`/posts/${result.data.id}`);
        } else {
            toast.error(result.error || 'No se pudo crear', { id: toastId });
        }
        setIsLoading(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Enter sin shift envía. Shift+Enter inserta nueva línea (default).
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSubmit();
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
            {/* Saludo */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    <Sparkles className="h-3 w-3" />
                    Inicio
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                    Hola{greeting}
                </h1>
                <p className="text-muted-foreground mt-2 sm:text-lg">
                    ¿Qué proyecto o taller quieres compartir hoy?
                </p>
            </div>

            {/* Prompt input */}
            <form
                onSubmit={handleSubmit}
                className="w-full rounded-3xl border bg-card shadow-lg transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-ring/50"
            >
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        type === 'PROJECT'
                            ? 'Describe tu proyecto: qué quieres construir, qué perfil buscas, qué ofreces...'
                            : 'Describe tu taller: qué enseñarás, para quién es, cuándo y dónde...'
                    }
                    rows={3}
                    disabled={isLoading}
                    className={cn(
                        'w-full resize-none border-0 bg-transparent px-6 pt-5 text-base placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-50',
                    )}
                />

                {/* Toolbar inferior */}
                <div className="flex items-center justify-between gap-2 px-3 py-3 border-t">
                    {/* Toggle tipo */}
                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                        {SUGGESTIONS.map((s) => {
                            const Icon = s.icon;
                            const active = type === s.type;
                            return (
                                <button
                                    key={s.type}
                                    type="button"
                                    onClick={() => setType(s.type)}
                                    className={cn(
                                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                                        active
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                    aria-pressed={active}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {s.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Botón submit */}
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || text.trim().length < 10}
                        className="h-9 w-9 rounded-full shrink-0"
                        aria-label="Crear publicación"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                </div>
            </form>

            {/* Sugerencias */}
            <div className="w-full">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 text-center">
                    Empieza con un ejemplo
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SUGGESTIONS.map((s) => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={s.type}
                                type="button"
                                onClick={() => {
                                    setType(s.type);
                                    setText(s.example);
                                    textareaRef.current?.focus();
                                }}
                                className="flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-md hover:border-foreground/20"
                            >
                                <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm mb-0.5">{s.label}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {s.example}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
