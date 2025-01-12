"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"
import {
    MapPinIcon,
    CalendarIcon,
    BriefcaseIcon,
    GlobeAltIcon,
    EnvelopeIcon,
    PhoneIcon,
    LinkIcon,
    SignalIcon
} from "@heroicons/react/24/outline"

interface Opportunity {
    _id: string
    title: string
    description: string
    type: string
    category: string
    level: string
    commitment: string
    skills: string[]
    location: string
    companyLogo: string
    applicationUrl: string
    startDate?: string
    endDate?: string
    applicationDeadline?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    remoteAvailable: boolean
    createdAt: string
}

export default function OpportunityDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`/api/opportunities/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch opportunity")
                const data = await response.json()
                setOpportunity(data)
            } catch (error) {
                toast.error("Error loading opportunity")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOpportunity()
    }, [params.id])

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/opportunities/${params.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete opportunity")

            toast.success("Opportunity deleted successfully")
            router.push("/admin/opportunities")
        } catch (error) {
            toast.error("Error deleting opportunity")
            console.error(error)
        }
    }

    const getTypeColor = (type: string) => {
        const colors = {
            Job: "bg-blue-100 text-blue-800",
            Internship: "bg-green-100 text-green-800",
            Project: "bg-purple-100 text-purple-800",
            Mentorship: "bg-yellow-100 text-yellow-800",
            Research: "bg-pink-100 text-pink-800",
            Volunteer: "bg-orange-100 text-orange-800",
            Learning: "bg-indigo-100 text-indigo-800"
        }
        return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
    }

    if (isLoading || !opportunity) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <article className="bg-[#111111] rounded-xl overflow-hidden">
                {/* Header with Company Logo */}
                <div className="relative h-48 bg-[#0A0A0A]">
                    <Image
                        src={opportunity.companyLogo}
                        alt={opportunity.title}
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Title and Type */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(opportunity.type)}`}>
                                {opportunity.type}
                            </span>
                            {opportunity.remoteAvailable && (
                                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Remote Available
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {opportunity.title}
                        </h1>
                        <div className="text-sm text-gray-400">
                            Posted on {format(new Date(opportunity.createdAt), "MMMM d, yyyy")}
                        </div>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 text-gray-300">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5" />
                                <span>{opportunity.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BriefcaseIcon className="h-5 w-5" />
                                <span>{opportunity.commitment}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <SignalIcon className="h-5 w-5" />
                                <span>{opportunity.level}</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-gray-300">
                            {opportunity.applicationDeadline && (
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    <span>Deadline: {format(new Date(opportunity.applicationDeadline), "MMMM d, yyyy")}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-5 w-5" />
                                <a 
                                    href={opportunity.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-red-500 hover:text-red-400 transition-colors"
                                >
                                    Apply Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                        <p className="text-gray-300 whitespace-pre-wrap">
                            {opportunity.description}
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {opportunity.skills.map((skill, index) => (
                                <span 
                                    key={index}
                                    className="bg-[#222222] text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Information */}
                    {(opportunity.contactName || opportunity.contactEmail || opportunity.contactPhone) && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                            <div className="space-y-2 text-gray-300">
                                {opportunity.contactName && (
                                    <p>
                                        <strong className="text-white">Contact:</strong>{" "}
                                        {opportunity.contactName}
                                    </p>
                                )}
                                {opportunity.contactEmail && (
                                    <p>
                                        <strong className="text-white">Email:</strong>{" "}
                                        <a 
                                            href={`mailto:${opportunity.contactEmail}`}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            {opportunity.contactEmail}
                                        </a>
                                    </p>
                                )}
                                {opportunity.contactPhone && (
                                    <p>
                                        <strong className="text-white">Phone:</strong>{" "}
                                        <a 
                                            href={`tel:${opportunity.contactPhone}`}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            {opportunity.contactPhone}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => router.push(`/admin/opportunities/edit/${opportunity._id}`)}
                    className="px-4 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                >
                    Edit Opportunity
                </button>
                <button
                    onClick={() => setDeleteModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Delete Opportunity
                </button>
            </div>

            <DeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title={opportunity.title}
            />
        </div>
    )
} 