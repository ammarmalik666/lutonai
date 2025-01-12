import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import Admin from "@/models/User"

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password")
                }

                await dbConnect()

                const admin = await Admin.findOne({ email: credentials.email })

                if (!admin) {
                    throw new Error("No admin found with this email")
                }

                const isPasswordMatch = await bcrypt.compare(
                    credentials.password,
                    admin.password
                )

                if (!isPasswordMatch) {
                    throw new Error("Invalid password")
                }

                return {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
})

export { handler as GET, handler as POST } 