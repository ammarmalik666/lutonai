"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { fadeIn, staggerContainer } from "@/lib/animations"

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
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch event")
        }
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">Loading event details...</div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-red-500">{error || "Event not found"}</div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section with Event Image */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={event.thumbnail || "/events/default-event.jpg"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative h-full">
          <div className="container flex h-full items-end pb-16">
            <motion.div
              className="max-w-3xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1
                className="mb-4 text-4xl font-bold text-white sm:text-5xl"
                variants={fadeIn}
              >
                {event.title}
              </motion.h1>
              <motion.div
                className="flex flex-wrap gap-4"
                variants={fadeIn}
              >
                <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                  📅 {formatDate(event.startDateTime)}
                </span>
                {event.eventType && (
                  <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                    {event.eventType}
                  </span>
                )}
                {event.venue && (
                  <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                    📍 {event.venue}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-2xl font-bold">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                {event.description}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8 lg:col-span-1">
              {/* Event Details Card */}
              <div className="rounded-lg border border-gray-200 p-6">
                <h3 className="mb-4 text-lg font-semibold">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Date & Time</div>
                    <div>{formatDate(event.startDateTime)}</div>
                  </div>
                  {event.venue && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Venue</div>
                      <div>{event.venue}</div>
                    </div>
                  )}
                  {event.capacity && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Capacity</div>
                      <div>{event.capacity} attendees</div>
                    </div>
                  )}
                  {event.price !== undefined && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Price</div>
                      <div>{event.price === 0 ? "Free" : `$${event.price}`}</div>
                    </div>
                  )}
                  {event.registrationDeadline && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Registration Deadline</div>
                      <div>{formatDate(event.registrationDeadline)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(event.contactEmail || event.contactPhone) && (
                <div className="rounded-lg border border-gray-200 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Contact Information</h3>
                  <div className="space-y-4">
                    {event.contactEmail && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Email</div>
                        <a href={`mailto:${event.contactEmail}`} className="text-[#C8102E]">
                          {event.contactEmail}
                        </a>
                      </div>
                    )}
                    {event.contactPhone && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Phone</div>
                        <a href={`tel:${event.contactPhone}`} className="text-[#C8102E]">
                          {event.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 