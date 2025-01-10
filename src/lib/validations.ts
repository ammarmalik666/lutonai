import { z } from "zod"
import { UserRole } from "@prisma/client"

// User validations
export const userSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email(),
    role: z.nativeEnum(UserRole).optional(),
})

export const userUpdateSchema = userSchema.partial()

// Event validations
export const eventSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1),
    date: z.string().datetime(),
    location: z.string().min(1).max(200),
    image: z.string().url().optional(),
})

export const eventUpdateSchema = eventSchema.partial()

// Event registration validations
export const eventRegistrationSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    eventId: z.string().min(1),
    phone: z.string().min(10).max(20).optional(),
    organization: z.string().min(1).max(100).optional(),
    dietaryRequirements: z.string().max(500).optional(),
    specialRequirements: z.string().max(500).optional(),
}) 