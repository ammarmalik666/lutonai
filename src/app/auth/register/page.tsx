'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, Title, Text, TextInput, Button } from "@tremor/react"
import { toast } from "sonner"

export default function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    })
    const router = useRouter()

    const validateForm = (name: string, email: string, password: string) => {
        const newErrors = {
            name: '',
            email: '',
            password: ''
        }
        let isValid = true

        // Name validation
        if (name.length < 2 || name.length > 50) {
            newErrors.name = 'Name must be between 2 and 50 characters'
            isValid = false
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please provide a valid email address'
            isValid = false
        }

        // Password validation
        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        // Client-side validation
        if (!validateForm(name, email, password)) {
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            toast.success("Registration successful! Please sign in.")
            // Add a small delay before redirecting to ensure the toast message is visible
            setTimeout(() => {
                router.push("/auth/signin")
            }, 1500)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
            <div className="max-w-md mx-auto">
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <Title className="text-3xl font-bold text-white mb-2">Create Admin Account</Title>
                    <Text className="text-gray-400 mb-6">
                        Enter your details to register as an admin.
                    </Text>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <TextInput
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <TextInput
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <TextInput
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-brand-600 text-white hover:bg-brand-700"
                            loading={isLoading}
                        >
                            {isLoading ? "Creating admin account..." : "Register as Admin"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="text-brand-600 hover:text-brand-500"
                        >
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
} 