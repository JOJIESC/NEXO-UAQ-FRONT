# Referencia de API

Endpoints del backend que consume este frontend. La fuente de verdad es [`src/lib/api/endpoints.ts`](../src/lib/api/endpoints.ts) — este documento describe el contrato esperado.

**Base URL:** `https://nexo-uaq-back.vercel.app` (configurable via `NEXT_PUBLIC_API_URL`).

**Auth header:** `Authorization: Bearer <jwt>` en todos los endpoints excepto `LOGIN` y `CREATE_USER`. El JWT se obtiene de `POST /auth/login`.

---

## Auth

### `POST /auth/login`

**Body**
```json
{ "email": "string", "password": "string" }
```

**Response 200**
```json
{
  "access_token": "jwt-string",
  "user": { "id": "...", "name": "...", "lastname": "...", "email": "...", "role": "STUDENT" }
}
```

**Errores comunes:** 401 (credenciales inválidas).

**Server action:** [`loginAction`](../src/app/actions/auth.ts).

---

## Users

### `POST /users` — Crear usuario (signup)

**Body**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "lastname": "string",
  "bio": "string (opcional)"
}
```

**Response 201**
```json
{ "user": { "id": "...", "name": "...", ... } }
```

**Server action:** [`signupAction`](../src/app/actions/auth.ts).

---

### `GET /users/me` — Usuario autenticado

**Response 200**
```json
{
  "id": "string",
  "name": "string",
  "lastname": "string",
  "email": "string",
  "role": "STUDENT" | "ADMIN" | "MODERATOR",
  "bio": "string (opcional)",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

**Errores:** 401 si el JWT está inválido/expirado.

**Server action:** [`getSessionUser`](../src/app/actions/auth.ts).

---

### `GET /users` y `GET /users/:id`

Definidos en `endpoints.ts` pero **no consumidos por el frontend actualmente**. Se asume que devuelven `User[]` y `User` respectivamente.

---

## Posts

Tipo `Post`:
```ts
{
  id: string;
  title: string;
  description: string;
  type: 'PROJECT' | 'WORKSHOP';
  status?: 'OPEN' | 'CLOSED' | 'IN_PROGRESS' | 'COMPLETED';
  authorId?: string;
  author?: { id, name, lastname, email };
  createdAt: string;
  updatedAt?: string;
}
```

### `POST /posts` — Crear post

**Body** (validado con `createPostSchema`):
```json
{
  "title": "string (5-100 chars)",
  "description": "string (10-1000 chars)",
  "type": "PROJECT" | "WORKSHOP"
}
```

**Response 201:** `Post`

**Server action:** [`createPostAction`](../src/app/actions/posts.ts).

---

### `GET /posts` — Listar todos los posts

**Response 200:** `Post[]`

**Cache:** El frontend lo pide con `{ revalidate: false }` (no cache) para tener siempre la versión más reciente.

**Server action:** [`getAllProjectsAction`](../src/app/actions/posts.ts).

---

### `GET /posts/:id` — Detalle de un post

**Response 200:** `Post` (con `author` populado)

**Server action:** [`getProjectDetailsAction`](../src/app/actions/posts.ts).

---

### `GET /posts/my-posts` — Posts del usuario autenticado

**Response 200:** `Post[]`

**Server action:** [`getMyProjectsAction`](../src/app/actions/posts.ts).

---

### `PATCH /posts/:id` — Actualizar post

**Body** (validado con `updatePostSchema` — todos opcionales):
```json
{
  "title": "string?",
  "description": "string?",
  "type": "PROJECT" | "WORKSHOP" (opcional)
}
```

**Response 200:** `Post`

**Server action:** [`updatePostAction`](../src/app/actions/posts.ts).

---

### `DELETE /posts/:id` — Eliminar post

**Response 200/204**

**Server action:** [`deletePostAction`](../src/app/actions/posts.ts).

---

## Applications

Tipo `Application`:
```ts
{
  id: string;
  postId: string;
  applicantId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  applicant?: User;
  createdAt?: string;
  updatedAt?: string;
}
```

### `POST /applications/:postId` — Aplicar a un post

**Body**
```json
{ "message": "string (opcional)" }
```

**Response 201:** `Application`

**Server action:** [`applyToProjectAction`](../src/app/actions/applications.ts).

---

### `GET /applications/post/:postId` — Listar candidatos de un post

Solo el dueño del post debería poder ejecutar este request (validación en backend).

**Response 200:** `Application[]` (con `applicant` populado)

**Server action:** [`getProjectCandidatesAction`](../src/app/actions/applications.ts).

---

### `PATCH /applications/:id/accept` — Aceptar aplicación

**Body:** `{}` (vacío)

**Response 200**

**Server actions:**
- [`updateApplicationStatusAction(id, 'accept', postId)`](../src/app/actions/applications.ts) — una sola.
- [`acceptBulkApplicationsAction(ids[], postId)`](../src/app/actions/applications.ts) — varias en paralelo.

---

### `PATCH /applications/:id/reject` — Rechazar aplicación

**Body:** `{}`

**Response 200**

**Server action:** [`updateApplicationStatusAction(id, 'reject', postId)`](../src/app/actions/applications.ts).

---

## Convenciones del backend asumidas

- Errores devuelven `{ message: string }` o `{ error: string }`. `apiClient` los extrae.
- Todas las respuestas son JSON (`Content-Type: application/json`).
- Status `204` (no content) se trata como respuesta vacía.
- Las fechas vienen como ISO 8601 strings (`createdAt`, `updatedAt`).

## Cómo añadir un nuevo endpoint

1. Añade la entrada en [`src/lib/api/endpoints.ts`](../src/lib/api/endpoints.ts) bajo el dominio correspondiente.
2. Define el tipo de respuesta en `src/features/<dominio>/types/`.
3. Añade el schema Zod si es input de formulario en `src/lib/schemas/`.
4. Crea/extiende la server action en `src/app/actions/<dominio>.ts` siguiendo el patrón `{ success, data?, error? }`.
5. Documenta el endpoint en este archivo.
