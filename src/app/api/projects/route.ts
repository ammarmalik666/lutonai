import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"
import { saveLocalFile } from "@/lib/uploadFile"

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

export async function POST(req: Request) {
    try {
        await dbConnect()
        
        const formData = await req.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const status = formData.get('status') as string
        const thumbnailFile = formData.get('thumbnail') as File

        if (!title || !description || !status || !thumbnailFile) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            )
        }

        // Save thumbnail locally
        const thumbnailUrl = await saveLocalFile(thumbnailFile)

        // Process partners
        const partners = []
        let partnerIndex = 0
        
        while (formData.has(`partners[${partnerIndex}][name]`)) {
            const name = formData.get(`partners[${partnerIndex}][name]`) as string
            const logoFile = formData.get(`partners[${partnerIndex}][logo]`) as File

            if (!name || !logoFile) {
                return NextResponse.json(
                    { success: false, error: "Partner name and logo are required" },
                    { status: 400 }
                )
            }

            const logoUrl = await saveLocalFile(logoFile)
            partners.push({ name, logo: logoUrl })
            partnerIndex++
        }

        // Create project with thumbnail
        const project = await Project.create({
            title,
            thumbnail: thumbnailUrl,
            description,
            status,
            partners
        })

        return NextResponse.json({ success: true, project })
    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            { success: false, error: "Failed to create project" },
            { status: 500 }
        )
    }
} 