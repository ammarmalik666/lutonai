import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Sponsor from "@/models/Sponsor"

export async function POST(req: Request) {
    try {
        await dbConnect()

        const formData = await req.formData()
        
        // Handle logo upload
        const file = formData.get("logo") as File
        if (!file) {
            throw new Error("No logo provided")
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        try {
            await writeFile(path.join(uploadsDir, "test.txt"), "")
        } catch (error) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Save logo
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${Date.now()}-${file.name}`
        const filepath = path.join(uploadsDir, filename)
        await writeFile(filepath, buffer)

        // Create sponsor with logo URL
        const sponsor = await Sponsor.create({
            name: formData.get("name"),
            description: formData.get("description"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            website: formData.get("website"),
            sponsorshipLevel: formData.get("sponsorshipLevel"),
            logo: `/uploads/${filename}`,
            createdAt: new Date(),
        })

        return NextResponse.json(sponsor, { status: 201 })
    } catch (error) {
        console.error("Error creating sponsor:", error)
        return NextResponse.json(
            { error: "Error creating sponsor" },
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