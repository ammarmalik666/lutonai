import { NextResponse } from "next/server"
import { ZodError, z } from "zod"
import { logger } from "./logger"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export class ApiError extends Error {
    constructor(message: string, public statusCode: number = 500) {
        super(message)
        this.name = 'ApiError'
    }
}

interface ErrorResponse {
    error: {
        message: string
        code: string
        details?: any
    }
}

interface SuccessResponse<T> {
    data: T
}

export function createSuccessResponse<T>(data: T, status = 200): NextResponse<SuccessResponse<T>> {
    return NextResponse.json({ data }, { status })
}

export function createErrorResponse(
    message: string,
    code: string,
    status: number,
    details?: any
): NextResponse<ErrorResponse> {
    const error = {
        message,
        code,
        ...(details && { details }),
    }

    return NextResponse.json({ error }, { status })
}

export function handleApiError(error: unknown, request?: Request): NextResponse {
    if (request) {
        logger.logApiRequest(request, error as Error)
    } else {
        logger.error("API Error", error as Error)
    }

    if (error instanceof ZodError) {
        return createErrorResponse(
            "Validation error",
            "VALIDATION_ERROR",
            400,
            error.errors
        )
    }

    if (error instanceof ApiError) {
        return createErrorResponse(
            error.message,
            error.name.toUpperCase(),
            error.statusCode
        )
    }

    if (error instanceof Error) {
        // Handle known error types
        switch (error.message) {
            case "Unauthorized":
                return createErrorResponse(
                    "Authentication required",
                    "UNAUTHORIZED",
                    401
                )
            case "Forbidden":
                return createErrorResponse(
                    "Insufficient permissions",
                    "FORBIDDEN",
                    403
                )
            case "Not Found":
                return createErrorResponse(
                    "Resource not found",
                    "NOT_FOUND",
                    404
                )
            default:
                // Log unexpected errors but don't expose details to client
                logger.error("Unexpected error", error)
                return createErrorResponse(
                    "Internal server error",
                    "INTERNAL_SERVER_ERROR",
                    500
                )
        }
    }

    return createErrorResponse(
        "Internal server error",
        "INTERNAL_SERVER_ERROR",
        500
    )
}

export async function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
    try {
        return await schema.parseAsync(data)
    } catch (error) {
        if (error instanceof ZodError) {
            const details = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
            throw new Error("Validation error", { cause: { details } })
        }
        throw error
    }
}

export function withAuth(
    handler: (request: Request, session: any) => Promise<Response>,
    request: Request
) {
    return async () => {
        try {
            const session = await getServerSession(authOptions)

            if (!session?.user) {
                throw new Error("Unauthorized")
            }

            return handler(request, session)
        } catch (error) {
            return handleApiError(error, request)
        }
    }
}

// Common validation schemas
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
})

export const searchSchema = z.object({
    query: z.string().trim().min(1).max(100),
})

export const idSchema = z.object({
    id: z.string().trim().min(1),
}) 