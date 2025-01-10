"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

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
}

interface ApiResponse {
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

const getCategoryColor = (type: string) => {
  switch (type) {
    case "IN_PERSON":
      return "bg-green-500/20 text-green-300"
    case "ONLINE":
      return "bg-blue-500/20 text-blue-300"
    case "HYBRID":
      return "bg-purple-500/20 text-purple-300"
    default:
      return "bg-[#C8102E]/10 text-[#C8102E]"
  }
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

      const response = await fetch(`/api/events?page=${pageNum}&limit=10&upcoming=true&status=PUBLISHED`, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch events (HTTP ${response.status})`)
      }

      const result: ApiResponse = await response.json()

      if (!result?.data?.events) {
        throw new Error("Invalid response format from server")
      }

      setEvents(pageNum === 1 ? result.data.events : [...events, ...result.data.events])
      setHasMore(result.data.pagination.hasMore)
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
          <Button
            onClick={() => {
              fetchEvents()
            }}
          >
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
                key={event.id}
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
                      <span className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${getCategoryColor(event.type)}`}>
                        {event.type.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-[#C8102E]">
                      <Link href={`/events/${event.id}`}>
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
                      {event.price !== null && (
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

      {/* Newsletter Section */}
      <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
        <div className="container relative">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
              variants={fadeIn}
            >
              Subscribe to Our Newsletter
            </motion.h2>
            <motion.p
              className="mb-10 text-lg leading-8 text-white/80"
              variants={fadeIn}
            >
              Stay updated with our latest events and opportunities.
            </motion.p>
            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-white text-[#C8102E] hover:bg-gray-100"
              >
                <Link href="/newsletter">Subscribe Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 