import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"
import { saveLocalFile } from "@/lib/uploadFile"

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const project = await Project.findById(params.id)
        
        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, project })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Error fetching project" },
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
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const status = formData.get('status') as string
        const thumbnailFile = formData.get('thumbnail') as File | null
        const thumbnailUrl = formData.get('thumbnailUrl') as string | null

        // Handle thumbnail
        let thumbnail = thumbnailUrl
        if (thumbnailFile) {
            thumbnail = await saveLocalFile(thumbnailFile)
        }

        // Process partners
        const partners = []
        let partnerIndex = 0
        
        while (formData.has(`partners[${partnerIndex}][name]`)) {
            const name = formData.get(`partners[${partnerIndex}][name]`) as string
            const logoFile = formData.get(`partners[${partnerIndex}][logo]`) as File | null
            const logoUrl = formData.get(`partners[${partnerIndex}][logoUrl]`) as string | null

            let logo = logoUrl
            if (logoFile) {
                logo = await saveLocalFile(logoFile)
            }

            if (!name || (!logo && !logoUrl)) {
                return NextResponse.json(
                    { success: false, error: "Partner name and logo are required" },
                    { status: 400 }
                )
            }

            partners.push({ name, logo: logo || logoUrl })
            partnerIndex++
        }

        const updatedProject = await Project.findByIdAndUpdate(
            params.id,
            {
                title,
                description,
                status,
                thumbnail: thumbnail || thumbnailUrl,
                partners
            },
            { new: true }
        )

        if (!updatedProject) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, project: updatedProject })
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json(
            { success: false, error: "Error updating project" },
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
        const project = await Project.findByIdAndDelete(params.id)
        
        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Error deleting project" },
            { status: 500 }
        )
    }
} 