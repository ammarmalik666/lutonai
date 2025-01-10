"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, Title, Text, TextInput, Textarea, Button, Select, SelectItem } from "@tremor/react"
import { toast } from "sonner"
import { fadeIn } from "@/lib/animations"

interface SponsorFormData {
    name: string
    description: string
    logo: string
    website: string
    email: string
    phone: string
    level: string
    isActive: boolean
}

const SPONSOR_LEVELS = [
    "PLATINUM",
    "GOLD",
    "SILVER",
    "BRONZE",
    "PARTNER"
]

const defaultFormData: SponsorFormData = {
    name: "",
    description: "",
    logo: "",
    website: "",
    email: "",
    phone: "",
    level: "",
    isActive: true,
}

export default function CreateSponsorPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<SponsorFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            const response = await fetch("/api/sponsors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to create sponsor")
            }

            toast.success("Sponsor created successfully")
            router.push("/admin/sponsors")
        } catch (error) {
            console.error("Error creating sponsor:", error)
            toast.error(error instanceof Error ? error.message : "Failed to create sponsor")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    return (
        <motion.div
            className="min-h-screen bg-[#0B0F17] p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Create New Sponsor</h1>
                <p className="text-gray-400 mb-8">
                    Fill in the details below to create a new sponsor.
                </p>

                <Card className="bg-gradient-to-r from-[#0B0F17] to-[#0B0F17] border-r-2 border-r-red-500/20 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Name *
                                </label>
                                <TextInput
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter sponsor name"
                                    required
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Description *
                                </label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter sponsor description"
                                    required
                                    rows={4}
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Email *
                                    </label>
                                    <TextInput
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter contact email"
                                        required
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Phone
                                    </label>
                                    <TextInput
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter contact phone"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Website
                                </label>
                                <TextInput
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Enter website URL"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Additional Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Logo URL
                                </label>
                                <TextInput
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="Enter logo URL"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Sponsorship Level
                                </label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                >
                                    <option value="">Select level</option>
                                    {SPONSOR_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-500"
                                />
                                <label className="text-sm font-medium text-white">
                                    Active sponsor
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                {isLoading ? "Creating Sponsor..." : "Create Sponsor"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 