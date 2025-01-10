"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button, Badge } from "@tremor/react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { toast } from "sonner"
import { format } from "date-fns"
import { IconCalendar, IconMapPin, IconUsers, IconClock, IconMail, IconPhone, IconCash } from "@tabler/icons-react"

interface Event {
    id: string
    title: string
    description: string
    date: string
    endDate: string | null
    location: string
    image: string | null
    capacity: number | null
    type: string
    venue: string | null
    address: string | null
    city: string | null
    country: string | null
    organizer: string | null
    contactEmail: string | null
    contactPhone: string | null
    registrationDeadline: string | null
    price: number | null
    category: string | null
    tags: string | null
    status: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
}

interface EventsResponse {
    data: {
        events: Event[]
        pagination: {
            total: number
            pages: number
            currentPage: number
            perPage: number
            hasMore: boolean
        }
    }
}

export default function EventsPage() {
    const router = useRouter()
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch("/api/events")
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to fetch events")
            }
            const data: EventsResponse = await response.json()
            setEvents(data.data.events)
        } catch (error) {
            console.error("Error fetching events:", error)
            setError(error instanceof Error ? error.message : "Failed to load events")
            toast.error(error instanceof Error ? error.message : "Failed to load events")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return

        try {
            const response = await fetch(`/api/events?id=${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to delete event")
            }

            toast.success("Event deleted successfully")
            fetchEvents()
        } catch (error) {
            console.error("Error deleting event:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete event")
        }
    }

    const getEventStatus = (event: Event) => {
        const eventDate = new Date(event.date)
        const now = new Date()

        if (event.status === "CANCELLED") {
            return { label: "Cancelled", color: "red" }
        }
        if (event.status === "DRAFT") {
            return { label: "Draft", color: "gray" }
        }
        if (eventDate < now) {
            return { label: "Past", color: "gray" }
        }
        if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
            return { label: "Upcoming", color: "yellow" }
        }
        return { label: "Scheduled", color: "green" }
    }

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case "IN_PERSON":
                return "blue"
            case "ONLINE":
                return "purple"
            case "HYBRID":
                return "indigo"
            default:
                return "gray"
        }
    }

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.div variants={fadeIn} className="relative mb-8">
                <div className="max-w-4xl">
                    <Title className="text-5xl font-bold text-white mb-4">Events</Title>
                    <Text className="text-xl text-gray-400">
                        Create and manage events, track registrations, and monitor event performance.
                    </Text>
                </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-8">
                <Button
                    onClick={() => router.push("/admin/events/new")}
                    size="lg"
                    className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                    icon={IconCalendar}
                >
                    Create Event
                </Button>
            </motion.div>

            {isLoading ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-lg text-gray-400">Loading events...</div>
                </motion.div>
            ) : error ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-red-500 mb-4">{error}</div>
                        <Button
                            onClick={fetchEvents}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Try Again
                        </Button>
                    </div>
                </motion.div>
            ) : events.length === 0 ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-gray-400 mb-4">No events found</div>
                        <Button
                            onClick={() => router.push("/admin/events/new")}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Create Your First Event
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <motion.div variants={slideIn}>
                    <Card className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="text-gray-400">Event Details</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Date & Time</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Location</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Status</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {events.map((event) => {
                                    const status = getEventStatus(event)
                                    return (
                                        <TableRow
                                            key={event.id}
                                            className="group hover:bg-gray-800/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <Text className="font-medium text-white">
                                                            {event.title}
                                                        </Text>
                                                        <Text className="text-sm text-gray-400 line-clamp-2">
                                                            {event.description}
                                                        </Text>
                                                        <div className="flex items-center gap-2">
                                                            {event.category && (
                                                                <Badge size="xs" color="cyan">
                                                                    {event.category}
                                                                </Badge>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="xs"
                                                                    variant="secondary"
                                                                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-[#C8102E] hover:text-white"
                                                                    onClick={() => router.push(`/admin/events/${event.id}`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    variant="secondary"
                                                                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                                                                    onClick={() => handleDelete(event.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-start space-x-2 text-gray-400">
                                                        <IconClock className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                        <div className="space-y-1">
                                                            <Text className="text-sm">
                                                                {format(new Date(event.date), "PPP")}
                                                            </Text>
                                                            <Text className="text-sm">
                                                                {format(new Date(event.date), "p")}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-start space-x-2 text-gray-400">
                                                        <IconMapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                        <div className="space-y-1">
                                                            <Text className="text-sm">
                                                                {event.venue || event.location}
                                                            </Text>
                                                            {event.city && event.country && (
                                                                <Text className="text-sm">
                                                                    {event.city}, {event.country}
                                                                </Text>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <Badge size="sm" color={status.color as any}>
                                                        {status.label}
                                                    </Badge>
                                                    <Badge size="sm" color={getEventTypeColor(event.type) as any}>
                                                        {event.type ? event.type.replace('_', ' ') : 'Unknown'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
} 