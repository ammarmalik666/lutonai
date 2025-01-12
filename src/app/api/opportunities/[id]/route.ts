import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Opportunity from "@/models/Opportunity"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const opportunity = await Opportunity.findById(params.id)
        
        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(opportunity)
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching opportunity" },
            { status: 500 }
        )
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const formData = await req.formData()
        const opportunity = await Opportunity.findById(params.id)
        
        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            )
        }

        // Handle new logo if provided
        const file = formData.get("companyLogo") as File
        let logoPath = opportunity.companyLogo // Keep existing logo by default

        if (file) {
            // Delete old logo
            if (opportunity.companyLogo) {
                const oldPath = path.join(process.cwd(), "public", opportunity.companyLogo)
                try {
                    await unlink(oldPath)
                } catch (error) {
                    console.error("Error deleting old logo:", error)
                }
            }

            // Save new logo
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filename = `${Date.now()}-${file.name}`
            const filepath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(filepath, buffer)
            logoPath = `/uploads/${filename}`
        }

        // Parse skills array from JSON string
        const skills = JSON.parse(formData.get("skills") as string)

        // Update opportunity
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            params.id,
            {
                title: formData.get("title"),
                description: formData.get("description"),
                type: formData.get("type"),
                category: formData.get("category"),
                level: formData.get("level"),
                commitment: formData.get("commitment"),
                skills,
                location: formData.get("location"),
                companyLogo: logoPath,
                applicationUrl: formData.get("applicationUrl"),
                startDate: formData.get("startDate") || undefined,
                endDate: formData.get("endDate") || undefined,
                applicationDeadline: formData.get("applicationDeadline") || undefined,
                contactName: formData.get("contactName") || undefined,
                contactEmail: formData.get("contactEmail") || undefined,
                contactPhone: formData.get("contactPhone") || undefined,
                remoteAvailable: formData.get("remoteAvailable") === "true",
            },
            { new: true }
        )

        return NextResponse.json(updatedOpportunity)
    } catch (error) {
        console.error("Error updating opportunity:", error)
        return NextResponse.json(
            { error: "Error updating opportunity" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const opportunity = await Opportunity.findById(params.id)
        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            )
        }

        // Delete logo file
        if (opportunity.companyLogo) {
            const filepath = path.join(process.cwd(), "public", opportunity.companyLogo)
            try {
                await unlink(filepath)
            } catch (error) {
                console.error("Error deleting logo:", error)
            }
        }

        // Delete opportunity from database
        await Opportunity.findByIdAndDelete(params.id)

        return NextResponse.json(
            { message: "Opportunity deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting opportunity:", error)
        return NextResponse.json(
            { error: "Error deleting opportunity" },
            { status: 500 }
        )
    }
} 