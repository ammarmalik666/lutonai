import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getEventAvailability } from "@/lib/event-utils"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.id },
            include: {
                registrations: true,
            },
        })

        if (!event) {
            return createErrorResponse("Event not found", "NOT_FOUND", 404)
        }

        const availability = await getEventAvailability(event.id)

        return createSuccessResponse({
            ...event,
            availability,
        })
    } catch (error) {
        console.error("Error fetching event:", error)
        return createErrorResponse(
            "Error fetching event",
            "INTERNAL_SERVER_ERROR",
            500
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const json = await request.json()
        const { title, description, date, location, image } = json

        const event = await prisma.event.update({
            where: { id: params.id },
            data: {
                title,
                description,
                date: new Date(date),
                location,
                image,
            },
        })

        return NextResponse.json(event)
    } catch (error) {
        console.error("Error updating event:", error)
        return NextResponse.json(
            { message: "Error updating event" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        await prisma.event.delete({
            where: { id: params.id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Error deleting event:", error)
        return NextResponse.json(
            { message: "Error deleting event" },
            { status: 500 }
        )
    }
} 