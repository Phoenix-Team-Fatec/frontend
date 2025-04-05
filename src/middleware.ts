import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isProtectedRoute = [
        "/dashboard",
        "/tasks",
        "/settings"
    ].some(route => path.startsWith(route))

    const userData = request.cookies.get("userData")?.value;
    const isAuthenticated = !!userData

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
      '/((?!api|_next/static|_next/image|favicon.ico|sign.png|.*\\.svg).*)',
    ],
  };