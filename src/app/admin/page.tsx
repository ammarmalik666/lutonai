"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, Title, Text, Grid, Col, Metric } from "@tremor/react"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { IconArrowUpRight, IconArrowDownRight, IconLoader2 } from "@tabler/icons-react"
import Link from "next/link"
import { ErrorBoundary } from "@/components/error-boundary"

interface DashboardStats {
    data: {
        stats: Array<{
            name: string
            value: string
            change: string
            changeType: "positive" | "neutral" | "negative"
        }>
    }
}

const LoadingState = () => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-gray-900 to-black" role="status">
        <div className="flex flex-col items-center gap-4">
            <IconLoader2 className="h-8 w-8 animate-spin text-brand-200" aria-hidden="true" />
            <div className="text-lg text-white">Loading dashboard data...</div>
        </div>
    </div>
)

const ErrorState = ({ error, retry }: { error: string; retry: () => void }) => (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-gray-900 to-black" role="alert">
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-lg text-red-500">{error}</div>
            <button
                onClick={retry}
                className="rounded-lg bg-brand-200 px-4 py-2 text-sm text-white transition-colors hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:ring-offset-2"
            >
                Try Again
            </button>
        </div>
    </div>
)

const QuickActionCard = ({ name, href, description }: { name: string; href: string; description: string }) => (
    <Link href={href}>
        <motion.div
            className="group flex flex-col gap-3 rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-black p-6 text-left transition-all duration-300 hover:border-gray-700 hover:from-gray-800/50 hover:shadow-lg hover:shadow-brand-200/5 cursor-pointer focus-within:ring-2 focus-within:ring-brand-200 focus-within:ring-offset-2"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="link"
            aria-label={`${name}: ${description}`}
        >
            <Text className="font-semibold text-white group-hover:text-brand-200 transition-colors">
                {name}
            </Text>
            <Text className="text-sm text-gray-500">
                {description}
            </Text>
        </motion.div>
    </Link>
)

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch("/api/admin/stats")
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to fetch dashboard data")
            }
            const responseData = await response.json()
            setData(responseData)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            setError(error instanceof Error ? error.message : "Failed to load dashboard data")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (isLoading) return <LoadingState />
    if (error) return <ErrorState error={error} retry={fetchDashboardData} />
    if (!data) return null

    const quickActions = [
        { name: "Add Event", href: "/admin/events/new", description: "Create a new event" },
        { name: "View Events", href: "/admin/events", description: "View and manage all events" },
        { name: "Manage Users", href: "/admin/users", description: "View and manage user accounts" },
        { name: "Event Registrations", href: "/admin/registrations", description: "View event registrations" },
    ]

    return (
        <ErrorBoundary>
            <motion.div
                className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 space-y-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div variants={fadeIn} className="relative">
                    <div className="max-w-4xl">
                        <Title className="text-5xl font-bold text-white mb-4">Admin Dashboard</Title>
                        <Text className="text-xl text-gray-400">
                            Manage events, users, and registrations. Monitor key metrics and platform activity.
                        </Text>
                    </div>
                </motion.div>

                <Grid numItemsLg={3} className="gap-6">
                    {data.data.stats.map((stat) => (
                        <motion.div
                            key={stat.name}
                            variants={slideIn}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg hover:border-gray-700 hover:shadow-lg hover:shadow-brand-200/5 transition-all duration-300"
                                role="region"
                                aria-label={`${stat.name} statistics`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Text className="text-base font-medium text-gray-400">{stat.name}</Text>
                                    {stat.changeType === "positive" ? (
                                        <div className="flex items-center gap-1 text-emerald-500" aria-label={`Increased by ${stat.change}`}>
                                            <IconArrowUpRight size={20} aria-hidden="true" />
                                            <span className="text-sm font-medium">{stat.change}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-gray-500" aria-label={`Changed by ${stat.change}`}>
                                            <IconArrowDownRight size={20} aria-hidden="true" />
                                            <span className="text-sm font-medium">{stat.change}</span>
                                        </div>
                                    )}
                                </div>
                                <Metric className="text-4xl font-bold text-white">{stat.value}</Metric>
                                <Text className="mt-2 text-sm text-gray-500">Last 30 days</Text>
                            </Card>
                        </motion.div>
                    ))}
                </Grid>

                <motion.div variants={fadeIn}>
                    <Card
                        className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg hover:border-gray-700 hover:shadow-lg hover:shadow-brand-200/5 transition-all duration-300"
                        role="region"
                        aria-label="Quick actions menu"
                    >
                        <div className="mb-8">
                            <Title className="text-2xl font-bold text-white">Quick Actions</Title>
                            <Text className="text-gray-400">
                                Access frequently used features and manage your platform efficiently.
                                These shortcuts help you navigate to key administrative tasks.
                            </Text>
                        </div>
                        <Grid numItemsLg={3} className="gap-6">
                            {quickActions.map((action) => (
                                <QuickActionCard key={action.name} {...action} />
                            ))}
                        </Grid>
                    </Card>
                </motion.div>
            </motion.div>
        </ErrorBoundary>
    )
} 