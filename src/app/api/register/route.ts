import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Registration from "@/models/Registration"
import * as z from "zod"
import { sendWelcomeEmail } from "@/lib/email"

const registerSchema = z.object({
  firstName: z.string().min(3).max(20),
  lastName: z.string().min(3).max(20),
  email: z.string().email(),
  organization: z.string().min(3).max(50).optional(),
  areaOfInterest: z.string().min(3).max(150).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = registerSchema.parse(body)

    // Connect to database
    await dbConnect()

    // Check if email already exists
    const existingUser = await Registration.findOne({ email: validatedData.email })
    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      )
    }

    // Create new registration
    const registration = await Registration.create({
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      organization: validatedData.organization || "",
      areaOfInterest: validatedData.areaOfInterest || "",
    })

    // Send welcome email
    await sendWelcomeEmail(
      `${validatedData.firstName} ${validatedData.lastName}`,
      validatedData.email
    )

    return NextResponse.json(
      { message: "Registration successful", registration },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data provided" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 