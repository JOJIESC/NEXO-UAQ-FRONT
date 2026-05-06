# Arquitectura

Este documento explica las decisiones de diseño del frontend, las capas, y los patrones que se usan a lo largo del código.

---

## Visión general

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (Client Components)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React 19 + Tailwind + shadcn/ui                           │ │
│  │  - useAuth() para leer el user del context                 │ │
│  │  - Llama a Server Actions para mutar/leer datos            │ │
│  └─────────────────────┬──────────────────────────────────────┘ │
└────────────────────────┼────────────────────────────────────────┘
                         │ Server Action (RPC)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Server (Node runtime, RSC)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Server Components & Actions (src/app/...)                 │ │
│  │  - Leen cookie httpOnly                                     │ │
│  │  - Usan apiClient para llamar al backend                    │ │
│  │  - revalidatePath() después de mutaciones                  │ │
│  └─────────────────────┬──────────────────────────────────────┘ │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP + Authorization: Bearer <jwt>
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│        Backend REST  ─  https://nexo-uaq-back.vercel.app        │
└─────────────────────────────────────────────────────────────────┘
```

**Principio de oro:** los Client Components nunca llaman directo al backend. Todo pasa por Server Actions, que son la única capa que conoce la cookie del JWT.

---

## Capas

### 1. UI (`src/components/ui/`)

Primitivos de [shadcn/ui](https://ui.shadcn.com/), añadidos con `npx shadcn@latest add <name>`. No contienen lógica de negocio. Se pueden modificar libremente — son código del repo, no una dependencia.

### 2. Componentes de feature (`src/components/{auth,posts,applications,layout,shared}/`)

Componentes con lógica más específica del dominio. Pueden ser:
- **Client Components** que llaman a Server Actions (ej: `LoginForm`, `CreatePostDialog`).
- **Layout** (sidebar, breadcrumb).

### 3. Pages & Layouts (`src/app/.../page.tsx`, `layout.tsx`)

Por convención del App Router:
- **Server Components por default** (mejor para SEO y para usar `apiClient` directamente con la cookie).
- **Client Components** (`'use client'`) cuando necesitan estado, hooks o interactividad. Ej: `dashboard/page.tsx` usa `useState` para el filtro.

### 4. Server Actions (`src/app/actions/`)

Funciones marcadas con `'use server'` que envuelven cada operación contra el backend. Ventajas sobre route handlers:
- Tipos compartidos entre cliente y servidor sin necesidad de OpenAPI.
- `revalidatePath`/`revalidateTag` para invalidar el cache de RSC.
- Cookie `access_token` accesible directamente.

**Anatomía:**

```ts
'use server';

export async function actionName(args): Promise<{
    success: boolean;
    data?: T;
    error?: string;
}> {
    try {
        const result = await apiClient.postServer<T>(endpoint, payload);
        revalidatePath('/affected');
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Fallback',
        };
    }
}
```

### 5. API client (`src/lib/api/client.ts`)

Singleton `apiClient` que abstrae `fetch`:
- Lee la cookie `access_token` y la inyecta como `Authorization: Bearer <jwt>` (solo server-side).
- Maneja errores HTTP devolviendo `Error` con mensaje útil.
- Diferencia métodos `*Server` (con `next.revalidate` / `next.tags`) de los que no.
- `postFormData` para subida de archivos (no setea `Content-Type`, lo deja al browser).

### 6. Endpoints (`src/lib/api/endpoints.ts`)

Catálogo central. Todo string del backend vive aquí:

```ts
export const API_ENDPOINTS = {
    AUTH:  { LOGIN: '/auth/login' },
    POSTS: { CREATE: '/posts', GET_PROJECT_DETAILS: (id) => `/posts/${id}`, ... },
    ...
};
```

Esto permite refactorizar URLs en un solo lugar. Ver [api.md](api.md) para el detalle.

### 7. Schemas (`src/lib/schemas/`)

Zod schemas para validación de formularios + tipos `Dto` inferidos:

```ts
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type LoginDto = z.infer<typeof loginSchema>;
```

Se usan con `react-hook-form` + `@hookform/resolvers/zod`.

### 8. Tipos de dominio (`src/features/<dominio>/types/`)

Interfaces TS que reflejan el modelo del backend:

```ts
// features/posts/types/posts.types.ts
export interface Post { id: string; title: string; type: PostType; ... }
```

Convención: una interfaz por entidad principal + tipos auxiliares (enums como `PostStatus`).

> **Nota:** los DTOs de **input** viven en `lib/schemas/` (porque van con su validación Zod). Los modelos de **output** del backend viven en `features/.../types/`.

---

## Autenticación en detalle

### Login

1. `LoginForm` valida con Zod, llama `loginAction(email, password)`.
2. `loginAction` POST `/auth/login` → recibe `{ access_token, user }`.
3. Server setea cookie `access_token` con `{ httpOnly, secure (en prod), sameSite: 'lax', maxAge: 24h }`.
4. Devuelve `{ success: true, user }` (sin token — la cookie es la fuente de verdad).
5. Cliente: `router.push('/dashboard')` + `router.refresh()` para que el RSC tree se rehidrate con el `user` del nuevo `getSessionUser()`.

### Sesión

- En el **root layout** se llama `await getSessionUser()` (server-side).
- El user resultante se pasa al `<AuthProvider user={user}>`.
- Cualquier Client Component lee con `const { user } = useAuth()`.

> Como el root layout es un Server Component, esto se evalúa en cada navegación a una nueva ruta (sin client-side fetch). Tras `router.refresh()` también se re-evalúa.

### Logout

`logoutAction()`:
1. Borra la cookie.
2. `revalidatePath('/', 'layout')` — invalida todo el árbol RSC.
3. `redirect('/login')`.

### Middleware ([src/middleware.ts](../src/middleware.ts))

Solo verifica **presencia** de la cookie, no la valida (la validación real la hace el backend). Esto:
- Evita un fetch contra el backend en cada navegación.
- Si la cookie está presente pero expirada/inválida, el primer request al backend devolverá 401 y la UI mostrará el error.

> **Mejora futura:** middleware podría hacer un round-trip al backend a `/users/me` con cache para detectar tokens expirados antes de llegar a la página.

---

## Cache strategy (Next.js App Router)

| Caso | Estrategia |
|---|---|
| Listados públicos / feed | `getServer(endpoint)` con cache por default. Se revalida con `revalidatePath` al crear/editar. |
| Lista del usuario actual (`my-posts`) | `getServer` con `{ revalidate: false }` (no cache) o cache + tag por user. Actualmente cache por default. |
| Mutaciones | `postServer/patchServer/deleteServer` siempre con `cache: 'no-store'`. |
| Página de detalle | Cache + `revalidatePath` específico al editar/borrar. |

**Patrón recomendado para mutaciones:**

```ts
revalidatePath('/posts/my-posts');
revalidatePath(`/posts/${id}`);
revalidatePath('/dashboard', 'layout');  // cuando afecta el layout/feed global
```

---

## Manejo de errores

### En server actions

Devuelven `{ success: false, error: string }`. **No lanzan**. La UI decide qué hacer.

```ts
const result = await someAction(...);
if (!result.success) {
    toast.error(result.error || 'Mensaje fallback');
    return;
}
```

### En componentes de página

- Si el dato es crítico para renderizar (detalle de post), usa `notFound()` cuando falle.
- Para errores no recuperables, considera `error.tsx` boundaries en cada segmento (no implementados aún — TODO).

### En `apiClient`

Lanza `Error(message)` con el mensaje del backend si está disponible (`errorData.message || errorData.error`), o un fallback genérico.

---

## Estado del cliente

- **Auth:** Context (`AuthProvider`) — read-only, datos inyectados desde el server.
- **Estado de UI local:** `useState` (formularios, toggles, modals).
- **Server state:** No hay React Query/SWR. Las mutaciones disparan `router.refresh()` o `window.location.reload()` para refrescar — ver "Mejoras futuras".
- **Zustand** está instalado pero no se usa todavía.

---

## Mejoras futuras pendientes

Identificadas durante la documentación:

1. **Reemplazar `window.location.reload()`** en `CreatePostDialog` por `router.refresh()` (más rápido, no pierde estado del cliente).
2. **`error.tsx` y `loading.tsx`** en cada segmento del dashboard para aprovechar streaming + error boundaries.
3. **React Query / SWR** o uso intensivo de RSC + Server Actions con `useTransition` + `useOptimistic` para feedback instantáneo en mutaciones.
4. **Middleware más estricto:** validar el token contra el backend (con cache) en lugar de solo presencia.
5. **Tipado fuerte de respuestas del backend:** las páginas todavía usan `useState<any[]>` en algunos lados (`dashboard/page.tsx`, `my-posts/page.tsx`). Migrar a `Post[]`.
6. **Tests:** no hay suite de tests. Recomendado: Vitest + React Testing Library para componentes; Playwright para e2e del flujo auth + crear post + aplicar.
7. **i18n:** la app es 100% español hardcodeado. Si en algún punto se necesita inglés, considerar `next-intl`.
8. **Internacionalización de fechas:** se usa `toLocaleDateString('es-MX')` directamente — bien por ahora, pero centralizable.

---

## Patrones que conviene mantener

- **Una server action = una operación.** No mezclar create + send-email + log en la misma función.
- **`{ success, data?, error? }` siempre** en el retorno.
- **Endpoints en `endpoints.ts`**, nunca hardcodear strings.
- **Tipos en `features/`**, schemas en `lib/schemas/`.
- **Cookie httpOnly como única fuente del token.** Nunca tocar `localStorage` para el JWT.
