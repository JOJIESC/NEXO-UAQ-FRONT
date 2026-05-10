'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import React, { useState } from "react";
import Link from "next/link";
import { LoginDto, loginSchema } from "@/lib/schemas/auth.schemas";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true)
    const toastId = toast.loading('Iniciando sesión...')
    try {
      const result = await loginAction(data.email, data.password)

      if (result.success) {
        toast.success('¡Bienvenido!', { id: toastId })
        router.push("/home")
        router.refresh()
      } else {
        toast.error(result.error || 'Error al iniciar sesión', { id: toastId })
      }
    } catch {
      toast.error('Error inesperado al iniciar sesión', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa con tu correo y contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@uaq.com"
                  {...register('email')}
                  disabled={isLoading}
                  required
                />
                {errors.email && (
                  <FieldDescription className="text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required disabled={isLoading} {...register('password')} />
                {errors.password && (
                  <FieldDescription className="text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
                <FieldDescription className="text-center">
                  ¿No tienes una cuenta? <Link href="/signup">Regístrate</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al continuar, aceptas nuestros <Link href="/terms">Términos de servicio</Link>{" "}
        y <Link href="/privacy">Política de privacidad</Link>.
      </FieldDescription>
    </div>
  )
}
