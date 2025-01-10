import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { UserRole } from "@prisma/client"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.hashedPassword) {
                    throw new Error("No user found with this email")
                }

                const isPasswordValid = await compare(credentials.password, user.hashedPassword)

                if (!isPasswordValid) {
                    throw new Error("Invalid password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
                session.user.role = token.role as UserRole
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
    },
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}

export async function requireAuth(handler: Function, requiredRole?: UserRole) {
    return async (req: Request) => {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 })
        }

        if (requiredRole && session.user.role !== requiredRole) {
            return new Response("Forbidden", { status: 403 })
        }

        return handler(req, session)
    }
}

export function isAdmin(user: { role?: UserRole }) {
    return user?.role === UserRole.ADMIN
}

export function hasRole(user: { role?: UserRole }, requiredRole: UserRole) {
    if (requiredRole === UserRole.ADMIN) return isAdmin(user)
    return user?.role === requiredRole
} 