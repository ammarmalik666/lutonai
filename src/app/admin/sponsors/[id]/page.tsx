"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, Title, Text, TextInput, Textarea, Button, Select, SelectItem } from "@tremor/react"
import { toast } from "sonner"
import { fadeIn } from "@/lib/animations"

interface SponsorFormData {
    name: string
    description: string
    website?: string
    logo?: string
    tier: string
    startDate: string
    endDate?: string
    isActive: boolean
    contactName?: string
    contactEmail?: string
    contactPhone?: string
}

const defaultFormData: SponsorFormData = {
    name: "",
    description: "",
    website: "",
    logo: "",
    tier: "",
    startDate: "",
    endDate: "",
    isActive: true,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
}

const SPONSOR_TIERS = [
    { value: "PLATINUM", label: "Platinum" },
    { value: "GOLD", label: "Gold" },
    { value: "SILVER", label: "Silver" },
    { value: "BRONZE", label: "Bronze" },
]

export default function EditSponsorPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [formData, setFormData] = useState<SponsorFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchSponsor()
    }, [params.id])

    const fetchSponsor = async () => {
        try {
            const response = await fetch(`/api/sponsors/${params.id}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to fetch sponsor")
            }

            // Format dates for input fields
            const sponsor = data.data
            setFormData({
                ...sponsor,
                startDate: new Date(sponsor.startDate).toISOString().split('T')[0],
                endDate: sponsor.endDate ? new Date(sponsor.endDate).toISOString().split('T')[0] : "",
            })
        } catch (error) {
            console.error("Error fetching sponsor:", error)
            toast.error(error instanceof Error ? error.message : "Failed to fetch sponsor")
            router.push("/admin/sponsors")
        } finally {
            setIsFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            const response = await fetch(`/api/sponsors/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to update sponsor")
            }

            toast.success("Sponsor updated successfully")
            router.push("/admin/sponsors")
        } catch (error) {
            console.error("Error updating sponsor:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update sponsor")
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

    if (isFetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
                        <div className="h-4 w-96 bg-gray-800 rounded mb-8"></div>
                        <div className="h-[600px] bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="max-w-4xl mx-auto">
                <Title className="text-4xl font-bold text-white mb-4">Edit Sponsor</Title>
                <Text className="text-xl text-gray-400 mb-8">
                    Update sponsor information.
                </Text>

                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Basic Information</Title>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                    Name *
                                </label>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter sponsor name"
                                    required
                                    error={!!errors.name}
                                    errorMessage={errors.name}
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                                    Description *
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter sponsor description"
                                    required
                                    rows={4}
                                    error={!!errors.description}
                                    errorMessage={errors.description}
                                />
                            </div>

                            <div>
                                <label htmlFor="tier" className="block text-sm font-medium text-gray-400 mb-2">
                                    Tier *
                                </label>
                                <Select
                                    id="tier"
                                    name="tier"
                                    value={formData.tier}
                                    onValueChange={(value) => handleChange({ target: { name: 'tier', value } } as any)}
                                    required
                                >
                                    <SelectItem value="">Select a tier</SelectItem>
                                    {SPONSOR_TIERS.map((tier) => (
                                        <SelectItem key={tier.value} value={tier.value}>
                                            {tier.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Media</Title>

                            <div>
                                <label htmlFor="logo" className="block text-sm font-medium text-gray-400 mb-2">
                                    Logo URL
                                </label>
                                <TextInput
                                    id="logo"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="Enter logo URL"
                                    error={!!errors.logo}
                                    errorMessage={errors.logo}
                                />
                                {formData.logo && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.logo}
                                            alt="Logo preview"
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-2">
                                    Website
                                </label>
                                <TextInput
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Enter website URL"
                                    error={!!errors.website}
                                    errorMessage={errors.website}
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Sponsorship Period</Title>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Contact Information</Title>

                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-400 mb-2">
                                    Contact Name
                                </label>
                                <TextInput
                                    id="contactName"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    placeholder="Enter contact name"
                                    error={!!errors.contactName}
                                    errorMessage={errors.contactName}
                                />
                            </div>

                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-400 mb-2">
                                    Contact Email
                                </label>
                                <TextInput
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    placeholder="Enter contact email"
                                    error={!!errors.contactEmail}
                                    errorMessage={errors.contactEmail}
                                />
                            </div>

                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-400 mb-2">
                                    Contact Phone
                                </label>
                                <TextInput
                                    id="contactPhone"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    placeholder="Enter contact phone"
                                    error={!!errors.contactPhone}
                                    errorMessage={errors.contactPhone}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Status</Title>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                                    Active sponsor
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/admin/sponsors")}
                                disabled={isLoading}
                                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={isLoading}
                                className="bg-brand-600 text-gray-100 hover:bg-brand-700"
                            >
                                Update Sponsor
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 