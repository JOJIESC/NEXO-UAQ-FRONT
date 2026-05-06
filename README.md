# NEXO UAQ — Frontend

Plataforma web para que estudiantes de la UAQ publiquen **proyectos** y **talleres**, y otros estudiantes se postulen como candidatos. El dueño de cada publicación gestiona las solicitudes (aceptar / rechazar).

Frontend en **Next.js 16 (App Router)** con **React 19**, **TypeScript** y **TailwindCSS v4**. Consume un backend REST desplegado en `https://nexo-uaq-back.vercel.app`.

---

## Tabla de contenidos

- [Stack](#stack)
- [Requisitos](#requisitos)
- [Setup](#setup)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas](#rutas)
- [Autenticación](#autenticación)
- [Flujo de datos](#flujo-de-datos)
- [Convenciones de código](#convenciones-de-código)
- [Despliegue](#despliegue)
- [Documentación adicional](#documentación-adicional)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| UI | [React 19](https://react.dev/), [TailwindCSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (sobre Radix UI) |
| Iconos | [lucide-react](https://lucide.dev/) |
| Formularios | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) |
| Tablas | [@tanstack/react-table](https://tanstack.com/table) |
| Estado | [zustand](https://zustand-demo.pmnd.rs/) (instalado, todavía sin uso extenso) |
| Notificaciones | [sonner](https://sonner.emilkowal.ski/) |
| Tema | [next-themes](https://github.com/pacocoursey/next-themes) |
| Lenguaje | TypeScript 5 (`strict: true`) |

---

## Requisitos

- **Node.js** ≥ 20 (Next.js 16 lo exige).
- **npm** (el repo usa `package-lock.json`). También funciona con `pnpm`/`yarn`/`bun`, pero el lockfile es de npm.

---

## Setup

```bash
# 1. Clonar
git clone git@github.com:JOJIESC/NEXO-UAQ-FRONT.git
cd NEXO-UAQ-FRONT

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env.local
# Edita .env.local si necesitas apuntar a otro backend

# 4. Levantar el dev server
npm run dev
```

La app queda en [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://nexo-uaq-back.vercel.app` | URL del backend REST. Para desarrollo local del backend, usa `http://localhost:3001` o el puerto correspondiente. |

> **Nota:** todas las llamadas al backend pasan por `apiClient` ([src/lib/api/client.ts](src/lib/api/client.ts)) y se ejecutan en server actions, por lo que la URL no necesita ser accesible desde el navegador del cliente — pero la dejamos como `NEXT_PUBLIC_*` por convención y porque eventualmente se podrían añadir llamadas desde Client Components.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Dev server con hot reload (Turbopack). |
| `npm run build` | Build de producción. |
| `npm start` | Sirve el build de producción. |
| `npm run lint` | Lint con ESLint (config flat + `eslint-config-next`). |

---

## Estructura del proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── (auth)/                   # Route group: rutas públicas de auth
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Route group: rutas protegidas (con sidebar)
│   │   ├── layout.tsx            # Layout con AppSidebar + DynamicBreadcrumb
│   │   ├── dashboard/            # Feed principal de proyectos/talleres
│   │   ├── posts/
│   │   │   ├── [id]/             # Detalle de un proyecto
│   │   │   └── my-posts/         # "Mis posts" (los que soy dueño)
│   │   └── account/
│   ├── actions/                  # Server Actions (la única capa que llama al backend)
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   └── applications.ts
│   ├── layout.tsx                # Root layout: AuthProvider + TooltipProvider + Toaster
│   ├── page.tsx                  # Landing
│   └── globals.css
│
├── components/
│   ├── ui/                       # Primitivos shadcn/ui (button, card, dialog, ...)
│   ├── layout/                   # AppSidebar, NavMain, NavUser, DynamicBreadcrumb...
│   ├── auth/                     # LoginForm, SignupForm
│   ├── posts/                    # CreatePostDialog
│   ├── applications/             # CandidatesTable
│   └── shared/                   # ApplyButton
│
├── features/                     # Tipos de dominio agrupados por feature
│   ├── auth/types/auth.types.ts
│   ├── posts/types/posts.types.ts
│   └── applications/types/applications.types.ts
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # ApiClient singleton (server-only auth via cookie)
│   │   └── endpoints.ts          # Catálogo central de endpoints
│   ├── schemas/                  # Schemas Zod (auth, posts)
│   ├── navigation.ts             # Items del sidebar
│   └── utils.ts                  # cn() helper
│
├── providers/
│   └── AuthProvider.tsx          # Context con el user del server
│
├── hooks/
│   └── use-mobile.ts
│
└── middleware.ts                 # Protección de rutas (cookie access_token)
```

---

## Rutas

### Públicas (`(auth)` group, sin sidebar)

| Ruta | Descripción |
|---|---|
| `/` | Landing pública |
| `/login` | Login con email + contraseña |
| `/signup` | Registro de nuevo usuario |

### Protegidas (`(dashboard)` group, con sidebar — requieren cookie `access_token`)

| Ruta | Descripción |
|---|---|
| `/dashboard` | Feed de todos los proyectos/talleres con filtro |
| `/posts/[id]` | Detalle de un post |
| `/posts/my-posts` | Posts de los que el usuario es dueño |
| `/posts/[id]/candidates` | (Por implementar) Tabla de candidatos al post |
| `/account` | Perfil del usuario |

El [middleware](src/middleware.ts) redirige:
- `/dashboard`, `/posts/my-posts`, `/posts/create`, `/account` → `/login` si no hay token.
- `/login`, `/signup` → `/dashboard` si ya hay token.

---

## Autenticación

Auth basada en **JWT en cookie httpOnly** (no `localStorage`).

```
┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Client     │      │   Server Action  │      │   Backend REST   │
│   Component  │      │   (Next.js)      │      │                  │
└──────┬───────┘      └────────┬─────────┘      └────────┬─────────┘
       │                       │                         │
       │  loginAction(email,…) │                         │
       ├──────────────────────►│                         │
       │                       │  POST /auth/login       │
       │                       ├────────────────────────►│
       │                       │  { access_token, user } │
       │                       │◄────────────────────────┤
       │                       │                         │
       │                       │  cookies().set(         │
       │                       │    'access_token',      │
       │                       │    { httpOnly: true })  │
       │                       │                         │
       │  { success, user }    │                         │
       │◄──────────────────────┤                         │
       │                       │                         │
       │  router.push('/dashboard')                      │
       │  router.refresh()  ◄── revalida el RSC tree     │
```

**Cosas a saber:**
- El `access_token` **solo** se guarda en cookie httpOnly seteada por `loginAction` ([src/app/actions/auth.ts](src/app/actions/auth.ts)).
- El backend recibe el token vía header `Authorization: Bearer <token>`, lo añade `apiClient.request()` leyendo la cookie en cada request server-side.
- El usuario actual se obtiene en el **root layout** ([src/app/layout.tsx](src/app/layout.tsx)) llamando a `getSessionUser()` y se pasa al `AuthProvider`. Los Client Components lo consumen con `useAuth()`.
- `logoutAction()` borra la cookie, hace `revalidatePath('/', 'layout')` y redirige a `/login`.
- Si el backend devuelve 401, `apiClient` lanza un error normal — no hay manejo automático de "session expired" en el cliente (porque el cliente no toca tokens). Considera añadir un `error.tsx` que detecte esto.

---

## Flujo de datos

**Toda comunicación con el backend pasa por una server action**, no hay `fetch` directo desde Client Components.

### Patrón general de una server action

```ts
'use server';

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { revalidatePath } from 'next/cache';

export async function someAction(data: SomeDto) {
    try {
        const result = await apiClient.postServer<SomeType>(
            API_ENDPOINTS.SOMETHING.CREATE,
            data,
        );
        revalidatePath('/affected-route');
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Mensaje fallback',
        };
    }
}
```

Devolver `{ success, data?, error? }` permite a los componentes manejar el resultado sin try/catch.

### `apiClient` ([src/lib/api/client.ts](src/lib/api/client.ts))

| Método | Uso |
|---|---|
| `getServer<T>(endpoint, params?, cacheOptions?)` | GET cacheable (configurable via `revalidate` y `tags`). |
| `postServer<T>(endpoint, data?)` | POST sin cache. |
| `patchServer<T>(endpoint, data?)` | PATCH sin cache. |
| `deleteServer<T>(endpoint)` | DELETE sin cache. |
| `postFormData<T>(endpoint, formData)` | Para subir archivos. |
| `get/post/patch/put/delete` | Variantes "client" (no cache config), reservadas por si en el futuro hace falta llamar desde Client Components. |

El método privado `getAuthToken()` solo lee la cookie en el server (`typeof window === 'undefined'`); en cliente devuelve `null`.

### Cache strategy

- Por default, los `*Server` GET usan `force-cache`. Pasa `{ revalidate: false }` para `no-store` o `{ revalidate: 60, tags: ['posts'] }` para revalidación incremental.
- Las mutaciones llaman a `revalidatePath('/ruta')` para invalidar el RSC tree del segmento afectado.

---

## Convenciones de código

| Tema | Convención |
|---|---|
| **Path alias** | `@/*` → `src/*` (configurado en `tsconfig.json`). |
| **Archivos** | kebab-case para componentes (`login-form.tsx`), PascalCase para componentes "feature" (`CreatePostDialog.tsx`, `ApplyButton.tsx`). _(No es 100% consistente — aceptado por ahora.)_ |
| **Server Actions** | Una acción por operación, agrupadas por dominio en `src/app/actions/`. Siempre devuelven `{ success, data?, error? }`. |
| **Tipos de dominio** | En `src/features/<dominio>/types/`. Importa con `@/features/.../types/...`. |
| **Schemas Zod** | En `src/lib/schemas/`. Exportar tanto el schema como el `Dto` inferido. |
| **Endpoints** | Centralizados en `src/lib/api/endpoints.ts`, no hardcodear strings. |
| **Toasts** | `sonner` global montado en root layout. Usar `toast.loading(id) → toast.success/error(..., { id })` para flujos asíncronos. |
| **Estilos** | Tailwind utility classes; helper `cn()` para condicionales. |
| **Componentes UI** | shadcn/ui añadidos con `npx shadcn@latest add <componente>` (van a `src/components/ui/`). |

---

## Despliegue

El proyecto está pensado para [Vercel](https://vercel.com/):

- Push a `main` dispara deploy de producción.
- Pull requests generan preview deployments.
- La variable `NEXT_PUBLIC_API_URL` se configura en el dashboard de Vercel.

Para deploy manual en otra plataforma:

```bash
npm run build
npm start  # corre en el puerto 3000 por default
```

---

## Documentación adicional

- [`docs/architecture.md`](docs/architecture.md) — Decisiones de arquitectura, capas y patrones.
- [`docs/api.md`](docs/api.md) — Referencia de endpoints del backend que consume el front.
- [`CLAUDE.md`](CLAUDE.md) — Contexto para asistentes IA (Claude Code).
