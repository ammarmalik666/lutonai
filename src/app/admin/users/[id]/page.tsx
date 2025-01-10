"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, TextInput, Button, Select, SelectItem } from "@tremor/react"

interface UserFormData {
    name: string | null
    email: string | null
    role: string
}

const defaultFormData: UserFormData = {
    name: "",
    email: "",
    role: "USER",
}

const userRoles = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
]

async function getUser(id: string) {
    const res = await fetch(`/api/users/${id}`)
    if (!res.ok) {
        throw new Error("Failed to fetch user")
    }
    return res.json()
}

async function saveUser(data: UserFormData, id: string) {
    const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error("Failed to save user")
    }
    return res.json()
}

export default function UserEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [formData, setFormData] = useState<UserFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUser(params.id)
            .then((data) => {
                setFormData(data)
            })
            .catch((error) => {
                console.error("Error fetching user:", error)
            })
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await saveUser(formData, params.id)
            router.push("/admin/users")
        } catch (error) {
            console.error("Error saving user:", error)
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit User</h1>
                <p className="mt-2 text-muted-foreground">
                    Update user details and permissions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Enter user name"
                            value={formData.name || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <TextInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter user email"
                            value={formData.email || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="role"
                            className="text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>
                        <Select
                            id="role"
                            name="role"
                            value={formData.role}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, role: value }))
                            }
                            required
                        >
                            {userRoles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/admin/users")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isLoading}
                        className="bg-brand-600 hover:bg-brand-700"
                    >
                        Update User
                    </Button>
                </div>
            </form>
        </div>
    )
} 