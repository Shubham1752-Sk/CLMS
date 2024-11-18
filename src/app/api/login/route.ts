import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/db"; // Update with your database import

export async function POST(req: NextRequest) {

    console.log(" in the login route");

    try {

        if (!req.body) {
            return NextResponse.json(
              { message: "Missing req body" },
              { status: 400 }
            );
          }
      
          // Parse the req body
          const { email, password } = await req.json();
      
          // Validate input
          if (!email || !password) {
            return NextResponse.json(
              { message: "Email and password are required" },
              { status: 400 }
            );
          }

        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found!",
                },
                { status: 404 }
            );
        }

        // console.log("user: ", user);

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Incorrect password!",
                },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, accountType: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // remove the user password from the response
        delete user.password;
        // console.log("user: ", user);

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                redirectTo: '/dashboard/my-profile',
                token,
                user,
            },
            { status: 200 }
        );

        // Set the cookie
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}
