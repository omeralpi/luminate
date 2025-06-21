import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionCookie = request.cookies.get('luminate_session_id');

    let isAuthenticated = false;

    if (sessionCookie) {
        try {
            // Simple session validation without lucia
            // You can implement your own session validation logic here
            // For now, we'll just check if the cookie exists and has a value
            isAuthenticated = !!sessionCookie.value;
        } catch {
            isAuthenticated = false;
        }
    }

    if (isAuthenticated && pathname === '/') {
        return NextResponse.redirect(new URL('/explore', request.url));
    }

    if (!isAuthenticated && pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};