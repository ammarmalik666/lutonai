"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, Text, Button, TextInput, Textarea, Select, SelectItem, NumberInput } from "@tremor/react"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/animations"
import { toast } from "sonner"

interface ValidationError {
    path: string
    message: string
}

const EVENT_TYPES = [
    { value: "IN_PERSON", label: "In Person" },
    { value: "ONLINE", label: "Online" },
    { value: "HYBRID", label: "Hybrid" },
]

const EVENT_STATUS = [
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "CANCELLED", label: "Cancelled" },
]

export default function NewEventPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        endDate: "",
        location: "",
        image: "",
        capacity: "",
        type: "IN_PERSON",
        venue: "",
        address: "",
        city: "",
        country: "",
        organizer: "",
        contactEmail: "",
        contactPhone: "",
        registrationDeadline: "",
        price: "",
        category: "",
        tags: "",
        status: "DRAFT",
        isPublic: true,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            // Format the data
            const formattedData = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
                capacity: formData.capacity ? parseInt(formData.capacity) : null,
                price: formData.price ? parseFloat(formData.price) : null,
                image: formData.image || null,
            }

            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error?.code === "VALIDATION_ERROR" && data.error?.details) {
                    const validationErrors = data.error.details as ValidationError[]
                    const errorMap = validationErrors.reduce((acc, error) => ({
                        ...acc,
                        [error.path]: error.message
                    }), {})
                    setErrors(errorMap)
                    throw new Error("Please fix the validation errors")
                }
                throw new Error(data.error?.message || "Failed to create event")
            }

            toast.success("Event created successfully")
            router.push("/admin/events")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create event")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
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
                <h1 className="text-4xl font-bold text-white mb-2">Create New Event</h1>
                <p className="text-gray-400 mb-8">
                    Fill in the details below to create a new event.
                </p>

                <Card className="bg-gradient-to-r from-[#0B0F17] to-[#0B0F17] border-r-2 border-r-red-500/20 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Title *
                                </label>
                                <TextInput
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter event title"
                                    required
                                    error={!!errors.title}
                                    errorMessage={errors.title}
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
                                    placeholder="Enter event description"
                                    required
                                    rows={4}
                                    error={!!errors.description}
                                    errorMessage={errors.description}
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        name="date"
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        End Date & Time
                                    </label>
                                    <input
                                        name="endDate"
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                    />
                                    {errors.endDate && (
                                        <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Event Type and Status */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Event Type and Status</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Event Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                    >
                                        {EVENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                    >
                                        {EVENT_STATUS.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Location Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Venue
                                </label>
                                <TextInput
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue name"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Address
                                </label>
                                <TextInput
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter street address"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        City
                                    </label>
                                    <TextInput
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Country
                                    </label>
                                    <TextInput
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Organizer
                                    </label>
                                    <TextInput
                                        name="organizer"
                                        value={formData.organizer}
                                        onChange={handleChange}
                                        placeholder="Enter organizer name"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Contact Email
                                    </label>
                                    <TextInput
                                        name="contactEmail"
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        placeholder="Enter contact email"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Contact Phone
                                </label>
                                <TextInput
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    placeholder="Enter contact phone number"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Additional Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Capacity
                                    </label>
                                    <TextInput
                                        name="capacity"
                                        type="number"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        placeholder="Enter maximum capacity"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-1">
                                        Price
                                    </label>
                                    <TextInput
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter ticket price"
                                        className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Registration Deadline
                                </label>
                                <input
                                    name="registrationDeadline"
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="w-full bg-white text-gray-900 rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Image URL
                                </label>
                                <TextInput
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Enter image URL"
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isPublic: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-500"
                                />
                                <label className="text-sm font-medium text-white">
                                    Make this event public
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                {isLoading ? "Creating Event..." : "Create Event"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 