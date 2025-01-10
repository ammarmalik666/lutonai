"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button, Badge } from "@tremor/react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { toast } from "sonner"
import { IconBriefcase, IconMapPin, IconCalendarDue, IconTag } from "@tabler/icons-react"
import Image from "next/image"

interface Opportunity {
    id: string
    title: string
    category: string
    description: string
    type: string
    level: string
    commitment: string
    location: string
    remote: boolean
    company: string | null
    companyLogo: string | null
    url: string | null
    skills: string | null
    compensation: string | null
    startDate: string | null
    endDate: string | null
    deadline: string | null
    isActive: boolean
    featured: boolean
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    views: number
    createdAt: string
    updatedAt: string
}

export default function OpportunitiesPage() {
    const router = useRouter()
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOpportunities = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch("/api/opportunities")
            if (!response.ok) {
                throw new Error("Failed to fetch opportunities")
            }
            const data = await response.json()
            setOpportunities(data.opportunities || [])
        } catch (error) {
            console.error("Error fetching opportunities:", error)
            setError(error instanceof Error ? error.message : "Failed to load opportunities")
            toast.error(error instanceof Error ? error.message : "Failed to load opportunities")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOpportunities()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this opportunity?")) return

        try {
            const response = await fetch(`/api/opportunities/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete opportunity")
            }

            toast.success("Opportunity deleted successfully")
            fetchOpportunities()
        } catch (error) {
            console.error("Error deleting opportunity:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete opportunity")
        }
    }

    const getOpportunityStatus = (opportunity: Opportunity) => {
        if (!opportunity.isActive) {
            return { label: "Inactive", color: "red" }
        }
        if (opportunity.featured) {
            return { label: "Featured", color: "yellow" }
        }
        return { label: "Active", color: "green" }
    }

    const getTypeColor = (type: string) => {
        switch (type.toUpperCase()) {
            case "JOB":
                return "blue"
            case "INTERNSHIP":
                return "green"
            case "PROJECT":
                return "purple"
            case "MENTORSHIP":
                return "orange"
            case "RESEARCH":
                return "indigo"
            case "VOLUNTEER":
                return "pink"
            case "LEARNING":
                return "cyan"
            default:
                return "gray"
        }
    }

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.div variants={fadeIn} className="relative mb-8">
                <div className="max-w-4xl">
                    <Title className="text-5xl font-bold text-white mb-4">Opportunities</Title>
                    <Text className="text-xl text-gray-400">
                        Create and manage opportunities for the AI community.
                    </Text>
                </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-8">
                <Button
                    onClick={() => router.push("/admin/opportunities/new")}
                    size="lg"
                    className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                    icon={IconBriefcase}
                >
                    Create Opportunity
                </Button>
            </motion.div>

            {isLoading ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-lg text-gray-400">Loading opportunities...</div>
                </motion.div>
            ) : error ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-red-500 mb-4">{error}</div>
                        <Button
                            onClick={fetchOpportunities}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Try Again
                        </Button>
                    </div>
                </motion.div>
            ) : opportunities.length === 0 ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-gray-400 mb-4">No opportunities found</div>
                        <Button
                            onClick={() => router.push("/admin/opportunities/new")}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Create Your First Opportunity
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <motion.div variants={slideIn}>
                    <Card className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="text-gray-400">Opportunity Details</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Type & Category</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Location</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Status</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {opportunities.map((opportunity) => {
                                    const status = getOpportunityStatus(opportunity)
                                    return (
                                        <TableRow
                                            key={opportunity.id}
                                            className="group hover:bg-gray-800/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <Text className="font-medium text-white">
                                                            {opportunity.title}
                                                        </Text>
                                                        <Text className="text-sm text-gray-400 line-clamp-2">
                                                            {opportunity.description}
                                                        </Text>
                                                        <div className="flex items-center gap-2">
                                                            {opportunity.company && (
                                                                <Badge size="xs" color="cyan">
                                                                    {opportunity.company}
                                                                </Badge>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="xs"
                                                                    variant="secondary"
                                                                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-[#C8102E] hover:text-white"
                                                                    onClick={() => router.push(`/admin/opportunities/${opportunity.id}`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    variant="secondary"
                                                                    className="opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                                                                    onClick={() => handleDelete(opportunity.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {opportunity.companyLogo && (
                                                        <div className="relative h-12 w-12 flex-shrink-0">
                                                            <Image
                                                                src={opportunity.companyLogo}
                                                                alt={opportunity.company || ""}
                                                                fill
                                                                className="rounded-lg object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Badge size="xs" color={getTypeColor(opportunity.type)}>
                                                        {opportunity.type}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <IconTag className="h-4 w-4" />
                                                        <span>{opportunity.category}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                                        <IconMapPin className="h-4 w-4" />
                                                        <span>{opportunity.location}</span>
                                                    </div>
                                                    {opportunity.deadline && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                                            <IconCalendarDue className="h-4 w-4" />
                                                            <span>
                                                                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge size="sm" color={status.color}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
} 