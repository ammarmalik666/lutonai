import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSuccessResponse, handleApiError } from "@/lib/api-utils"

interface AdminStats {
    stats: Array<{
        name: string
        value: string
        change: string
        changeType: "positive" | "neutral" | "negative"
    }>
}

export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== "ADMIN") {
            throw new Error("Unauthorized")
        }

        // Get current date and date 30 days ago for monthly comparisons
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

        // Fetch current counts
        const [
            totalUsers,
            totalEvents,
            monthlyUsers,
            monthlyEvents,
            upcomingEvents
        ] = await Promise.all([
            // Total counts
            prisma.user.count(),
            prisma.event.count(),
            // Monthly counts (last 30 days)
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo
                    }
                }
            }),
            prisma.event.count({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo
                    }
                }
            }),
            // Upcoming events
            prisma.event.count({
                where: {
                    date: {
                        gte: now
                    }
                }
            })
        ])

        // Calculate monthly growth percentages
        const calculateGrowth = (total: number, monthly: number): string => {
            if (total === 0) return "0.0"
            const growth = (monthly / total) * 100
            return growth.toFixed(1)
        }

        // Prepare response data
        const stats: AdminStats["stats"] = [
            {
                name: "Total Users",
                value: totalUsers.toString(),
                change: `${calculateGrowth(totalUsers, monthlyUsers)}%`,
                changeType: monthlyUsers > 0 ? "positive" : "neutral"
            },
            {
                name: "Total Events",
                value: totalEvents.toString(),
                change: `${calculateGrowth(totalEvents, monthlyEvents)}%`,
                changeType: monthlyEvents > 0 ? "positive" : "neutral"
            },
            {
                name: "Upcoming Events",
                value: upcomingEvents.toString(),
                change: "N/A",
                changeType: "neutral"
            }
        ]

        return createSuccessResponse<AdminStats>({ stats })
    } catch (error) {
        return handleApiError(error)
    }
} 