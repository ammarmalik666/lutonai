"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, Title, Text, TextInput, Button } from "@tremor/react"
import { toast } from "sonner"
import Link from "next/link"

export default function SignInPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                toast.error(result.error)
                setIsLoading(false)
                return
            }

            if (result?.ok) {
                toast.success("Logged in successfully!")
                // Add a small delay before redirecting
                setTimeout(() => {
                    router.push("/admin/dashboard")
                    router.refresh()
                }, 1000)
            }
        } catch (error) {
            toast.error("An error occurred while signing in")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
            <div className="max-w-md mx-auto">
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <Title className="text-3xl font-bold text-white mb-2">Admin Sign In</Title>
                    <Text className="text-gray-400 mb-6">
                        Enter your credentials to access the admin dashboard.
                    </Text>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <TextInput
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-brand-600 text-white hover:bg-brand-700"
                            loading={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-brand-600 hover:text-brand-500"
                        >
                            Register
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
} 