import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"
import { uploadToGoogleDrive } from '@/utils/googleDrive'

export async function POST(request: Request) {
    try {
        await dbConnect()
        const formData = await request.formData()

        // Handle thumbnail upload
        const file = formData.get("thumbnail") as File
        if (!file) {
            throw new Error("No thumbnail provided")
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const fileName = `${Date.now()}-${file.name}`
        const fileUrl = await uploadToGoogleDrive(fileBuffer, fileName)

        // Create event with the Google Drive URL
        const event = await Event.create({
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
            thumbnail: fileUrl,  // Save the Google Drive URL
        })

        return NextResponse.json({ success: true, data: event })
    } catch (error) {
        console.error("Error creating event:", error)
        return NextResponse.json(
            { error: "Failed to create event" },
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