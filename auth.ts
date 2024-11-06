import NextAuth from "next-auth"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import { saltAndHashPassword } from "@/utils/helper"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Github({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            authorize: async (credentials) => {
                if (!credentials || !credentials.email || !credentials.password) {
                    return null;
                }
                console.log("In the credential login")
                // const {setUser} = useAppContext()

                const email = credentials.email as string;
                const hash = saltAndHashPassword(credentials.password);
                // console.log("email :",email)
                // console.log("In the credential login before db call")
                let user = await db.user.findUnique({
                    where: {
                        email,
                    }
                });
                console.log("user info: ",user)
                if (!user) {
                    // create the user
                    user = await db.user.create({
                        data: {
                            email,
                            password: hash
                        }
                    });
                }else{
                    
                    // match the password
                    const isMatch = bcrypt.compareSync(
                        credentials.password as string,
                        user.password as string
                    )

                    if(!isMatch){
                        throw new Error("Incorrect Password");
                    }
                }
                console.log("In the credential login after db call")
                console.log(user)

                // setUser(user);
                return user;
  
            }
        })
    ],
})