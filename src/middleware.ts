// export { auth as middleware } from "@/auth"

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

const protectedRoutes = ["/middleware", "/dashboard/my-profile"]
const openRoutes = ["/login"]

export default async function middleware(request: NextRequest){
    
    console.log("In the middleware")
    
    const session = await auth();

    const isProtected = protectedRoutes.some((route)=>
        request.nextUrl.pathname.startsWith(route)
    );
    
    const isPublic = openRoutes.some((route)=>{
        request.nextUrl.pathname.startsWith(route)
    })

    if(!session &&  isProtected) {
        // Redirect to login page if not authenticated
        const absoluteURL = new URL("/login", request.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    if(session && isPublic){
        const absoluteURL = new URL("/");
        return NextResponse.redirect(absoluteURL)
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/middleware",
        "/server"
    ],
  }