"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BadgePlus } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createPostAction } from "@/app/actions/posts" //
import {useRouter} from "next/navigation";

export function CreatePostDialog() {
    // 1. Estados para controlar el modal, la carga y el tipo seleccionado
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [postType, setPostType] = useState<'PROJECT' | 'WORKSHOP'>('PROJECT')
    const router = useRouter()

    // 2. Función para manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        // Extraemos los datos nativos del formulario
        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string

        try {
            // Llamamos a la acción de servidor con el DTO esperado
            const result = await createPostAction({
                title,
                description,
                type: postType,
            })

            if (result.success) {
                toast.success('¡Post creado exitosamente!')
                setOpen(false) // Cerramos el modal
                window.location.reload()
            } else {
                toast.error(result.error || 'Error al crear el post')
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className='w-full'>
                    <BadgePlus className="mr-2" />
                    Crear post
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                {/* 3. El formulario ahora envuelve solo el contenido del diálogo */}
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Crear Post</DialogTitle>
                        <DialogDescription>
                            Ingresa la información que se te solicita, cuando termines da clic en guardar.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="py-4">
                        {/* 4. Vinculamos el ToggleGroup con el estado postType */}
                        <ToggleGroup
                            variant="outline"
                            type="single"
                            value={postType === 'PROJECT' ? 'project' : 'workshop'}
                            onValueChange={(value) => {
                                // Evitamos que el usuario deseleccione la opción actual dejando el valor vacío
                                if (value) {
                                    setPostType(value === 'workshop' ? 'WORKSHOP' : 'PROJECT')
                                }
                            }}
                        >
                            <ToggleGroupItem value="project" aria-label="Toggle project">
                                Proyecto
                            </ToggleGroupItem>
                            <ToggleGroupItem value="workshop" aria-label="Toggle workshop">
                                Workshop
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <Field>
                            <Label htmlFor="title">Titulo</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ej: Mi proyecto"
                                disabled={isLoading}
                                required
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Investigación, desarrollo, taller, etc."
                                disabled={isLoading}
                                required
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isLoading}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}