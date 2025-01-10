"use client"

import { useSearchParams } from "next/navigation"
import { Card, Title, Text, Button } from "@tremor/react"

export default function AuthErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    let errorMessage = "An error occurred during authentication"
    if (error === "CredentialsSignin") {
        errorMessage = "Invalid email or password"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
            <div className="max-w-md mx-auto">
                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <Title className="text-3xl font-bold text-red-500 mb-2">
                        Authentication Error
                    </Title>
                    <Text className="text-gray-400 mb-6">{errorMessage}</Text>
                    <Button
                        onClick={() => window.location.href = "/auth/signin"}
                        className="w-full bg-brand-600 text-white hover:bg-brand-700"
                    >
                        Try Again
                    </Button>
                </Card>
            </div>
        </div>
    )
} 