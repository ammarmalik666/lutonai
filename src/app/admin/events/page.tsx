"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

interface Event {
    _id: string
    title: string
    description: string
    startDateTime: string
    endDateTime: string
    eventType: string
    venue?: string
    address?: string
    city?: string
    country?: string
    organizers?: string
    contactEmail?: string
    contactPhone?: string
    capacity?: number
    price?: number
    registrationDeadline?: string
    thumbnail?: string
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
    createdAt: string
    updatedAt: string
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/admin/events')
            if (!response.ok) throw new Error("Failed to fetch events")
            const data = await response.json()
            setEvents(data)
        } catch (error) {
            console.error("Error loading events:", error)
            toast.error("Failed to load events")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return

        try {
            const response = await fetch(`/api/admin/events/${eventId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete event")

            toast.success("Event deleted successfully")
            fetchEvents()
        } catch (error) {
            console.error("Error deleting event:", error)
            toast.error("Failed to delete event")
        }
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-white">Events</h1>
                <Button asChild>
                    <Link href="/admin/events/create" className="gap-2">
                        <PlusIcon className="h-5 w-5" />
                        Add Event
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg bg-[#111111] pl-10 pr-4 py-2 text-white border border-[#222222] focus:outline-none focus:border-[#333333]"
                />
            </div>

            {/* Events Grid */}
            {isLoading ? (
                <div className="text-center text-gray-500">Loading events...</div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center text-gray-500">No events found</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <div
                            key={event._id}
                            className="group relative overflow-hidden rounded-lg border border-[#222222] bg-[#111111]"
                        >
                            {/* Event Image */}
                            <div className="relative aspect-video overflow-hidden">
                                <Image
                                    src={event.thumbnail || "/events/default-event.jpg"}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                                        {event.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                                        event.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                                        event.status === 'DRAFT' ? 'bg-yellow-500/20 text-yellow-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {event.status}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {formatDate(event.startDateTime)}
                                    </span>
                                </div>

                                <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="rounded bg-[#222222] px-2 py-1 text-xs text-gray-300">
                                        {event.eventType}
                                    </span>
                                    {event.venue && (
                                        <span className="rounded bg-[#222222] px-2 py-1 text-xs text-gray-300">
                                            📍 {event.venue}
                                        </span>
                                    )}
                                    {event.capacity && (
                                        <span className="rounded bg-[#222222] px-2 py-1 text-xs text-gray-300">
                                            👥 {event.capacity} spots
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t border-[#222222] pt-4">
                                    <Link
                                        href={`/admin/events/${event._id}/edit`}
                                        className="text-sm text-blue-500 hover:text-blue-400"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="text-sm text-red-500 hover:text-red-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 