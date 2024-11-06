"use server"

import { signIn, signOut } from "@/auth"
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { AuthError } from "next-auth";

export const login = async (provider: string) => {
    await signIn(provider, {redirectTo: "/"});
    revalidatePath("/");
}

export const logout = async () =>{
    await signOut({redirectTo: '/'});
    revalidatePath("/");
}

export const loginWithCreds = async ({email, password}:{
    email: string,
    password: string
}) =>{
    try {
        await signIn("credentials", { email, password, redirectTo: "/" });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: 'Invalid credentials',
                    }
                default:
                    return {
                        message: 'Something went wrong.',
                    }
            }
        }
        throw error;
    }
    revalidatePath("/");
}