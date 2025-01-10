import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const sponsor = await prisma.sponsor.findUnique({
            where: {
                id: params.id,
            },
        })

        if (!sponsor) {
            return NextResponse.json(
                { error: { message: "Sponsor not found" } },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: sponsor }, { status: 200 })
    } catch (error) {
        console.error("Error fetching sponsor:", error)
        return NextResponse.json(
            { error: { message: "Failed to fetch sponsor" } },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const json = await request.json()

        // Validate required fields
        if (!json.name || !json.description || !json.tier || !json.startDate) {
            return NextResponse.json(
                {
                    error: {
                        message: "Missing required fields",
                    },
                },
                { status: 400 }
            )
        }

        // Update sponsor
        const sponsor = await prisma.sponsor.update({
            where: {
                id: params.id,
            },
            data: {
                name: json.name,
                description: json.description,
                website: json.website || null,
                logo: json.logo || null,
                tier: json.tier,
                startDate: new Date(json.startDate),
                endDate: json.endDate ? new Date(json.endDate) : null,
                isActive: json.isActive,
                contactName: json.contactName || null,
                contactEmail: json.contactEmail || null,
                contactPhone: json.contactPhone || null,
            } as Prisma.SponsorUpdateInput,
        })

        return NextResponse.json({ data: sponsor }, { status: 200 })
    } catch (error) {
        console.error("Error updating sponsor:", error)
        return NextResponse.json(
            { error: { message: "Failed to update sponsor" } },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.sponsor.delete({
            where: {
                id: params.id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Error deleting sponsor:", error)
        return NextResponse.json(
            { error: { message: "Failed to delete sponsor" } },
            { status: 500 }
        )
    }
} 