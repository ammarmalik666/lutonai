"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"

interface Event {
    _id: string
    title: string
    description: string
    thumbnail: string
    startDateTime: string
    endDateTime: string
    eventType: string
    venue: string
    address: string
    city: string
    country: string
    organizers: string
    contactEmail: string
    contactPhone: string
    capacity: number
    price: number
    registrationDeadline: string
    createdAt: string
}

export default function EventDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`/api/events/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch event")
                const data = await response.json()
                setEvent(data)
            } catch (error) {
                toast.error("Error loading event")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvent()
    }, [params.id])

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/events/${params.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete event")

            toast.success("Event deleted successfully")
            router.push("/admin/events")
        } catch (error) {
            toast.error("Error deleting event")
            console.error(error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="text-center text-white py-12">
                Event not found
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Events
            </button>

            {/* Main Content */}
            <article className="bg-[#000000] rounded-lg overflow-hidden border border-[#222222]">
                {/* Thumbnail */}
                <div className="relative h-[400px] w-full">
                    <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Event Info */}
                <div className="p-8">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="text-red-500 font-medium">
                            {event.eventType}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        <time dateTime={event.createdAt}>
                            Posted on {format(new Date(event.createdAt), "MMMM d, yyyy")}
                        </time>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-6">
                        {event.title}
                    </h1>

                    {/* Registration Deadline */}
                    <div className="mb-6">
                        <p className="text-red-500">
                            Registration Deadline: {format(new Date(event.registrationDeadline), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>

                    {/* Event Timing */}
                    <div className="mb-8 p-4 bg-[#111111] rounded-lg">
                        <p className="text-white">
                            <strong>From:</strong> {format(new Date(event.startDateTime), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                        <p className="text-white">
                            <strong>To:</strong> {format(new Date(event.endDateTime), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                        <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
                    </div>

                    {/* Location Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Location Details</h2>
                        <div className="space-y-2 text-gray-300">
                            <p><strong className="text-white">Venue:</strong> {event.venue}</p>
                            <p><strong className="text-white">Address:</strong> {event.address}</p>
                            <p><strong className="text-white">City:</strong> {event.city}</p>
                            <p><strong className="text-white">Country:</strong> {event.country}</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Contact Details</h2>
                        <div className="space-y-2 text-gray-300">
                            <p><strong className="text-white">Organizers:</strong> {event.organizers}</p>
                            <p><strong className="text-white">Email:</strong> {event.contactEmail}</p>
                            <p><strong className="text-white">Phone:</strong> {event.contactPhone}</p>
                        </div>
                    </div>

                    {/* Price & Capacity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#111111] rounded-lg">
                        <div>
                            <p className="text-gray-400">Price</p>
                            <p className="text-2xl font-bold text-white">£{event.price}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Capacity</p>
                            <p className="text-2xl font-bold text-white">{event.capacity} people</p>
                        </div>
                    </div>
                </div>
            </article>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => router.push(`/admin/events/edit/${event._id}`)}
                    className="px-4 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                >
                    Edit Event
                </button>
                <button
                    onClick={() => setDeleteModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Delete Event
                </button>
            </div>

            <DeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title={event.title}
            />
        </div>
    )
} 