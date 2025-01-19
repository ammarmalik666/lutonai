import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

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
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const formData = await request.formData()

        const updateData: any = {
            title: formData.get("title"),
            description: formData.get("description"),
            status: formData.get("status"),
            updatedAt: new Date(),
        }

        // Handle new thumbnail if provided
        const thumbnailFile = formData.get("thumbnail") as File
        if (thumbnailFile?.size > 0) {
            const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer())
            const thumbnailName = `${Date.now()}-${thumbnailFile.name}`
            const thumbnailUrl = await uploadToGoogleDrive(thumbnailBuffer, thumbnailName)
            updateData.thumbnail = thumbnailUrl
        }

        // Handle partner updates
        const partners = []
        let index = 0
        while (formData.get(`partners[${index}][name]`)) {
            const partnerName = formData.get(`partners[${index}][name]`)
            const partnerLogo = formData.get(`partners[${index}][logo]`) as File
            const existingLogoUrl = formData.get(`partners[${index}][existingLogo]`)

            let logoUrl = existingLogoUrl

            if (partnerLogo?.size > 0) {
                const logoBuffer = Buffer.from(await partnerLogo.arrayBuffer())
                const logoName = `${Date.now()}-${partnerLogo.name}`
                logoUrl = await uploadToGoogleDrive(logoBuffer, logoName)
            }

            partners.push({
                name: partnerName,
                logo: logoUrl
            })
            index++
        }

        updateData.partners = partners

        const project = await Project.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: project })
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json(
            { error: "Failed to update project" },
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