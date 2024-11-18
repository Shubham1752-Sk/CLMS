// next.d.ts or src/types/next.d.ts
import { NextRequest } from 'next/server';

declare module 'next/server' {
    interface NextRequest {
        user?: { userId: string; name: string, accountType: string, iat: string, exp: string };  // Customize this to match the shape of your JWT payload
    }
}
