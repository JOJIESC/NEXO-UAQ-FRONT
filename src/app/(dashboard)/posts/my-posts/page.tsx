'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, Users } from 'lucide-react';

import { useAuth } from '@/providers/AuthProvider';
import { getMyProjectsAction } from '@/app/actions/posts';
import { Post } from '@/features/posts/types/posts.types';
import { PostCard } from '@/components/posts/post-card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function MyPostsPage() {
    const { user } = useAuth();

    const [projects, setProjects] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function fetchMyProjects() {
            if (!user) return;
            const response = await getMyProjectsAction();
            if (cancelled) return;
            if (response.success && response.data) {
                setProjects(response.data);
            } else {
                toast.error(response.error || 'Error al cargar los proyectos.');
            }
            setIsLoading(false);
        }

        fetchMyProjects().catch(console.error);
        return () => {
            cancelled = true;
        };
    }, [user]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mis Proyectos</h1>
                    <p className="text-muted-foreground">
                        Administra los proyectos y talleres de los que eres propietario.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="h-8 w-8 text-primary" />
                </div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                    <p>Aún no has creado ningún proyecto.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.map((project) => (
                        <div key={project.id} className="flex flex-col gap-2">
                            <PostCard post={project} actionLabel="Tus posts" />
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm" className="flex-1">
                                    <Link href={`/posts/${project.id}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Ver
                                    </Link>
                                </Button>
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/posts/${project.id}/candidates`}>
                                        <Users className="w-4 h-4 mr-2" />
                                        Candidatos
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
