import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema for contact form
const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate the request body
        const validatedData = contactSchema.parse(body)

        // Create a new contact entry
        const contact = await prisma.contact.create({
            data: validatedData,
        })

        return NextResponse.json(
            { message: "Message sent successfully", data: contact },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error in contact form submission:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid form data", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        )
    }
}