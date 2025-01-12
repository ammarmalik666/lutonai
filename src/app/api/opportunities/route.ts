import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Opportunity from "@/models/Opportunity"

export async function POST(req: Request) {
    try {
        await dbConnect()

        const formData = await req.formData()
        
        // Handle logo upload
        const file = formData.get("companyLogo") as File
        if (!file) {
            throw new Error("No company logo provided")
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

        // Parse skills array from JSON string
        const skills = JSON.parse(formData.get("skills") as string)

        // Create opportunity with logo URL
        const opportunity = await Opportunity.create({
            title: formData.get("title"),
            description: formData.get("description"),
            type: formData.get("type"),
            category: formData.get("category"),
            level: formData.get("level"),
            commitment: formData.get("commitment"),
            skills,
            location: formData.get("location"),
            companyLogo: `/uploads/${filename}`,
            applicationUrl: formData.get("applicationUrl"),
            startDate: formData.get("startDate") || undefined,
            endDate: formData.get("endDate") || undefined,
            applicationDeadline: formData.get("applicationDeadline") || undefined,
            contactName: formData.get("contactName") || undefined,
            contactEmail: formData.get("contactEmail") || undefined,
            contactPhone: formData.get("contactPhone") || undefined,
            remoteAvailable: formData.get("remoteAvailable") === "true",
            createdAt: new Date(),
        })

        return NextResponse.json(opportunity, { status: 201 })
    } catch (error) {
        console.error("Error creating opportunity:", error)
        return NextResponse.json(
            { error: "Error creating opportunity" },
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