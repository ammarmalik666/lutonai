import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { createSuccessResponse, createErrorResponse, handleApiError } from "@/lib/api-utils"

interface RouteParams {
    params: { id: string }
}

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const post = await prisma.post.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        if (!post) {
            return createErrorResponse("Post not found", "NOT_FOUND", 404)
        }

        // Convert comma-separated strings to arrays
        const formattedPost = {
            ...post,
            tags: post.tags ? post.tags.split(",") : [],
            images: post.images ? post.images.split(",") : [],
        }

        return createSuccessResponse(formattedPost)
    } catch (error) {
        return handleApiError(error)
    }
}

interface UpdatePostInput {
    title: string
    content: string
    category?: string
    tags?: string[]
    images?: string[]
    videoUrl?: string
    published?: boolean
}

export async function PUT(
    request: Request,
    { params }: RouteParams
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return createErrorResponse("Authentication required", "UNAUTHORIZED", 401)
    }

    try {
        const json = await request.json()
        const { title, content, category, tags, images, videoUrl, published } = json as UpdatePostInput

        const post = await prisma.post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                category,
                tags: Array.isArray(tags) ? tags.join(",") : tags,
                images: Array.isArray(images) ? images.join(",") : images,
                videoUrl,
                published,
            },
        })

        return createSuccessResponse(post)
    } catch (error) {
        return handleApiError(error)
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteParams
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return createErrorResponse("Authentication required", "UNAUTHORIZED", 401)
    }

    try {
        await prisma.post.delete({
            where: { id: params.id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return handleApiError(error)
    }
} 