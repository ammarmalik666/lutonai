import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = search
        ? {
            OR: [
                { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
                { email: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
            ],
        }
        : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: "asc" as Prisma.SortOrder },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        }),
        prisma.user.count({ where }),
    ])

    return NextResponse.json({
        users,
        total,
        pages: Math.ceil(total / limit),
    })
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { id, name, email, role } = json

    const user = await prisma.user.update({
        where: { id },
        data: {
            name,
            email,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    })

    return NextResponse.json(user)
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
        return new NextResponse("Missing user ID", { status: 400 })
    }

    // Prevent deleting the last admin user
    const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
    })

    const userToDelete = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
    })

    if (adminCount === 1 && userToDelete?.role === "ADMIN") {
        return new NextResponse(
            "Cannot delete the last admin user",
            { status: 400 }
        )
    }

    await prisma.user.delete({
        where: { id },
    })

    return new NextResponse(null, { status: 204 })
} 