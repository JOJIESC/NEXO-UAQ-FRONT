import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;

    // Rutas protegidas
    const protectedPaths = ['/dashboard', '/posts/create', '/posts/my-posts', '/account'];
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si está autenticado y trata de ir a login/register, redirigir a dashboard
    const authPaths = ['/login', '/register'];
    const isAuthPath = authPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/posts/create',
        '/posts/my-posts',
        '/account',
        '/login',
        '/register',
    ],
};