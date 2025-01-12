import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"

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
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const formData = await req.formData()
        const sponsor = await Sponsor.findById(params.id)
        
        if (!sponsor) {
            return NextResponse.json(
                { error: "Sponsor not found" },
                { status: 404 }
            )
        }

        // Handle new logo if provided
        const file = formData.get("logo") as File
        let logoPath = sponsor.logo // Keep existing logo by default

        if (file) {
            // Delete old logo
            if (sponsor.logo) {
                const oldPath = path.join(process.cwd(), "public", sponsor.logo)
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

        // Update sponsor
        const updatedSponsor = await Sponsor.findByIdAndUpdate(
            params.id,
            {
                name: formData.get("name"),
                description: formData.get("description"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                website: formData.get("website"),
                sponsorshipLevel: formData.get("sponsorshipLevel"),
                logo: logoPath,
            },
            { new: true }
        )

        return NextResponse.json(updatedSponsor)
    } catch (error) {
        console.error("Error updating sponsor:", error)
        return NextResponse.json(
            { error: "Error updating sponsor" },
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