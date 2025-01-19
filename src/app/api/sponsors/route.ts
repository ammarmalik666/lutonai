import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function POST(request: Request) {
    try {
        await dbConnect()
        const formData = await request.formData()

        // Handle logo upload
        const file = formData.get("logo") as File
        if (!file) {
            throw new Error("No logo provided")
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)

        // Create sponsor with the Google Drive URL
        const sponsor = await Sponsor.create({
            name: formData.get("name"),
            description: formData.get("description"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            website: formData.get("website"),
            sponsorshipLevel: formData.get("sponsorshipLevel"),
            logo: fileUrl,  // Save the Google Drive URL
            createdAt: new Date(),
        })

        return NextResponse.json({ success: true, data: sponsor })
    } catch (error) {
        console.error("Error creating sponsor:", error)
        return NextResponse.json(
            { error: "Failed to create sponsor" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect()
        
        // Get search parameter
        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search') || ''

        // Build query
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { sponsorshipLevel: { $regex: search, $options: 'i' } }
                ]
            }
            : {}

        // Fetch sponsors
        const sponsors = await Sponsor.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .select('name logo sponsorshipLevel') // Select only needed fields

        return NextResponse.json({ sponsors })
    } catch (error) {
        console.error("Error fetching sponsors:", error)
        return NextResponse.json(
            { error: "Error fetching sponsors" },
            { status: 500 }
        )
    }
} 