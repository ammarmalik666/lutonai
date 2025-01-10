import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    })

    if (!user) {
        return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { name, email, role } = json

    // Prevent changing the role of the last admin user
    if (role !== "ADMIN") {
        const adminCount = await prisma.user.count({
            where: { role: "ADMIN" },
        })

        const currentUser = await prisma.user.findUnique({
            where: { id: params.id },
            select: { role: true },
        })

        if (adminCount === 1 && currentUser?.role === "ADMIN") {
            return new NextResponse(
                "Cannot change role of the last admin user",
                { status: 400 }
            )
        }
    }

    const user = await prisma.user.update({
        where: { id: params.id },
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
        },
    })

    return NextResponse.json(user)
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // Prevent deleting the last admin user
    const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
    })

    const userToDelete = await prisma.user.findUnique({
        where: { id: params.id },
        select: { role: true },
    })

    if (adminCount === 1 && userToDelete?.role === "ADMIN") {
        return new NextResponse(
            "Cannot delete the last admin user",
            { status: 400 }
        )
    }

    await prisma.user.delete({
        where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
} 