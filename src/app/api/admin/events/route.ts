import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Event from "@/models/Event"

export async function GET() {
    try {
        await dbConnect()
        const events = await Event.find({})
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(events)
    } catch (error) {
        console.error("Error fetching events:", error)
        return NextResponse.json(
            { error: "Error fetching events" },
            { status: 500 }
        )
    }
} 