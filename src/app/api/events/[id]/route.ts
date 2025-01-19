import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const event = await Event.findById(params.id)
        
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching event" },
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
            startDateTime: formData.get("startDateTime"),
            endDateTime: formData.get("endDateTime"),
            eventType: formData.get("eventType"),
            venue: formData.get("venue"),
            address: formData.get("address"),
            city: formData.get("city"),
            country: formData.get("country"),
            organizers: formData.get("organizers"),
            contactEmail: formData.get("contactEmail"),
            contactPhone: formData.get("contactPhone"),
            capacity: formData.get("capacity"),
            price: formData.get("price"),
            registrationDeadline: formData.get("registrationDeadline"),
            updatedAt: new Date(),
        }

        // Handle new thumbnail if provided
        const file = formData.get("thumbnail") as File
        if (file?.size > 0) {
            const fileBuffer = Buffer.from(await file.arrayBuffer())
            const fileName = `${Date.now()}-${file.name}`
            const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)
            updateData.thumbnail = fileUrl
        }

        const event = await Event.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true }
        )

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: event })
    } catch (error) {
        console.error("Error updating event:", error)
        return NextResponse.json(
            { error: "Failed to update event" },
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
        
        const event = await Event.findById(params.id)
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        // Delete thumbnail file
        if (event.thumbnail) {
            const filepath = path.join(process.cwd(), "public", event.thumbnail)
            try {
                await unlink(filepath)
            } catch (error) {
                console.error("Error deleting thumbnail:", error)
            }
        }

        // Delete event from database
        await Event.findByIdAndDelete(params.id)

        return NextResponse.json(
            { message: "Event deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting event:", error)
        return NextResponse.json(
            { error: "Error deleting event" },
            { status: 500 }
        )
    }
} 