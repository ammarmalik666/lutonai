import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Registration from "@/models/Registration"

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        const registration = await Registration.findByIdAndDelete(params.id)

        if (!registration) {
            return NextResponse.json(
                { error: "Registration not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting registration:", error)
        return NextResponse.json(
            { error: "Failed to delete registration" },
            { status: 500 }
        )
    }
} 