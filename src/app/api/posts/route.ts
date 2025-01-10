import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { createSuccessResponse, createErrorResponse, handleApiError } from "@/lib/api-utils"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Transform the posts to match the expected interface
        const transformedPosts = posts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }))

        return createSuccessResponse({ posts: transformedPosts })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return createErrorResponse("Authentication required", "UNAUTHORIZED", 401)
    }

    try {
        const json = await request.json()
        const { title, content, category, tags, images, videoUrl, published } = json

        const post = await prisma.post.create({
            data: {
                title,
                content,
                category: category || null,
                tags: tags || null,
                images: images || null,
                videoUrl: videoUrl || null,
                published: published || false,
                authorId: session.user.id,
            },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        // Transform the response to match the interface
        const transformedPost = {
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }

        return createSuccessResponse(transformedPost, 201)
    } catch (error) {
        return handleApiError(error)
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return createErrorResponse("Authentication required", "UNAUTHORIZED", 401)
    }

    try {
        const post = await prisma.post.delete({
            where: {
                id: params.id,
            },
        })

        return createSuccessResponse(post)
    } catch (error) {
        return handleApiError(error)
    }
}