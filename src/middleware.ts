import { NextRequest, NextResponse } from "next/server";
import { isAuth } from "@/actions/auth";

// Define protected and open routes
const protectedRoutes = ["/dashboard"];
const closedRoutes = ["/login"];
const openRoutes = ["/search-books"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );

    // Check if the route is public
    const isPublicRoute = openRoutes.some((route) => path.startsWith(route));
    
    // Check if the route is closed
    const isCloedRoute = closedRoutes.some((route) => path.startsWith(route));

    try {
        // Check if the user is authenticated
        const authenticated = await isAuth(request);
        console.log("Authenticated:", authenticated);
        console.log("isProtectedRoute:", isProtectedRoute);
        console.log("isPublicRoute:", isPublicRoute);
        console.log("isCloedRoute:", isCloedRoute);

        if(isPublicRoute){
            return NextResponse.next();
        }

        // Redirect to dashboard if accessing closed route while authenticated
        if (isCloedRoute && authenticated) {
            return NextResponse.redirect(new URL("/dashboard/my-profile", request.url));
        }

        // Redirect to login if accessing a protected route while not authenticated
        if (isProtectedRoute && !authenticated) {
            const loginUrl = new URL("/login", request.url);
            console.log("Login URL:", loginUrl);
            loginUrl.searchParams.set("from", path); // Optional: Add a redirect param
            
            const response = NextResponse.redirect(loginUrl);
            response.cookies.set('auth_token', '', {
                maxAge: -1,
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            // Add header for clearing local storage
            response.headers.set('x-clear-local-storage', 'true');

            return response;
        }

        // Redirect to dashboard if accessing login while authenticated
        if (isPublicRoute && authenticated) {
            return NextResponse.next();
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/middleware", "/login"],
};
