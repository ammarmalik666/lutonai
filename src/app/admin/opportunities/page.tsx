"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Title } from "@tremor/react"
import Image from "next/image"
import { 
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon,
    MapPinIcon,
    CalendarIcon,
    BriefcaseIcon
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"

interface Opportunity {
    _id: string
    title: string
    companyLogo: string
    type: string
    category: string
    location: string
    commitment: string
    applicationDeadline?: string
    remoteAvailable: boolean
}

export default function Opportunities() {
    const router = useRouter()
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        opportunityId: "",
        opportunityTitle: ""
    })

    const fetchOpportunities = useCallback(async (query: string) => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/opportunities?search=${query}`)
            if (!response.ok) throw new Error("Failed to fetch opportunities")
            const data = await response.json()
            setOpportunities(data.opportunities)
        } catch (error) {
            toast.error("Error loading opportunities")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOpportunities(searchQuery)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery, fetchOpportunities])

    const handleDeleteClick = (opportunityId: string, opportunityTitle: string) => {
        setDeleteModal({
            isOpen: true,
            opportunityId,
            opportunityTitle
        })
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/opportunities/${deleteModal.opportunityId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete opportunity")

            toast.success("Opportunity deleted successfully")
            fetchOpportunities(searchQuery)
        } catch (error) {
            toast.error("Error deleting opportunity")
            console.error(error)
        } finally {
            setDeleteModal({ isOpen: false, opportunityId: "", opportunityTitle: "" })
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <Title className="text-2xl md:text-3xl font-bold text-white">Opportunities</Title>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search opportunities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[300px] bg-[#111111] border border-[#222222] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500"
                            autoComplete="off"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Add New Button */}
                    <button 
                        onClick={() => router.push('/admin/opportunities/create')}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Add New Opportunity</span>
                    </button>
                </div>
            </div>

            {/* Opportunities Grid */}
            {opportunities.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    <div className="mb-4">No opportunities found</div>
                    <button
                        onClick={() => router.push('/admin/opportunities/create')}
                        className="text-red-500 hover:text-red-400 transition-colors"
                    >
                        Add your first opportunity
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {opportunities.map((opportunity) => (
                        <div 
                            key={opportunity._id}
                            className="group bg-[#111111] rounded-xl overflow-hidden"
                        >
                            {/* Company Logo */}
                            <div 
                                className="relative h-48 bg-[#0A0A0A]"
                                onClick={() => router.push(`/admin/opportunities/view/${opportunity._id}`)}
                            >
                                <Image
                                    src={opportunity.companyLogo}
                                    alt={opportunity.title}
                                    fill
                                    className="cursor-pointer"
                                />
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/admin/opportunities/edit/${opportunity._id}`);
                                        }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 text-white" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(opportunity._id, opportunity.title);
                                        }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(opportunity.type)}`}>
                                        {opportunity.type}
                                    </span>
                                    {opportunity.remoteAvailable && (
                                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Remote
                                        </span>
                                    )}
                                </div>
                                <h3 
                                    onClick={() => router.push(`/admin/opportunities/view/${opportunity._id}`)}
                                    className="text-white font-semibold cursor-pointer hover:text-red-500 transition-colors truncate mb-2"
                                    title={opportunity.title}
                                >
                                    {opportunity.title}
                                </h3>
                                <div className="space-y-1 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-4 w-4" />
                                        <span className="truncate">{opportunity.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="h-4 w-4" />
                                        <span>{opportunity.commitment}</span>
                                    </div>
                                    {opportunity.applicationDeadline && (
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, opportunityId: "", opportunityTitle: "" })}
                onConfirm={handleDeleteConfirm}
                title={deleteModal.opportunityTitle}
            />
        </div>
    )
} 