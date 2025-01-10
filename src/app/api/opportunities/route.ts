import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Define the enums based on the schema
const OpportunityType = {
    JOB: 'JOB',
    INTERNSHIP: 'INTERNSHIP',
    PROJECT: 'PROJECT',
    MENTORSHIP: 'MENTORSHIP',
    RESEARCH: 'RESEARCH',
    VOLUNTEER: 'VOLUNTEER',
    LEARNING: 'LEARNING',
} as const

const OpportunityCategory = {
    AI_DEVELOPMENT: 'AI_DEVELOPMENT',
    DATA_SCIENCE: 'DATA_SCIENCE',
    BUSINESS: 'BUSINESS',
    DESIGN: 'DESIGN',
    RESEARCH: 'RESEARCH',
    EDUCATION: 'EDUCATION',
    COMMUNITY: 'COMMUNITY',
} as const

const OpportunityLevel = {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED',
    ALL_LEVELS: 'ALL_LEVELS',
} as const

const CommitmentType = {
    FULL_TIME: 'FULL_TIME',
    PART_TIME: 'PART_TIME',
    FLEXIBLE: 'FLEXIBLE',
    ONE_TIME: 'ONE_TIME',
} as const

type OpportunityTypeValue = typeof OpportunityType[keyof typeof OpportunityType]
type OpportunityCategoryValue = typeof OpportunityCategory[keyof typeof OpportunityCategory]
type OpportunityLevelValue = typeof OpportunityLevel[keyof typeof OpportunityLevel]
type CommitmentTypeValue = typeof CommitmentType[keyof typeof CommitmentType]

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") as OpportunityTypeValue | null
        const category = searchParams.get("category") as OpportunityCategoryValue | null
        const level = searchParams.get("level") as OpportunityLevelValue | null
        const remote = searchParams.get("remote")
        const featured = searchParams.get("featured")
        const active = searchParams.get("active")

        // Build where clause based on filters
        const where = {
            ...(type && { type }),
            ...(category && { category }),
            ...(level && { level }),
            ...(remote && { remote: remote === "true" }),
            ...(featured && { featured: featured === "true" }),
            ...(active && { isActive: active === "true" }),
        }

        const opportunities = await prisma.opportunity.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
        })

        return NextResponse.json({ opportunities }, { status: 200 })
    } catch (error) {
        console.error("Error fetching opportunities:", error)
        return NextResponse.json(
            { error: { message: "Failed to fetch opportunities" } },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json()
        console.log("Received opportunity data:", json) // Debug log

        // Validate required fields and log which ones are missing
        const requiredFields = ['title', 'description', 'type', 'category', 'level', 'commitment', 'location', 'company', 'skills']
        const missingFields = requiredFields.filter(field => !json[field])

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields) // Debug log
            return NextResponse.json(
                {
                    error: {
                        message: `Missing required fields: ${missingFields.join(", ")}`,
                        fields: missingFields
                    },
                },
                { status: 400 }
            )
        }

        // Validate enum values with better error handling
        const enumValidations = [
            { value: json.type, validValues: OpportunityType, field: 'type' },
            { value: json.category, validValues: OpportunityCategory, field: 'category' },
            { value: json.level, validValues: OpportunityLevel, field: 'level' },
            { value: json.commitment, validValues: CommitmentType, field: 'commitment' }
        ]

        for (const validation of enumValidations) {
            if (!Object.values(validation.validValues).includes(validation.value)) {
                console.log(`Invalid ${validation.field}:`, validation.value) // Debug log
                return NextResponse.json(
                    {
                        error: {
                            message: `Invalid ${validation.field}. Must be one of: ${Object.values(validation.validValues).join(", ")}`,
                            field: validation.field,
                            receivedValue: validation.value,
                            validValues: Object.values(validation.validValues)
                        },
                    },
                    { status: 400 }
                )
            }
        }

        // Process dates if they exist
        const dateFields = ['startDate', 'endDate', 'deadline']
        const processedDates: Record<string, Date | undefined> = {}

        for (const field of dateFields) {
            if (json[field]) {
                try {
                    processedDates[field] = new Date(json[field])
                    if (isNaN(processedDates[field]!.getTime())) {
                        throw new Error(`Invalid date format for ${field}`)
                    }
                } catch (error) {
                    console.log(`Date parsing error for ${field}:`, error) // Debug log
                    return NextResponse.json(
                        {
                            error: {
                                message: `Invalid date format for ${field}. Please use YYYY-MM-DD format.`,
                                field: field,
                                receivedValue: json[field]
                            },
                        },
                        { status: 400 }
                    )
                }
            }
        }

        // Create the opportunity with validated data
        const opportunity = await prisma.opportunity.create({
            data: {
                title: json.title.trim(),
                description: json.description.trim(),
                type: json.type as OpportunityTypeValue,
                category: json.category as OpportunityCategoryValue,
                level: json.level as OpportunityLevelValue,
                commitment: json.commitment as CommitmentTypeValue,
                location: json.location.trim(),
                remote: json.remote ?? true,
                company: json.company.trim(),
                skills: json.skills.trim(),
                isActive: json.isActive ?? true,
                featured: json.featured ?? false,
                views: 0,
                ...(json.companyLogo && { companyLogo: json.companyLogo.trim() }),
                ...(json.url && { url: json.url.trim() }),
                ...(json.compensation && { compensation: json.compensation.trim() }),
                ...(processedDates.startDate && { startDate: processedDates.startDate }),
                ...(processedDates.endDate && { endDate: processedDates.endDate }),
                ...(processedDates.deadline && { deadline: processedDates.deadline }),
                ...(json.contactName && { contactName: json.contactName.trim() }),
                ...(json.contactEmail && { contactEmail: json.contactEmail.trim() }),
                ...(json.contactPhone && { contactPhone: json.contactPhone.trim() }),
            },
        })

        console.log("Created opportunity:", opportunity) // Debug log
        return NextResponse.json({ opportunity }, { status: 201 })
    } catch (error) {
        console.error("Error creating opportunity:", error)
        // Return more detailed error information
        return NextResponse.json(
            {
                error: {
                    message: "Failed to create opportunity",
                    details: error instanceof Error ? error.message : String(error)
                }
            },
            { status: 500 }
        )
    }
}