'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getAllProjectsAction } from '@/app/actions/posts';
import { Post } from '@/features/posts/types/posts.types';
import { PostCard } from '@/components/posts/post-card';
import { Spinner } from '@/components/ui/spinner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Filter = 'ALL' | 'PROJECT' | 'WORKSHOP';

export default function DashboardPage() {
    const [projects, setProjects] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('ALL');

    useEffect(() => {
        let cancelled = false;
        async function fetchProjects() {
            const response = await getAllProjectsAction();
            if (cancelled) return;
            if (response.success && response.data) {
                setProjects(response.data);
            } else {
                toast.error(response.error || 'Error al cargar los proyectos.');
            }
            setIsLoading(false);
        }

        fetchProjects();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(
        () => (filter === 'ALL' ? projects : projects.filter((p) => p.type === filter)),
        [projects, filter],
    );

    return (
        <div className="flex flex-1 flex-col items-center p-4 pt-0 w-full">
            {/* Cabecera */}
            <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Proyectos Recientes</h1>
                    <p className="text-muted-foreground">
                        Explora y únete a proyectos creados por la comunidad.
                    </p>
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

            {/* Grid de cards */}
            <div className="w-full max-w-5xl">
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <Spinner className="w-8 h-8 text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12 border-2 border-dashed rounded-xl">
                        No se encontraron{' '}
                        {filter === 'PROJECT'
                            ? 'proyectos'
                            : filter === 'WORKSHOP'
                              ? 'talleres'
                              : 'publicaciones'}
                        .
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((project) => (
                            <PostCard key={project.id} post={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
