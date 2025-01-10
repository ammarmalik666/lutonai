"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { EventRegistrationForm } from "@/components/event-registration-form"
import { EventShare } from "@/components/event-share"
import { Toaster } from "sonner"

interface Event {
    id: string
    title: string
    description: string
    date: string
    location: string
    image: string
    category: "workshop" | "hackathon" | "meetup" | "conference"
    attendees?: number
    organizer?: string
    availability: {
        totalSpots: number
        spotsRemaining: number
        isFull: boolean
        isWaitlistAvailable: boolean
        waitlistCount: number
        maxWaitlistSize: number
        registrationDeadline: Date
        isRegistrationOpen: boolean
    }
}

const getCategoryColor = (category: Event["category"]) => {
    switch (category) {
        case "workshop":
            return "bg-[#C8102E]/10 text-[#C8102E]"
        case "hackathon":
            return "bg-[#BD0029]/10 text-[#BD0029]"
        case "meetup":
            return "bg-[#C8102E]/20 text-[#C8102E]"
        case "conference":
            return "bg-[#BD0029]/20 text-[#BD0029]"
        default:
            return "bg-[#C8102E]/10 text-[#C8102E]"
    }
}

export default function EventDetailsPage({
    params,
}: {
    params: { id: string }
}) {
    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchEvent = async () => {
        try {
            const response = await fetch(`/api/events/${params.id}`)
            if (!response.ok) {
                throw new Error("Failed to fetch event")
            }
            const { data } = await response.json()
            setEvent({
                ...data,
                availability: {
                    ...data.availability,
                    registrationDeadline: new Date(data.availability.registrationDeadline)
                }
            })
        } catch (error) {
            setError("Failed to load event details")
            console.error("Error fetching event:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvent()
    }, [params.id])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Loading event details...</div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg text-red-500">{error || "Event not found"}</div>
            </div>
        )
    }

    return (
        <>
            <Toaster />
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-4xl text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(event.category)}`}
                            variants={fadeIn}
                        >
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </motion.span>
                        <motion.h1
                            className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl"
                            variants={fadeIn}
                        >
                            {event.title}
                        </motion.h1>
                    </motion.div>
                </div>
            </section>

            {/* Event Details Section */}
            <section className="py-20">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <motion.div
                            className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <Image
                                src={event.image}
                                alt={event.title}
                                className="object-cover"
                                fill
                                priority
                            />
                        </motion.div>

                        <motion.div
                            className="grid gap-8 md:grid-cols-3"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.div
                                className="col-span-2 space-y-8"
                                variants={slideIn}
                            >
                                <div className="prose prose-lg max-w-none">
                                    <h2 className="text-2xl font-bold text-[#C8102E]">About the Event</h2>
                                    <p className="text-[#000000]/70">{event.description}</p>
                                </div>

                                {event.organizer && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#C8102E]">Organizer</h3>
                                        <p className="mt-2 text-[#000000]/70">{event.organizer}</p>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                className="space-y-6"
                                variants={slideIn}
                            >
                                <div className="rounded-lg border border-[#000000]/10 bg-white p-6 shadow-sm">
                                    <h3 className="mb-4 text-lg font-semibold text-[#C8102E]">Event Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-[#000000]/70">
                                            <CalendarIcon className="h-5 w-5 text-[#C8102E]" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[#000000]/70">
                                            <MapPinIcon className="h-5 w-5 text-[#C8102E]" />
                                            <span>{event.location}</span>
                                        </div>
                                        {event.attendees && (
                                            <div className="flex items-center gap-3 text-[#000000]/70">
                                                <UsersIcon className="h-5 w-5 text-[#C8102E]" />
                                                <span>{event.attendees} attendees</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <EventRegistrationForm
                                            eventId={event.id}
                                            initialAvailability={event.availability}
                                            onSuccess={() => {
                                                // Refresh event data after successful registration
                                                fetchEvent()
                                            }}
                                        />
                                        <EventShare
                                            eventId={event.id}
                                            eventTitle={event.title}
                                            trigger={
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E]/5"
                                                >
                                                    Share Event
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Related Events Section */}
            <section className="bg-[#C8102E]/5 py-20">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <motion.h2
                            className="mb-12 text-center text-3xl font-bold text-[#C8102E]"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            Similar Events
                        </motion.h2>
                        <motion.div
                            className="grid gap-8 md:grid-cols-3"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            {/* Placeholder for related events - you can fetch and map through them */}
                            <motion.div variants={slideIn}>
                                <Link
                                    href="/events"
                                    className="block rounded-lg bg-white p-6 shadow-sm transition-transform hover:scale-105"
                                >
                                    <h3 className="mb-2 text-lg font-semibold text-[#C8102E]">View All Events</h3>
                                    <p className="text-[#000000]/70">
                                        Discover more exciting events and opportunities to learn and connect.
                                    </p>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
} 