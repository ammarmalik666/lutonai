import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Registration from "@/models/Registration"

export async function GET() {
    try {
        await dbConnect()
        const registrations = await Registration.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .lean()

        return NextResponse.json(registrations)
    } catch (error) {
        console.error("Error fetching registrations:", error)
        return NextResponse.json(
            { error: "Failed to fetch registrations" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json()
        await dbConnect()
        
        const deletedRegistration = await Registration.findByIdAndDelete(id)
        if (!deletedRegistration) {
            return NextResponse.json(
                { error: "Registration not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Registration deleted successfully" })
    } catch (error) {
        console.error("Error deleting registration:", error)
        return NextResponse.json(
            { error: "Failed to delete registration" },
            { status: 500 }
        )
    }
} 