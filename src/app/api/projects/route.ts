import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function GET() {
    try {
        await dbConnect()
        const projects = await Project.find({})
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ 
            success: true, 
            projects 
        })
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json(
            { success: false, error: "Error fetching projects" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect()
        const formData = await request.formData()

        // Handle thumbnail upload
        const thumbnailFile = formData.get("thumbnail") as File
        if (!thumbnailFile) {
            throw new Error("No thumbnail provided")
        }

        const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
        const thumbnailName = `${Date.now()}-${thumbnailFile.name}`
        const thumbnailUrl = await uploadToGoogleDrive(thumbnailBuffer, thumbnailName)

        // Handle partner logos
        const partners = []
        let index = 0
        while (formData.get(`partners[${index}][name]`)) {
            const partnerName = formData.get(`partners[${index}][name]`)
            const partnerLogo = formData.get(`partners[${index}][logo]`) as File

            if (partnerLogo) {
                const logoBuffer = Buffer.from(await partnerLogo.arrayBuffer())
                const logoName = `${Date.now()}-${partnerLogo.name}`
                const logoUrl = await uploadToGoogleDrive(logoBuffer, logoName)

                partners.push({
                    name: partnerName,
                    logo: logoUrl
                })
            }
            index++
        }

        // Create project with the Google Drive URLs
        const project = await Project.create({
            title: formData.get("title"),
            description: formData.get("description"),
            status: formData.get("status"),
            thumbnail: thumbnailUrl,
            partners: partners,
            createdAt: new Date(),
        })

        return NextResponse.json({ success: true, data: project })
    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        )
    }
} 