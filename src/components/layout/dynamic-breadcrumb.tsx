"use client"

import React from "react"
import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Diccionario para traducir las rutas de la URL a texto amigable
const routeDictionary: Record<string, string> = {
    dashboard: "Nexo UAQ",
    posts: "Proyectos",
    "my-posts": "Mis Proyectos",
    account: "Mi Cuenta"
}

export function DynamicBreadcrumb() {
    const pathname = usePathname()

    // Separamos la URL y quitamos los espacios en blanco
    const segments = pathname.split("/").filter((segment) => segment !== "")

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1

                    // Vamos construyendo la URL acumulada (ej. /posts, luego /posts/my-posts)
                    const href = `/${segments.slice(0, index + 1).join("/")}`

                    // Buscamos el nombre en el diccionario
                    let segmentName = routeDictionary[segment]

                    // Si no está en el diccionario y es un UUID (ej. el ID de un proyecto), le ponemos "Detalles"
                    if (!segmentName) {
                        if (segment.length >= 32 && segment.includes("-")) {
                            segmentName = "Detalles"
                        } else {
                            // Si es otra cosa, simplemente capitalizamos la primera letra
                            segmentName = segment.charAt(0).toUpperCase() + segment.slice(1)
                        }
                    }

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                {!isLast ? (
                                    <BreadcrumbLink href={href}>
                                        {segmentName}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>

                            {/* Solo mostramos el separador si no es el último elemento */}
                            {!isLast && (
                                <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                            )}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}