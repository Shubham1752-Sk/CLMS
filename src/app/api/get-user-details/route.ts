// app/api/user/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db"; // Your database connection

export async function GET(request: NextRequest) {
    try {
        console.log("in get user details");
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');
        // console.log("token: ", token);
        if (!token) {
            // console.log("logout");
            // await logout();
            return NextResponse.json(
                { error: 'No authorization token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );

        const payload = verified.payload;
        const userId = payload.userId as string;

        // Fetch user details from database
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                batchId: true,
                departmentId: true,
                image: true,
                // Add other fields you want to return
                // Exclude sensitive fields like password
            }
        });

        // console.log("user: ", user);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {success: true,user},
            {status: 200 }
        );

    } catch (error) {
        console.error('Error in /api/user/me:', error);
        return NextResponse.json(
            { success: false, message: 'Invalid token or server error' },
            { status: 401 }
        );
    }
}