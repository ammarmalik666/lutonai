import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Opportunity from "@/models/Opportunity"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const formData = await request.formData()

        const updateData: any = {
            title: formData.get("title"),
            description: formData.get("description"),
            type: formData.get("type"),
            category: formData.get("category"),
            level: formData.get("level"),
            commitment: formData.get("commitment"),
            skills: JSON.parse(formData.get("skills") as string),
            location: formData.get("location"),
            applicationUrl: formData.get("applicationUrl"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            applicationDeadline: formData.get("applicationDeadline"),
            contactName: formData.get("contactName"),
            contactEmail: formData.get("contactEmail"),
            contactPhone: formData.get("contactPhone"),
            remoteAvailable: formData.get("remoteAvailable") === "true",
            updatedAt: new Date(),
        }

        // Handle new company logo if provided
        const file = formData.get("companyLogo") as File
        if (file?.size > 0) {
            const fileBuffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)
            updateData.companyLogo = fileUrl
        }

        const opportunity = await Opportunity.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!opportunity) {
            return NextResponse.json(
                { error: "Opportunity not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: opportunity })
    } catch (error) {
        console.error("Error updating opportunity:", error)
        return NextResponse.json(
            { error: "Failed to update opportunity" },
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