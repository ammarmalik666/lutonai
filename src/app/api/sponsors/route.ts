import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const sponsors = await prisma.sponsor.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ data: sponsors }, { status: 200 })
    } catch (error) {
        console.error("Error fetching sponsors:", error)
        return NextResponse.json(
            { error: { message: "Failed to fetch sponsors" } },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
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

        // Create sponsor
        const sponsor = await prisma.sponsor.create({
            data: {
                name: json.name,
                description: json.description,
                website: json.website || null,
                logo: json.logo || null,
                tier: json.tier,
                startDate: new Date(json.startDate),
                endDate: json.endDate ? new Date(json.endDate) : null,
                isActive: json.isActive ?? true,
                contactName: json.contactName || null,
                contactEmail: json.contactEmail || null,
                contactPhone: json.contactPhone || null,
            } as Prisma.SponsorCreateInput,
        })

        return NextResponse.json({ data: sponsor }, { status: 201 })
    } catch (error) {
        console.error("Error creating sponsor:", error)
        return NextResponse.json(
            { error: { message: "Failed to create sponsor" } },
            { status: 500 }
        )
    }
}