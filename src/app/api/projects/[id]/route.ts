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
        // await dbConnect()
        const formData = await request.formData()

        const updateData: any = {
            title: formData.get("title"),
            description: formData.get("description"),
            status: formData.get("status"),
        }

        // Handle thumbnail
        const thumbnail = formData.get("thumbnail") as File | null
        const thumbnailUrl = formData.get("thumbnailUrl")
        
        if (thumbnail instanceof File) {
            const buffer = Buffer.from(await thumbnail.arrayBuffer())
            const uploadedThumbnailUrl = await uploadToGoogleDrive(buffer, thumbnail.name)
            updateData.thumbnail = uploadedThumbnailUrl
        } else if (thumbnailUrl) {
            updateData.thumbnail = thumbnailUrl
        }

        // Handle partners
        const partners: any[] = []
        let index = 0
        
        while (formData.has(`partners[${index}][name]`)) {
            const partnerName = formData.get(`partners[${index}][name]`)
            const partnerLogo = formData.get(`partners[${index}][logo]`) as File | null
            const partnerLogoUrl = formData.get(`partners[${index}][logoUrl]`)
            
            let logoUrl = partnerLogoUrl

            if (partnerLogo instanceof File) {
                const buffer = Buffer.from(await partnerLogo.arrayBuffer())
                logoUrl = await uploadToGoogleDrive(buffer, partnerLogo.name)
            }

            partners.push({
                name: partnerName,
                logo: logoUrl
            })
            
            index++
        }

        updateData.partners = partners

        // await dbConnect()
        // return NextResponse.json({ success: true, data:updateData })

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

        return NextResponse.json({ success: true, project })
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