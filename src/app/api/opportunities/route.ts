import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Opportunity from "@/models/Opportunity"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function POST(request: Request) {
    try {
        await dbConnect()
        const formData = await request.formData()

        // Handle company logo upload
        const file = formData.get("companyLogo") as File
        if (!file) {
            throw new Error("No company logo provided")
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)

        // Create opportunity with the Google Drive URL
        const opportunity = await Opportunity.create({
            title: formData.get("title"),
            description: formData.get("description"),
            type: formData.get("type"),
            category: formData.get("category"),
            level: formData.get("level"),
            commitment: formData.get("commitment"),
            skills: JSON.parse(formData.get("skills") as string),
            location: formData.get("location"),
            companyLogo: fileUrl,
            applicationUrl: formData.get("applicationUrl"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            applicationDeadline: formData.get("applicationDeadline"),
            contactName: formData.get("contactName"),
            contactEmail: formData.get("contactEmail"),
            contactPhone: formData.get("contactPhone"),
            remoteAvailable: formData.get("remoteAvailable") === "true",
            createdAt: new Date(),
        })

        return NextResponse.json({ success: true, data: opportunity })
    } catch (error) {
        console.error("Error creating opportunity:", error)
        return NextResponse.json(
            { error: "Failed to create opportunity" },
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
                    { title: { $regex: search, $options: 'i' } },
                    { type: { $regex: search, $options: 'i' } },
                    { category: { $regex: search, $options: 'i' } }
                ]
            }
            : {}

        // Fetch opportunities
        const opportunities = await Opportunity.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .select('title companyLogo type category location commitment applicationDeadline remoteAvailable')

        return NextResponse.json({ opportunities })
    } catch (error) {
        console.error("Error fetching opportunities:", error)
        return NextResponse.json(
            { error: "Error fetching opportunities" },
            { status: 500 }
        )
    }
} 