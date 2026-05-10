'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, X, Eye } from 'lucide-react';

import { getAllProjectsAction } from '@/app/actions/posts';
import { Post } from '@/features/posts/types/posts.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ApplyButton } from '@/components/shared/ApplyButton';
import { toast } from 'sonner';

type Filter = 'ALL' | 'PROJECT' | 'WORKSHOP';

function SearchPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') ?? '';
    const initialType = (searchParams.get('type') as Filter) ?? 'ALL';

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState(initialQuery);
    const [filter, setFilter] = useState<Filter>(initialType);

    // Fetch una sola vez (los posts viven en memoria; el filtrado es client-side)
    useEffect(() => {
        let cancelled = false;
        async function fetchPosts() {
            const response = await getAllProjectsAction();
            if (cancelled) return;
            if (response.success && response.data) {
                setPosts(response.data);
            } else {
                toast.error(response.error || 'Error al cargar las publicaciones.');
            }
            setIsLoading(false);
        }
        fetchPosts();
        return () => {
            cancelled = true;
        };
    }, []);

    // Sincroniza estado → URL (con debounce manual de 250ms en query)
    useEffect(() => {
        const params = new URLSearchParams();
        if (query.trim()) params.set('q', query.trim());
        if (filter !== 'ALL') params.set('type', filter);
        const search = params.toString();
        const url = search ? `/search?${search}` : '/search';

        const handle = setTimeout(() => {
            router.replace(url, { scroll: false });
        }, 250);

        return () => clearTimeout(handle);
    }, [query, filter, router]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return posts.filter((p) => {
            if (filter !== 'ALL' && p.type !== filter) return false;
            if (!q) return true;

            const haystack = [
                p.title,
                p.description,
                p.author?.name,
                p.author?.lastname,
                p.author?.email,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(q);
        });
    }, [posts, query, filter]);

    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full max-w-3xl mx-auto mt-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">Buscar publicaciones</h1>
                <p className="text-muted-foreground">
                    Encuentra proyectos y talleres por título, descripción o autor.
                </p>
            </header>

            {/* Barra de búsqueda */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="search"
                        placeholder="Ej: inteligencia artificial, fotografía, soldadura..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9 pr-9"
                        autoFocus
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Limpiar búsqueda"
                            onClick={() => setQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <ToggleGroup
                    type="single"
                    variant="outline"
                    value={filter}
                    onValueChange={(value) => {
                        if (value) setFilter(value as Filter);
                    }}
                >
                    <ToggleGroupItem value="ALL">Todos</ToggleGroupItem>
                    <ToggleGroupItem value="PROJECT">Proyectos</ToggleGroupItem>
                    <ToggleGroupItem value="WORKSHOP">Talleres</ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Indicador de resultados */}
            {!isLoading && (
                <p className="text-sm text-muted-foreground">
                    {filtered.length === 0
                        ? 'Sin resultados'
                        : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`}
                    {query.trim() && (
                        <>
                            {' '}para <Badge variant="secondary" className="ml-1">&quot;{query.trim()}&quot;</Badge>
                        </>
                    )}
                </p>
            )}

            {/* Resultados */}
            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner className="h-8 w-8 text-primary" />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState query={query} filter={filter} hasPosts={posts.length > 0} />
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((post) => (
                        <SearchResultCard key={post.id} post={post} query={query} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    // useSearchParams() requiere Suspense boundary en App Router.
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-16">
                    <Spinner className="h-8 w-8 text-primary" />
                </div>
            }
        >
            <SearchPageInner />
        </Suspense>
    );
}

// ───────── Componentes de presentación ─────────

function EmptyState({ query, filter, hasPosts }: { query: string; filter: Filter; hasPosts: boolean }) {
    if (!hasPosts) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
                <p>Aún no hay publicaciones en la plataforma.</p>
            </div>
        );
    }

    return (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground space-y-2">
            <p>No se encontraron resultados.</p>
            <p className="text-sm">
                {query.trim()
                    ? <>Prueba con otros términos o quita el filtro de tipo.</>
                    : <>Empieza a escribir para buscar entre {filter === 'ALL' ? 'todas las publicaciones' : filter === 'PROJECT' ? 'los proyectos' : 'los talleres'}.</>}
            </p>
        </div>
    );
}

function SearchResultCard({ post, query }: { post: Post; query: string }) {
    const authorInitials = `${post.author?.name?.charAt(0) ?? ''}${post.author?.lastname?.charAt(0) ?? ''}`.toUpperCase();

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="text-xs font-semibold bg-secondary text-secondary-foreground">
                                {authorInitials || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <CardTitle className="text-base truncate">
                                <Highlight text={post.title} query={query} />
                            </CardTitle>
                            <p className="text-xs text-muted-foreground truncate">
                                {post.author?.name} {post.author?.lastname}
                                {post.createdAt && (
                                    <> · {new Date(post.createdAt).toLocaleDateString('es-MX')}</>
                                )}
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                        {post.type === 'PROJECT' ? 'Proyecto' : 'Taller'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="line-clamp-2">
                    <Highlight text={post.description} query={query} />
                </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
                <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/posts/${post.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                    </Link>
                </Button>
                <div className="flex-1">
                    <ApplyButton postId={post.id} />
                </div>
            </CardFooter>
        </Card>
    );
}

/**
 * Resalta las ocurrencias de `query` dentro de `text`.
 * Case-insensitive. Si no hay query devuelve el texto plano.
 */
function Highlight({ text, query }: { text: string; query: string }) {
    const q = query.trim();
    if (!q) return <>{text}</>;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-yellow-200/70 dark:bg-yellow-500/30 rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                ),
            )}
        </>
    );
}
