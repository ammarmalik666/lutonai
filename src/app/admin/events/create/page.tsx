"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

// Validation schema
const createEventSchema = z.object({
    title: z.string()
        .min(1, "Title is required"),
    thumbnail: z.custom<FileList>()
        .refine((files) => files?.length === 1, "Thumbnail is required")
        .refine(
            (files) => files?.[0]?.size <= 2 * 1024 * 1024,
            "Thumbnail must be less than 2MB"
        )
        .refine(
            (files) => 
                ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
    description: z.string()
        .min(1, "Description is required"),
    startDateTime: z.string()
        .min(1, "Start date and time is required"),
    endDateTime: z.string()
        .min(1, "End date and time is required"),
    eventType: z.enum([
        "Artificial Intelligence",
        "Business",
        "Data Science",
        "Machine Learning",
        "Other"
    ], {
        required_error: "Event type is required"
    }),
    venue: z.string()
        .min(1, "Venue is required"),
    address: z.string()
        .min(1, "Address is required"),
    city: z.string()
        .min(1, "City is required"),
    country: z.string()
        .min(1, "Country is required"),
    organizers: z.string()
        .min(1, "Organizers is required"),
    contactEmail: z.string()
        .email("Invalid email address")
        .min(1, "Contact email is required"),
    contactPhone: z.string()
        .min(1, "Contact phone is required"),
    capacity: z.string()
        .min(1, "Capacity is required")
        .transform(Number)
        .refine((n) => !isNaN(n), "Must be a valid number"),
    price: z.string()
        .min(1, "Price is required")
        .transform(Number)
        .refine((n) => !isNaN(n), "Must be a valid number"),
    registrationDeadline: z.string()
        .min(1, "Registration deadline is required"),
})

type CreateEventForm = z.infer<typeof createEventSchema>

export default function CreateEvent() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateEventForm>({
        resolver: zodResolver(createEventSchema),
    })

    const onSubmit = async (data: CreateEventForm) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key === "thumbnail") {
                    formData.append("thumbnail", data.thumbnail[0])
                } else {
                    formData.append(key, data[key as keyof CreateEventForm].toString())
                }
            })

            const response = await fetch("/api/events", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to create event")
            console.log(response)
            // toast.success("Event created successfully!")
            // router.push("/admin/events")
        } catch (error) {
            toast.error("Error creating event")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Event</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Title */}
                <div>
                    <label className="block text-white mb-2">Event Title</label>
                    <input
                        {...register("title")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter event title"
                    />
                    {errors.title && (
                        <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-white mb-2">Thumbnail</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register("thumbnail")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    />
                    {errors.thumbnail && (
                        <p className="text-red-500 mt-1">{errors.thumbnail.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                        {...register("description")}
                        rows={5}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter event description"
                    />
                    {errors.description && (
                        <p className="text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white mb-2">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("startDateTime")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        />
                        {errors.startDateTime && (
                            <p className="text-red-500 mt-1">{errors.startDateTime.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-white mb-2">End Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register("endDateTime")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        />
                        {errors.endDateTime && (
                            <p className="text-red-500 mt-1">{errors.endDateTime.message}</p>
                        )}
                    </div>
                </div>

                {/* Event Type */}
                <div>
                    <label className="block text-white mb-2">Event Type</label>
                    <select
                        {...register("eventType")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    >
                        <option value="">Select event type</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Business">Business</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.eventType && (
                        <p className="text-red-500 mt-1">{errors.eventType.message}</p>
                    )}
                </div>

                {/* Location Details */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Location Details</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Venue</label>
                            <input
                                {...register("venue")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter venue name"
                            />
                            {errors.venue && (
                                <p className="text-red-500 mt-1">{errors.venue.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Address</label>
                            <input
                                {...register("address")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter address"
                            />
                            {errors.address && (
                                <p className="text-red-500 mt-1">{errors.address.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white mb-2">City</label>
                                <input
                                    {...register("city")}
                                    className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                    placeholder="Enter city"
                                />
                                {errors.city && (
                                    <p className="text-red-500 mt-1">{errors.city.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-white mb-2">Country</label>
                                <input
                                    {...register("country")}
                                    className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                    placeholder="Enter country"
                                />
                                {errors.country && (
                                    <p className="text-red-500 mt-1">{errors.country.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Organizers</label>
                            <input
                                {...register("organizers")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter organizers"
                            />
                            {errors.organizers && (
                                <p className="text-red-500 mt-1">{errors.organizers.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white mb-2">Contact Email</label>
                                <input
                                    type="email"
                                    {...register("contactEmail")}
                                    className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                    placeholder="Enter contact email"
                                />
                                {errors.contactEmail && (
                                    <p className="text-red-500 mt-1">{errors.contactEmail.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-white mb-2">Contact Phone</label>
                                <input
                                    {...register("contactPhone")}
                                    className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                    placeholder="Enter contact phone"
                                />
                                {errors.contactPhone && (
                                    <p className="text-red-500 mt-1">{errors.contactPhone.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Details */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Additional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white mb-2">Capacity</label>
                            <input
                                type="number"
                                {...register("capacity")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter capacity"
                            />
                            {errors.capacity && (
                                <p className="text-red-500 mt-1">{errors.capacity.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Price</label>
                            <input
                                type="number"
                                {...register("price")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter price"
                            />
                            {errors.price && (
                                <p className="text-red-500 mt-1">{errors.price.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Registration Deadline</label>
                            <input
                                type="datetime-local"
                                {...register("registrationDeadline")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            />
                            {errors.registrationDeadline && (
                                <p className="text-red-500 mt-1">{errors.registrationDeadline.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating Event..." : "Create Event"}
                    </button>
                </div>
            </form>
        </div>
    )
} 