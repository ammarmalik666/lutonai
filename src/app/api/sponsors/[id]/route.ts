import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const sponsor = await Sponsor.findById(params.id)
        
        if (!sponsor) {
            return NextResponse.json(
                { error: "Sponsor not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(sponsor)
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching sponsor" },
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
            name: formData.get("name"),
            description: formData.get("description"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            website: formData.get("website"),
            sponsorshipLevel: formData.get("sponsorshipLevel"),
            updatedAt: new Date(),
        }

        // Handle new logo if provided
        const file = formData.get("logo") as File
        if (file?.size > 0) {
            const fileBuffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)
            updateData.logo = fileUrl
        }

        const sponsor = await Sponsor.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!sponsor) {
            return NextResponse.json(
                { error: "Sponsor not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: sponsor })
    } catch (error) {
        console.error("Error updating sponsor:", error)
        return NextResponse.json(
            { error: "Failed to update sponsor" },
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
        
        const sponsor = await Sponsor.findById(params.id)
        if (!sponsor) {
            return NextResponse.json(
                { error: "Sponsor not found" },
                { status: 404 }
            )
        }

        // Delete logo file
        if (sponsor.logo) {
            const filepath = path.join(process.cwd(), "public", sponsor.logo)
            try {
                await unlink(filepath)
            } catch (error) {
                console.error("Error deleting logo:", error)
            }
        }

        // Delete sponsor from database
        await Sponsor.findByIdAndDelete(params.id)

        return NextResponse.json(
            { message: "Sponsor deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting sponsor:", error)
        return NextResponse.json(
            { error: "Error deleting sponsor" },
            { status: 500 }
        )
    }
} 