# CLAUDE.md

Context for Claude Code working on this repository. Keep concise — derive everything else from the code itself or from `docs/`.

## What this is

**NEXO UAQ frontend.** A Next.js 16 App Router app where UAQ students post projects/workshops (`Post`) and other students apply (`Application`). The post owner accepts/rejects applicants.

Backend lives separately at `https://nexo-uaq-back.vercel.app` (REST). This repo is **only** the frontend.

## Stack quick-ref

- Next.js 16 (App Router) · React 19 · TypeScript strict
- TailwindCSS v4 · shadcn/ui (Radix) · lucide-react
- react-hook-form + zod · sonner · @tanstack/react-table
- zustand installed but barely used
- npm (lockfile is npm)

## Architecture rules (don't break these)

1. **All backend calls go through Server Actions** in `src/app/actions/`. Client Components never call `fetch` to the API directly.
2. **Auth token = httpOnly cookie only.** Never write to `localStorage` or non-httpOnly cookies for the JWT. The cookie is set in `loginAction` and read by `apiClient.getAuthToken()` server-side.
3. **Server Actions return `{ success, data?, error? }`** — they don't throw. Components branch on `result.success`.
4. **Endpoint strings live in `src/lib/api/endpoints.ts`.** Don't hardcode URLs.
5. **Domain types in `src/features/<domain>/types/`.** Input DTOs (with Zod schemas) in `src/lib/schemas/`.
6. **Path alias:** `@/*` → `src/*`. Use it; don't write relative imports across `src/`.

## Key files

| Concern | Path |
|---|---|
| API client | `src/lib/api/client.ts` |
| Endpoint catalog | `src/lib/api/endpoints.ts` |
| Auth actions | `src/app/actions/auth.ts` |
| Posts actions | `src/app/actions/posts.ts` |
| Applications actions | `src/app/actions/applications.ts` |
| Route protection | `src/middleware.ts` |
| Auth context | `src/providers/AuthProvider.tsx` (consumed via `useAuth()`) |
| Sidebar items | `src/lib/navigation.ts` |
| Root layout (sets up AuthProvider) | `src/app/layout.tsx` |
| Dashboard layout (sidebar shell) | `src/app/(dashboard)/layout.tsx` |

## Route groups

- `src/app/(auth)/` — public (login, signup), no sidebar.
- `src/app/(dashboard)/` — protected (cookie required), wrapped in `AppSidebar`.

Middleware redirects `/dashboard|/posts/my-posts|/posts/create|/account` → `/login` if no cookie, and `/login|/signup` → `/dashboard` if cookie exists.

## Domain model

```
User      { id, name, lastname, email, role: STUDENT|ADMIN|MODERATOR, bio? }
Post      { id, title, description, type: PROJECT|WORKSHOP, status?, author?, createdAt, ... }
Application { id, postId, applicantId, status: PENDING|ACCEPTED|REJECTED, applicant?, message?, ... }
```

## Common gotchas

- The legacy `src/proxy.ts` was renamed to `src/middleware.ts` — Next.js needs that exact name to actually run it.
- `eslint-config-next` was previously pinned to `^0.2.4` (broken). It's now `^16.1.6`. Don't downgrade it.
- `NEXT_PUBLIC_API_URL` is the env var (was `NEXT_PUBLIC_APP_URL`). Update local `.env.local` if you find the old name.
- Some pages still type fetched data as `any[]` (e.g. `dashboard/page.tsx`, `my-posts/page.tsx`). Migrating those to `Post[]` is a known TODO.
- `CreatePostDialog` does `window.location.reload()` after creating — better is `router.refresh()` (TODO).
- No tests exist yet. If asked to add features, mention this.

## When adding a feature

1. Backend endpoint → add to `endpoints.ts`.
2. Response type → `src/features/<domain>/types/`.
3. Input validation → Zod schema in `src/lib/schemas/`.
4. Server action in `src/app/actions/<domain>.ts` returning `{ success, data?, error? }`.
5. Mutation? → call `revalidatePath()` for affected routes.
6. UI → Client Component calling the action; use `toast.loading()` → `toast.success/error({ id })` for async feedback.
7. Add to `docs/api.md` if it's a new backend endpoint.

## What to avoid

- Don't reintroduce `localStorage` / non-httpOnly cookies for auth.
- Don't add `fetch()` to the backend in Client Components.
- Don't hardcode URLs.
- Don't bypass `apiClient` in server actions — it handles auth + error parsing uniformly.
- Don't add routes outside the `(auth)` / `(dashboard)` route groups without thinking about the sidebar/protection model.

## See also

- [README.md](README.md) — setup, scripts, structure overview.
- [docs/architecture.md](docs/architecture.md) — deeper dive on layers, cache strategy, auth flow.
- [docs/api.md](docs/api.md) — backend endpoint reference.
