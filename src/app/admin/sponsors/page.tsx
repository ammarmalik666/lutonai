"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Card,
    Title,
    Text,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Badge,
    Button,
} from "@tremor/react"
import { toast } from "sonner"
import { fadeIn } from "@/lib/animations"

interface Sponsor {
    id: string
    name: string
    description: string
    website?: string | null
    logo?: string | null
    tier: string
    startDate: string
    endDate?: string | null
    isActive: boolean
    contactName?: string | null
    contactEmail?: string | null
    contactPhone?: string | null
    createdAt: string
    updatedAt: string
}

function getTierColor(tier: string) {
    switch (tier.toUpperCase()) {
        case "PLATINUM":
            return "slate"
        case "GOLD":
            return "yellow"
        case "SILVER":
            return "gray"
        case "BRONZE":
            return "orange"
        default:
            return "gray"
    }
}

export default function SponsorsPage() {
    const router = useRouter()
    const [sponsors, setSponsors] = useState<Sponsor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchSponsors()
    }, [])

    const fetchSponsors = async () => {
        try {
            const response = await fetch("/api/sponsors")
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to fetch sponsors")
            }

            setSponsors(data.data)
            setError(null)
        } catch (error) {
            console.error("Error fetching sponsors:", error)
            setError(error instanceof Error ? error.message : "Failed to fetch sponsors")
            toast.error(error instanceof Error ? error.message : "Failed to fetch sponsors")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sponsor?")) {
            return
        }

        try {
            const response = await fetch(`/api/sponsors/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error?.message || "Failed to delete sponsor")
            }

            toast.success("Sponsor deleted successfully")
            fetchSponsors()
        } catch (error) {
            console.error("Error deleting sponsor:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete sponsor")
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
                        <div className="h-4 w-96 bg-gray-800 rounded mb-8"></div>
                        <div className="h-[600px] bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                        <p className="text-gray-400 mb-4">{error}</p>
                        <Button onClick={fetchSponsors}>Try Again</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Title className="text-4xl font-bold text-white">Sponsors</Title>
                        <Text className="text-xl text-gray-400">
                            Manage your sponsors and partnerships.
                        </Text>
                    </div>
                    <Button
                        onClick={() => router.push("/admin/sponsors/new")}
                        className="bg-brand-600 text-white hover:bg-brand-700"
                    >
                        Add Sponsor
                    </Button>
                </div>

                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Tier</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Start Date</TableHeaderCell>
                                <TableHeaderCell>End Date</TableHeaderCell>
                                <TableHeaderCell>Actions</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sponsors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <Text className="text-gray-400">
                                            No sponsors found. Add your first sponsor to get started.
                                        </Text>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sponsors.map((sponsor) => (
                                    <TableRow key={sponsor.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {sponsor.logo && (
                                                    <img
                                                        src={sponsor.logo}
                                                        alt={`${sponsor.name} logo`}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {sponsor.name}
                                                    </div>
                                                    {sponsor.website && (
                                                        <a
                                                            href={sponsor.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-gray-400 hover:text-brand-400"
                                                        >
                                                            {(() => {
                                                                try {
                                                                    return new URL(sponsor.website).hostname
                                                                } catch {
                                                                    return sponsor.website
                                                                }
                                                            })()}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={getTierColor(sponsor.tier)}>
                                                {sponsor.tier}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={sponsor.isActive ? "green" : "red"}>
                                                {sponsor.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(sponsor.startDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {sponsor.endDate
                                                ? new Date(sponsor.endDate).toLocaleDateString()
                                                : "Ongoing"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="xs"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        router.push(`/admin/sponsors/${sponsor.id}`)
                                                    }
                                                    className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="secondary"
                                                    onClick={() => handleDelete(sponsor.id)}
                                                    className="bg-red-700 text-gray-100 hover:bg-red-600"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </motion.div>
    )
} 