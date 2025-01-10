import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError, validateRequest, createSuccessResponse } from "@/lib/api-utils"
import { eventRegistrationSchema } from "@/lib/validations"
import { validateEventRegistration, getEventAvailability, getEventStatus } from "@/lib/event-utils"
import { z } from "zod"

const listRegistrationsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    eventId: z.string().min(1, "Event ID is required"),
    sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().optional(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "WAITLISTED"]).optional(),
})

type ListRegistrationsSchema = z.infer<typeof listRegistrationsSchema>

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const validated = listRegistrationsSchema.parse(Object.fromEntries(searchParams))
        const { page, limit, eventId, sortBy, sortOrder, search, status } = validated

        const skip = (page - 1) * limit

        // Build where clause with search functionality
        const where = {
            eventId,
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { organization: { contains: search, mode: "insensitive" } },
                ],
            } : {}),
            ...(status ? { status } : {}),
        }

        const [registrations, total, event] = await Promise.all([
            prisma.eventRegistration.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    event: true,
                },
            }),
            prisma.eventRegistration.count({ where }),
            prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    _count: {
                        select: { registrations: true },
                    },
                },
            }),
        ])

        if (!event) {
            throw new Error("Event not found")
        }

        const availability = await getEventAvailability(eventId)
        const eventStatus = getEventStatus(event)

        return createSuccessResponse({
            registrations,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
                hasMore: skip + registrations.length < total,
            },
            availability,
            eventStatus,
        })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const validatedData = await validateRequest(eventRegistrationSchema, data)

        const event = await prisma.event.findUnique({
            where: { id: validatedData.eventId },
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
        })

        if (!event) {
            throw new Error("Event not found")
        }

        const { shouldWaitlist } = await validateEventRegistration(validatedData.eventId, validatedData.email)

        const registrationData = {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            organization: validatedData.organization,
            dietaryRequirements: validatedData.dietaryRequirements,
            specialRequirements: validatedData.specialRequirements,
            eventId: validatedData.eventId,
        }

        const registration = await prisma.eventRegistration.create({
            data: {
                ...registrationData,
                status: shouldWaitlist ? "WAITLISTED" : "CONFIRMED",
            },
            include: {
                event: true,
            },
        })

        const [availability, eventStatus] = await Promise.all([
            getEventAvailability(validatedData.eventId),
            getEventStatus(event),
        ])

        return createSuccessResponse({
            message: shouldWaitlist
                ? "You have been added to the waitlist. We will notify you if a spot becomes available."
                : "Registration successful",
            registration,
            availability,
            eventStatus,
        }, 201)
    } catch (error) {
        return handleApiError(error)
    }
} 