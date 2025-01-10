import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "ADMIN" | "USER"
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        role: "ADMIN" | "USER"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "USER"
        id?: string
    }
} 