"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  image?: string
  capacity?: number
  type: 'IN_PERSON' | 'ONLINE' | 'HYBRID'
  venue?: string
  address?: string
  city?: string
  country?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  registrationDeadline?: string
  price?: number
  category?: string
  tags?: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchEvents = async (pageNum = 1) => {
    try {
      setIsLoading(true)
      setError("")

      const response = await fetch(`/api/events?page=${pageNum}&limit=10&status=PUBLISHED`, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch events (HTTP ${response.status})`)
      }

      const data = await response.json()
      
      if (!data?.events) {
        throw new Error("Invalid response format from server")
      }

      setEvents(pageNum === 1 ? data.events : [...events, ...data.events])
      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching events:", error)
      setError(error instanceof Error ? error.message : "Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">{error}</div>
          <Button onClick={() => fetchEvents()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!events.length) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">No upcoming events found</div>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
              variants={fadeIn}
            >
              Events
            </motion.h1>
            <motion.p
              className="text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Join us for exciting events and opportunities to learn, network, and grow in the field of AI.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {events.map((event, index) => (
              <motion.article
                key={event._id}
                className="group flex flex-col items-start"
                variants={slideIn}
                custom={index}
              >
                <div className="relative w-full overflow-hidden rounded-lg">
                  <Image
                    src={event.image || "/events/workshop.svg"}
                    alt={event.title}
                    className="aspect-[16/9] w-full bg-gray-100 object-cover transition-transform duration-300 group-hover:scale-105 sm:aspect-[2/1] lg:aspect-[3/2]"
                    width={800}
                    height={400}
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-[#000000]/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={event.date} className="text-[#000000]/60">
                      {formatDate(event.date)}
                    </time>
                    {event.type && (
                      <span className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${
                        event.type === 'IN_PERSON' ? 'bg-green-500/20 text-green-700' :
                        event.type === 'ONLINE' ? 'bg-blue-500/20 text-blue-700' :
                        'bg-purple-500/20 text-purple-700'
                      }`}>
                        {event.type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#C8102E]">
                      <Link href={`/events/${event._id}`}>
                        <span className="absolute inset-0" />
                        {event.title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#000000]/60">
                      {event.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.venue && (
                        <span className="text-sm text-[#000000]/60">
                          📍 {event.venue}
                        </span>
                      )}
                      {event.capacity && (
                        <span className="text-sm text-[#000000]/60">
                          👥 {event.capacity} spots
                        </span>
                      )}
                      {event.price !== undefined && (
                        <span className="text-sm text-[#000000]/60">
                          💰 {event.price === 0 ? "Free" : `$${event.price}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {hasMore && !isLoading && !error && (
            <div className="mt-16 flex justify-center">
              <Button
                onClick={() => fetchEvents(page + 1)}
                className="bg-[#C8102E] hover:bg-[#800029] text-white"
              >
                Load More Events
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 