import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateRequest, withAuth, createSuccessResponse, createErrorResponse } from "@/lib/api-utils"
import { sanitizeHtml } from "@/lib/sanitize"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Define response type
interface EventResponse {
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

const listEventsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    upcoming: z.coerce.boolean().optional(),
    location: z.string().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
})

const createEventSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").transform(sanitizeHtml),
    description: z.string().min(1, "Description is required").transform(sanitizeHtml),
    date: z.string().datetime("Invalid date format"),
    endDate: z.string().datetime("Invalid date format").nullable(),
    location: z.string().min(1, "Location is required").max(200, "Location must be less than 200 characters").transform(sanitizeHtml),
    image: z.string().url("Invalid image URL").nullable(),
    capacity: z.number().int().positive("Capacity must be a positive number").nullable(),
    type: z.string().default("IN_PERSON"),
    venue: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    organizer: z.string().nullable(),
    contactEmail: z.string().email("Invalid email format").nullable(),
    contactPhone: z.string().nullable(),
    registrationDeadline: z.string().datetime("Invalid date format").nullable(),
    price: z.number().min(0, "Price cannot be negative").nullable(),
    category: z.string().nullable(),
    tags: z.string().nullable(),
    status: z.string().default("DRAFT"),
    isPublic: z.boolean().default(true),
})

const updateEventSchema = createEventSchema.extend({
    id: z.string().min(1, "Event ID is required"),
})

type CreateEventInput = z.infer<typeof createEventSchema>
type UpdateEventInput = z.infer<typeof updateEventSchema>

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const validated = await validateRequest(listEventsSchema, Object.fromEntries(searchParams))
        const { page = 1, limit = 10, search, upcoming, location, type, category, status } = validated

        const skip = (page - 1) * limit

        const where: Prisma.EventWhereInput = {}

        if (search) {
            where.OR = [
                { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ]
        }

        if (upcoming) {
            where.date = { gte: new Date() }
        }

        if (location) {
            where.location = { contains: location, mode: Prisma.QueryMode.insensitive }
        }

        if (type) {
            where.type = type
        }

        if (category) {
            where.category = category
        }

        if (status) {
            where.status = status
        }

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: limit,
                orderBy: { date: "asc" },
            }),
            prisma.event.count({ where }),
        ])

        const formattedEvents: EventResponse[] = events.map(event => ({
            ...event,
            date: event.date.toISOString(),
            endDate: event.endDate?.toISOString() || null,
            registrationDeadline: event.registrationDeadline?.toISOString() || null,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }))

        return createSuccessResponse({
            events: formattedEvents,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
                hasMore: skip + events.length < total,
            }
        })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            throw new Error("Unauthorized")
        }

        const data = await request.json()
        const validatedData = await validateRequest(createEventSchema, data)

        const event = await prisma.event.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                date: new Date(validatedData.date),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                location: validatedData.location,
                image: validatedData.image,
                capacity: validatedData.capacity,
                type: validatedData.type,
                venue: validatedData.venue,
                address: validatedData.address,
                city: validatedData.city,
                country: validatedData.country,
                organizer: validatedData.organizer,
                contactEmail: validatedData.contactEmail,
                contactPhone: validatedData.contactPhone,
                registrationDeadline: validatedData.registrationDeadline ? new Date(validatedData.registrationDeadline) : null,
                price: validatedData.price,
                category: validatedData.category,
                tags: validatedData.tags,
                status: validatedData.status,
                isPublic: validatedData.isPublic,
            },
        })

        const formattedEvent: EventResponse = {
            ...event,
            date: event.date.toISOString(),
            endDate: event.endDate?.toISOString() || null,
            registrationDeadline: event.registrationDeadline?.toISOString() || null,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }

        return createSuccessResponse(formattedEvent, 201)
    } catch (error) {
        if (error instanceof Error && error.message === "Validation error") {
            return createErrorResponse(
                "Invalid event data",
                "VALIDATION_ERROR",
                400,
                error.cause
            )
        }
        return handleApiError(error)
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const data = await request.json()
        const validatedData = await validateRequest(updateEventSchema, data)

        const event = await prisma.event.update({
            where: { id: validatedData.id },
            data: {
                title: validatedData.title,
                description: validatedData.description,
                date: new Date(validatedData.date),
                endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
                location: validatedData.location,
                image: validatedData.image,
                capacity: validatedData.capacity,
                type: validatedData.type,
                venue: validatedData.venue,
                address: validatedData.address,
                city: validatedData.city,
                country: validatedData.country,
                organizer: validatedData.organizer,
                contactEmail: validatedData.contactEmail,
                contactPhone: validatedData.contactPhone,
                registrationDeadline: validatedData.registrationDeadline ? new Date(validatedData.registrationDeadline) : null,
                price: validatedData.price,
                category: validatedData.category,
                tags: validatedData.tags,
                status: validatedData.status,
                isPublic: validatedData.isPublic,
            },
        })

        const formattedEvent: EventResponse = {
            ...event,
            date: event.date.toISOString(),
            endDate: event.endDate?.toISOString() || null,
            registrationDeadline: event.registrationDeadline?.toISOString() || null,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }

        return createSuccessResponse(formattedEvent)
    } catch (error) {
        return handleApiError(error)
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Missing event ID", { status: 400 })
        }

        await prisma.event.delete({
            where: { id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleApiError(error)
    }
} 