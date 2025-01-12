import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"

export async function POST(req: Request) {
    try {
        await dbConnect()

        const formData = await req.formData()
        
        // Handle file upload
        const file = formData.get("thumbnail") as File
        if (!file) {
            throw new Error("No thumbnail provided")
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        try {
            await writeFile(path.join(uploadsDir, "test.txt"), "")
        } catch (error) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Save thumbnail
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${Date.now()}-${file.name}`
        const filepath = path.join(uploadsDir, filename)
        await writeFile(filepath, buffer)

        // Create event with thumbnail URL
        const event = await Event.create({
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
            thumbnail: `/uploads/${filename}`,
            createdAt: new Date(),
        })

        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error("Error creating event:", error)
        return NextResponse.json(
            { error: "Error creating event" },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect()
        
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        
        // Calculate skip for pagination
        const skip = (page - 1) * limit

        // Fetch all events without status filter
        const events = await Event.find({})
            .sort({ startDateTime: 1 })
            .skip(skip)
            .limit(limit + 1)

        // Check if there are more events
        const hasMore = events.length > limit
        const eventsToReturn = hasMore ? events.slice(0, -1) : events

        // Transform the data
        const transformedEvents = eventsToReturn.map(event => ({
            _id: event._id,
            title: event.title,
            description: event.description,
            date: event.startDateTime,
            endDate: event.endDateTime,
            type: event.eventType,
            venue: event.venue,
            capacity: event.capacity,
            price: event.price,
            image: event.thumbnail,
            location: `${event.city || ''}, ${event.country || ''}`.trim(),
        }))

        return NextResponse.json({
            events: transformedEvents,
            hasMore
        })
    } catch (error) {
        console.error("Error fetching events:", error)
        return NextResponse.json(
            { error: "Error fetching events" },
            { status: 500 }
        )
    }
} 