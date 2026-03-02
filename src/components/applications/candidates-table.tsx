"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Check, X, Loader2 } from "lucide-react" // Importamos los iconos
import { acceptBulkApplicationsAction, updateApplicationStatusAction } from "@/app/actions/applications"

export function CandidatesTable({ candidates, postId }: { candidates: any[], postId: string }) {
    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Nuevo estado para controlar qué fila se está procesando individualmente
    const [processingId, setProcessingId] = useState<string | null>(null)

    const pendingCandidates = candidates.filter(c => c.status === 'PENDING' || c.status === 'PENDIENTE')

    const toggleSelectAll = () => {
        if (selectedIds.length === pendingCandidates.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(pendingCandidates.map(c => c.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    // Manejador para los checkboxes masivos
    const handleAcceptSelected = async () => {
        if (selectedIds.length === 0) return

        setIsSubmitting(true)
        const result = await acceptBulkApplicationsAction(selectedIds, postId)

        if (result.success) {
            toast.success(`${selectedIds.length} candidato(s) aceptado(s) exitosamente.`)
            setSelectedIds([])
            router.refresh()
        } else {
            toast.error(result.error || "Hubo un error al procesar la solicitud.")
        }
        setIsSubmitting(false)
    }

    // NUEVO: Manejador para los botones individuales
    const handleIndividualAction = async (id: string, action: 'accept' | 'reject') => {
        setProcessingId(id)

        const result = await updateApplicationStatusAction(id, action, postId)

        if (result.success) {
            toast.success(`Candidato ${action === 'accept' ? 'aceptado' : 'rechazado'} exitosamente.`)
            // Si el candidato estaba seleccionado en los checkboxes, lo quitamos
            setSelectedIds(prev => prev.filter(item => item !== id))
            router.refresh()
        } else {
            toast.error(result.error || "Hubo un error al procesar la solicitud.")
        }

        setProcessingId(null)
    }

    return (
        <div className="space-y-4">
            {/* Barra de acciones masivas */}
            <div className="flex items-center justify-between min-h-[40px]">
                <span className="text-sm text-muted-foreground">
                    {selectedIds.length} seleccionado(s) de {pendingCandidates.length} pendientes
                </span>

                {selectedIds.length > 0 && (
                    <Button
                        onClick={handleAcceptSelected}
                        disabled={isSubmitting || processingId !== null}
                        size="sm"
                    >
                        {isSubmitting ? "Aceptando..." : "Aceptar Seleccionados"}
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={selectedIds.length > 0 && selectedIds.length === pendingCandidates.length}
                                    onCheckedChange={toggleSelectAll}
                                    disabled={pendingCandidates.length === 0 || processingId !== null}
                                />
                            </TableHead>
                            <TableHead>Candidato</TableHead>
                            <TableHead>Mensaje de Postulación</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Estado / Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No hay postulaciones para este proyecto.
                                </TableCell>
                            </TableRow>
                        ) : (
                            candidates.map((application) => {
                                const isPending = application.status === 'PENDING' || application.status === 'PENDIENTE';
                                const initials = `${application.applicant?.name?.charAt(0) || ''}${application.applicant?.lastname?.charAt(0) || ''}`.toUpperCase();
                                const isThisProcessing = processingId === application.id;

                                return (
                                    <TableRow key={application.id}>
                                        <TableCell className="text-center">
                                            {isPending ? (
                                                <Checkbox
                                                    checked={selectedIds.includes(application.id)}
                                                    onCheckedChange={() => toggleSelect(application.id)}
                                                    disabled={isThisProcessing}
                                                />
                                            ) : (
                                                <span className="text-muted-foreground/50">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">
                                                        {application.applicant?.name} {application.applicant?.lastname}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {application.applicant?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={application.message}>
                                            {application.message || <span className="text-muted-foreground italic">Sin mensaje</span>}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(application.createdAt).toLocaleDateString('es-MX')}
                                        </TableCell>

                                        {/* Columna de Estado / Acciones */}
                                        <TableCell className="text-right">
                                            {isPending ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                                        disabled={isThisProcessing || isSubmitting}
                                                        onClick={() => handleIndividualAction(application.id, 'accept')}
                                                    >
                                                        {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                                                        Aceptar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-8 px-2"
                                                        disabled={isThisProcessing || isSubmitting}
                                                        onClick={() => handleIndividualAction(application.id, 'reject')}
                                                    >
                                                        {isThisProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                                                        Rechazar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Badge variant={application.status === 'ACCEPTED' ? "default" : "secondary"}>
                                                    {application.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}