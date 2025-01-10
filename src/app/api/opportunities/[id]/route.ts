import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const opportunity = await prisma.opportunity.findUnique({
            where: {
                id: params.id,
            },
        })

        if (!opportunity) {
            return NextResponse.json(
                { error: { message: "Opportunity not found" } },
                { status: 404 }
            )
        }

        return NextResponse.json({ opportunity }, { status: 200 })
    } catch (error) {
        console.error("Error fetching opportunity:", error)
        return NextResponse.json(
            { error: { message: "Failed to fetch opportunity" } },
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
        if (!json.title || !json.description || !json.type || !json.category || !json.level || !json.commitment || !json.location || !json.company || !json.skills) {
            return NextResponse.json(
                {
                    error: {
                        message: "Missing required fields",
                    },
                },
                { status: 400 }
            )
        }

        const data = {
            title: json.title,
            description: json.description,
            type: json.type,
            category: json.category,
            level: json.level,
            commitment: json.commitment,
            location: json.location,
            remote: json.remote ?? true,
            company: json.company,
            skills: json.skills,
            isActive: json.isActive ?? true,
            featured: json.featured ?? false,
            ...(json.companyLogo && { companyLogo: json.companyLogo }),
            ...(json.url && { url: json.url }),
            ...(json.compensation && { compensation: json.compensation }),
            ...(json.startDate && { startDate: new Date(json.startDate) }),
            ...(json.endDate && { endDate: new Date(json.endDate) }),
            ...(json.deadline && { deadline: new Date(json.deadline) }),
            ...(json.contactName && { contactName: json.contactName }),
            ...(json.contactEmail && { contactEmail: json.contactEmail }),
            ...(json.contactPhone && { contactPhone: json.contactPhone }),
        }

        const opportunity = await prisma.opportunity.update({
            where: {
                id: params.id,
            },
            data,
        })

        return NextResponse.json({ opportunity }, { status: 200 })
    } catch (error) {
        console.error("Error updating opportunity:", error)
        return NextResponse.json(
            { error: { message: "Failed to update opportunity" } },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.opportunity.delete({
            where: {
                id: params.id,
            },
        })

        return NextResponse.json({ message: "Opportunity deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error deleting opportunity:", error)
        return NextResponse.json(
            { error: { message: "Failed to delete opportunity" } },
            { status: 500 }
        )
    }
} 