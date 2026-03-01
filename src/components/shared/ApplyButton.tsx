"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { applyToProjectAction } from "@/app/actions/applications"

export function ApplyButton({ postId }: { postId: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleApply = async () => {
        setIsLoading(true)

        // Aquí puedes enviar un mensaje quemado o sacarlo de un Textarea si quisieras un modal
        const result = await applyToProjectAction(postId, "¡Hola! Me gustaría participar en este proyecto.")

        if (result.success) {
            toast.success("¡Te has postulado con éxito!")
        } else {
            toast.error(result.error || "Hubo un error al postularte.")
        }

        setIsLoading(false)
    }

    return (
        <Button onClick={handleApply} disabled={isLoading}>
            {isLoading ? "Enviando..." : "Postularme"}
        </Button>
    )
}