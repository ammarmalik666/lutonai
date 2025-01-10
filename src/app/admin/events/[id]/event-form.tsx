"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, Text, Button, TextInput, Textarea, Select, SelectItem } from "@tremor/react"
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

interface EventFormProps {
    id: string
}

export default function EventForm({ id }: EventFormProps) {
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
    const isEditing = id !== "new"

    useEffect(() => {
        if (isEditing) {
            fetch(`/api/events/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        ...data,
                        date: data.date ? new Date(data.date).toISOString().slice(0, 16) : "",
                        endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : "",
                        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().slice(0, 16) : "",
                        capacity: data.capacity?.toString() || "",
                        price: data.price?.toString() || "",
                    })
                })
                .catch(error => {
                    console.error("Failed to fetch event:", error)
                    toast.error("Failed to fetch event details")
                    router.push("/admin/events")
                })
        }
    }, [id, isEditing, router])

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

            const response = await fetch(`/api/events${isEditing ? `/${id}` : ""}`, {
                method: isEditing ? "PUT" : "POST",
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
                throw new Error(data.error?.message || `Failed to ${isEditing ? "update" : "create"} event`)
            }

            toast.success(`Event ${isEditing ? "updated" : "created"} successfully`)
            router.push("/admin/events")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? "update" : "create"} event`)
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
            className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="max-w-4xl mx-auto">
                <Title className="text-4xl font-bold text-white mb-4">{isEditing ? "Edit Event" : "Create New Event"}</Title>
                <Text className="text-xl text-gray-400 mb-8">
                    {isEditing ? "Update the event details below." : "Fill in the details below to create a new event."}
                </Text>

                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Basic Information</Title>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                                    Title *
                                </label>
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter event title"
                                    required
                                    error={!!errors.title}
                                    errorMessage={errors.title}
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
                                    placeholder="Enter event description"
                                    required
                                    rows={4}
                                    error={!!errors.description}
                                    errorMessage={errors.description}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-2">
                                        Start Date & Time *
                                    </label>
                                    <input
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className={`w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200 ${errors.date ? "border-red-500" : ""}`}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-2">
                                        End Date & Time
                                    </label>
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className={`w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200 ${errors.endDate ? "border-red-500" : ""}`}
                                    />
                                    {errors.endDate && (
                                        <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Event Type and Status */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Event Type and Status</Title>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-2">
                                        Event Type *
                                    </label>
                                    <Select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onValueChange={(value) => handleChange({ target: { name: 'type', value } } as any)}
                                        required
                                    >
                                        {EVENT_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                                        Status *
                                    </label>
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onValueChange={(value) => handleChange({ target: { name: 'status', value } } as any)}
                                        required
                                    >
                                        {EVENT_STATUS.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Location Details</Title>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="venue" className="block text-sm font-medium text-gray-400 mb-2">
                                        Venue Name
                                    </label>
                                    <TextInput
                                        id="venue"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        placeholder="Enter venue name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-2">
                                        Location *
                                    </label>
                                    <TextInput
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter location"
                                        required
                                        error={!!errors.location}
                                        errorMessage={errors.location}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">
                                    Address
                                </label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter full address"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                                        City
                                    </label>
                                    <TextInput
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-2">
                                        Country
                                    </label>
                                    <TextInput
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Contact Information</Title>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-400 mb-2">
                                        Organizer Name
                                    </label>
                                    <TextInput
                                        id="organizer"
                                        name="organizer"
                                        value={formData.organizer}
                                        onChange={handleChange}
                                        placeholder="Enter organizer name"
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
                                    />
                                </div>
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
                                    placeholder="Enter contact phone number"
                                />
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Event Details</Title>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-400 mb-2">
                                        Capacity
                                    </label>
                                    <TextInput
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        placeholder="Enter maximum capacity"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-2">
                                        Price
                                    </label>
                                    <TextInput
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter ticket price"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-400 mb-2">
                                    Registration Deadline
                                </label>
                                <input
                                    id="registrationDeadline"
                                    name="registrationDeadline"
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">
                                        Category
                                    </label>
                                    <TextInput
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Enter event category"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">
                                        Tags
                                    </label>
                                    <TextInput
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="Enter tags (comma-separated)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-400 mb-2">
                                Image URL
                            </label>
                            <TextInput
                                id="image"
                                name="image"
                                type="url"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                                error={!!errors.image}
                                errorMessage={errors.image}
                            />
                        </div>

                        {/* Visibility */}
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                                    className="rounded border-gray-700 text-brand-600 focus:ring-brand-500"
                                />
                                <span className="text-sm text-gray-400">Make this event public</span>
                            </label>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isEditing ? "Update Event" : "Create Event"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 