import { prisma } from "./prisma"
import { ApiError } from "./api-utils"
import { type Event } from "@prisma/client"

export const DEFAULT_MAX_ATTENDEES = 100
export const DEFAULT_WAITLIST_SIZE = 50
export const REGISTRATION_DEADLINE_HOURS = 24

type RegistrationStatus = "CONFIRMED" | "CANCELLED" | "WAITLIST"

interface EventRegistration {
    id: string
    name: string
    email: string
    phone: string | null
    organization: string | null
    dietaryRequirements: string | null
    specialRequirements: string | null
    status: RegistrationStatus
    eventId: string
    createdAt: Date
    updatedAt: Date
}

export interface EventAvailability {
    totalSpots: number
    spotsRemaining: number
    isFull: boolean
    isWaitlistAvailable: boolean
    waitlistCount: number
    maxWaitlistSize: number
    registrationDeadline: Date
    isRegistrationOpen: boolean
}

export function calculateEventAvailability(
    totalRegistrations: number,
    confirmedRegistrations: number,
    maxAttendees: number,
    maxWaitlistSize: number = DEFAULT_WAITLIST_SIZE,
    eventDate: Date
): EventAvailability {
    const totalSpots = maxAttendees
    const spotsRemaining = Math.max(0, maxAttendees - confirmedRegistrations)
    const isFull = spotsRemaining === 0
    const waitlistCount = Math.max(0, totalRegistrations - confirmedRegistrations)
    const isWaitlistAvailable = isFull && waitlistCount < maxWaitlistSize
    const registrationDeadline = getRegistrationDeadline(eventDate)
    const isRegistrationOpen = canRegisterForEvent(eventDate)

    return {
        totalSpots,
        spotsRemaining,
        isFull,
        isWaitlistAvailable,
        waitlistCount,
        maxWaitlistSize,
        registrationDeadline,
        isRegistrationOpen,
    }
}

export async function getEventAvailability(eventId: string): Promise<EventAvailability> {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            registrations: true,
        },
    })

    if (!event) {
        throw new ApiError("Event not found", 404)
    }

    const totalRegistrations = event.registrations.length
    const confirmedRegistrations = event.registrations.filter(r => (r as EventRegistration).status === "CONFIRMED").length
    const maxAttendees = DEFAULT_MAX_ATTENDEES
    const availability = calculateEventAvailability(
        totalRegistrations,
        confirmedRegistrations,
        maxAttendees,
        DEFAULT_WAITLIST_SIZE,
        event.date
    )

    return availability
}

export async function validateEventRegistration(eventId: string, email: string): Promise<{ shouldWaitlist: boolean }> {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            registrations: true,
        },
    })

    if (!event) {
        throw new ApiError("Event not found", 404)
    }

    if (isEventInPast(event.date)) {
        throw new ApiError("Cannot register for past events", 400)
    }

    if (!canRegisterForEvent(event.date)) {
        const deadline = getRegistrationDeadline(event.date)
        throw new ApiError(
            `Registration is closed. Registration deadline was ${formatEventDate(deadline)}`,
            400
        )
    }

    const existingRegistration = await prisma.eventRegistration.findUnique({
        where: {
            eventId_email: {
                eventId,
                email,
            },
        },
    })

    if (existingRegistration) {
        throw new ApiError("You have already registered for this event", 400)
    }

    const confirmedRegistrations = event.registrations.filter(r => (r as EventRegistration).status === "CONFIRMED").length
    const totalRegistrations = event.registrations.length
    const isFull = confirmedRegistrations >= DEFAULT_MAX_ATTENDEES
    const waitlistCount = totalRegistrations - confirmedRegistrations

    if (isFull && waitlistCount >= DEFAULT_WAITLIST_SIZE) {
        throw new ApiError(
            "Event is full and waitlist is at capacity. Please try again later or contact us for more information.",
            400
        )
    }

    return { shouldWaitlist: isFull }
}

export function formatEventDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    })
}

export function isEventInPast(date: Date): boolean {
    return new Date(date) < new Date()
}

export function getRegistrationDeadline(eventDate: Date): Date {
    const deadline = new Date(eventDate)
    deadline.setHours(deadline.getHours() - REGISTRATION_DEADLINE_HOURS)
    return deadline
}

export function canRegisterForEvent(eventDate: Date): boolean {
    const now = new Date()
    const deadline = getRegistrationDeadline(eventDate)
    return now <= deadline
}

interface EventWithRegistrations extends Event {
    _count: {
        registrations: number
    }
}

export function getEventStatus(event: EventWithRegistrations): {
    status: "upcoming" | "in-progress" | "past"
    registrationStatus: "open" | "closed" | "full" | "waitlist"
    statusMessage: string
} {
    const now = new Date()
    const eventDate = new Date(event.date)
    const registrationDeadline = getRegistrationDeadline(eventDate)
    const isFull = event._count.registrations >= DEFAULT_MAX_ATTENDEES

    let status: "upcoming" | "in-progress" | "past"
    let registrationStatus: "open" | "closed" | "full" | "waitlist"
    let statusMessage: string

    if (eventDate < now) {
        status = "past"
        registrationStatus = "closed"
        statusMessage = "This event has ended"
    } else if (now >= eventDate) {
        status = "in-progress"
        registrationStatus = "closed"
        statusMessage = "This event is in progress"
    } else {
        status = "upcoming"
        if (isFull) {
            registrationStatus = "waitlist"
            statusMessage = "Main registration is full - waitlist available"
        } else if (now > registrationDeadline) {
            registrationStatus = "closed"
            statusMessage = `Registration closed on ${formatEventDate(registrationDeadline)}`
        } else {
            registrationStatus = "open"
            statusMessage = `Registration closes on ${formatEventDate(registrationDeadline)}`
        }
    }

    return {
        status,
        registrationStatus,
        statusMessage,
    }
} 