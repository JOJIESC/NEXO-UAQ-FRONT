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
  FieldSeparator,
} from "@/components/ui/field"
import {toast} from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import React, {useState} from "react";
import {LoginDto, loginSchema} from "@/lib/schemas/auth.schemas";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {loginAction} from "@/app/actions/auth";
import {useRouter} from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const {register,
  handleSubmit, formState: {errors},} = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginDto) => {

    setIsLoading(true)
    toast.success('Cargando')
    try{
      const result = await loginAction(data.email, data.password)

      if(result.success && result.access_token){

        toast.success('!Bienvenido')
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(result.error || 'Error al iniciar sesión')
      }
    }catch(error){
      toast.error('Error inesperado al iniciar sesion')
    }finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa con tu cuenta de Google o Apple
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@uaq.com"
                  {...register('email')}
                  disabled={isLoading}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" required disabled={isLoading} {...register('password')}/>
              </Field>
              <Field>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? (
                      <>
                        {/* Agregamos un margen a la derecha (mr-2) y la animación de girar */}
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando Sesión
                      </>
                  ) : (
                      'Login'
                  )}
                </Button>
                <FieldDescription className="text-center">
                  ¿No tienes una cuenta? <a href="/signup">Registrate</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
