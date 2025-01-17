import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
import dbConnect from "@/lib/mongodb"

import { ObjectId } from "mongodb"
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { db } = await dbConnect()
        
        // First, get the event to find its thumbnail path
        const event = await db.collection("events").findOne({
            _id: new ObjectId(params.id)
        })

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        // Delete the thumbnail if it exists and is not the default image
        if (event.thumbnail && !event.thumbnail.includes('default-event.jpg')) {
            const thumbnailPath = path.join(process.cwd(), 'public', event.thumbnail)
            try {
                await fs.unlink(thumbnailPath)
            } catch (error) {
                console.error("Error deleting thumbnail:", error)
                // Continue with event deletion even if thumbnail deletion fails
            }
        }

        // Delete the event from database
        const result = await db.collection("events").deleteOne({
            _id: new ObjectId(params.id)
        })

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Event deleted successfully" })
    } catch (error) {
        console.error("Error deleting event:", error)
        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        )
    }
}