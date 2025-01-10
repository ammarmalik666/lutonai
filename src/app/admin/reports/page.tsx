"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, Title, Text } from "@tremor/react"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface ReportData {
    totalUsers: number
    totalEvents: number
    totalPosts: number
    totalSponsors: number
    monthlyStats: {
        users: number[]
        events: number[]
        posts: number[]
    }
}

export default function ReportsPage() {
    const [data, setData] = useState<ReportData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchReportData()
    }, [])

    const fetchReportData = async () => {
        try {
            const response = await fetch("/api/admin/stats")
            if (!response.ok) {
                throw new Error("Failed to fetch report data")
            }
            const data = await response.json()
            setData(data)
        } catch (error) {
            setError("Failed to load report data")
            console.error("Error fetching report data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-lg text-white">Loading reports...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-8 min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div variants={fadeIn}>
                    <h1 className="text-3xl font-bold text-white">Reports</h1>
                    <p className="mt-2 text-gray-400">View detailed analytics and reports.</p>
                </motion.div>
            </div>

            {/* Reports Grid */}
            <motion.div variants={slideIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overview Card */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <Title className="text-xl font-bold text-white mb-4">Overview</Title>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">Total Users</Text>
                            <Text className="text-white font-semibold">{data?.totalUsers || 0}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">Total Events</Text>
                            <Text className="text-white font-semibold">{data?.totalEvents || 0}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">Total Posts</Text>
                            <Text className="text-white font-semibold">{data?.totalPosts || 0}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">Total Sponsors</Text>
                            <Text className="text-white font-semibold">{data?.totalSponsors || 0}</Text>
                        </div>
                    </div>
                </Card>

                {/* Monthly Growth Card */}
                <Card className="p-6 border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                    <Title className="text-xl font-bold text-white mb-4">Monthly Growth</Title>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">New Users</Text>
                            <Text className="text-white font-semibold">
                                {data?.monthlyStats.users[data.monthlyStats.users.length - 1] || 0}
                            </Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">New Events</Text>
                            <Text className="text-white font-semibold">
                                {data?.monthlyStats.events[data.monthlyStats.events.length - 1] || 0}
                            </Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text className="text-gray-400">New Posts</Text>
                            <Text className="text-white font-semibold">
                                {data?.monthlyStats.posts[data.monthlyStats.posts.length - 1] || 0}
                            </Text>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
} 