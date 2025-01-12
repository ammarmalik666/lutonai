import { NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"

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
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        
        const formData = await req.formData()
        const event = await Event.findById(params.id)
        
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        // Handle new thumbnail if provided
        const file = formData.get("thumbnail") as File
        let thumbnailPath = event.thumbnail // Keep existing thumbnail by default

        if (file) {
            // Delete old thumbnail
            if (event.thumbnail) {
                const oldPath = path.join(process.cwd(), "public", event.thumbnail)
                try {
                    await unlink(oldPath)
                } catch (error) {
                    console.error("Error deleting old thumbnail:", error)
                }
            }

            // Save new thumbnail
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filename = `${Date.now()}-${file.name}`
            const filepath = path.join(process.cwd(), "public/uploads", filename)
            await writeFile(filepath, buffer)
            thumbnailPath = `/uploads/${filename}`
        }

        // Update event
        const updatedEvent = await Event.findByIdAndUpdate(
            params.id,
            {
                title: formData.get("title"),
                description: formData.get("description"),
                startDateTime: new Date(formData.get("startDateTime") as string),
                endDateTime: new Date(formData.get("endDateTime") as string),
                eventType: formData.get("eventType"),
                venue: formData.get("venue"),
                address: formData.get("address"),
                city: formData.get("city"),
                country: formData.get("country"),
                organizers: formData.get("organizers"),
                contactEmail: formData.get("contactEmail"),
                contactPhone: formData.get("contactPhone"),
                capacity: parseInt(formData.get("capacity") as string),
                price: parseFloat(formData.get("price") as string),
                registrationDeadline: new Date(formData.get("registrationDeadline") as string),
                thumbnail: thumbnailPath,
            },
            { new: true }
        )

        return NextResponse.json(updatedEvent)
    } catch (error) {
        console.error("Error updating event:", error)
        return NextResponse.json(
            { error: "Error updating event" },
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