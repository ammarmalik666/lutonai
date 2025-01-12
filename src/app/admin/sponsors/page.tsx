"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Title } from "@tremor/react"
import Image from "next/image"
import { 
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    PlusCircleIcon
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"

interface Sponsor {
    _id: string
    name: string
    logo: string
    sponsorshipLevel: string
}

export default function Sponsors() {
    const router = useRouter()
    const [sponsors, setSponsors] = useState<Sponsor[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        sponsorId: "",
        sponsorName: ""
    })

    const fetchSponsors = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/sponsors?search=${searchQuery}`)
            if (!response.ok) throw new Error("Failed to fetch sponsors")
            const data = await response.json()
            setSponsors(data.sponsors)
        } catch (error) {
            toast.error("Error loading sponsors")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSponsors()
    }, [searchQuery])

    const handleDeleteClick = (sponsorId: string, sponsorName: string) => {
        setDeleteModal({
            isOpen: true,
            sponsorId,
            sponsorName
        })
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/sponsors/${deleteModal.sponsorId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete sponsor")

            toast.success("Sponsor deleted successfully")
            fetchSponsors()
        } catch (error) {
            toast.error("Error deleting sponsor")
            console.error(error)
        } finally {
            setDeleteModal({ isOpen: false, sponsorId: "", sponsorName: "" })
        }
    }

    const getLevelColor = (level: string) => {
        const colors = {
            Platinum: "bg-gray-100 text-gray-800",
            Gold: "bg-yellow-100 text-yellow-800",
            Silver: "bg-gray-100 text-gray-600",
            Bronze: "bg-orange-100 text-orange-800",
            Partner: "bg-blue-100 text-blue-800"
        }
        return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
                <Title className="text-2xl md:text-3xl font-bold text-white">Sponsors</Title>
                
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search sponsors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[300px] bg-[#111111] border border-[#222222] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Add New Button */}
                    <button 
                        onClick={() => router.push('/admin/sponsors/create')}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Add New Sponsor</span>
                    </button>
                </div>
            </div>

            {/* Sponsors Grid */}
            {sponsors.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    <div className="mb-4">No sponsors found</div>
                    <button
                        onClick={() => router.push('/admin/sponsors/create')}
                        className="text-red-500 hover:text-red-400 transition-colors"
                    >
                        Add your first sponsor
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sponsors.map((sponsor) => (
                        <div 
                            key={sponsor._id}
                            className="group bg-[#111111] rounded-xl overflow-hidden"
                        >
                            {/* Logo Container */}
                            <div 
                                className="relative h-48 bg-[#0A0A0A]"
                                onClick={() => router.push(`/admin/sponsors/view/${sponsor._id}`)}
                            >
                                <Image
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    fill
                                    className="cursor-pointer"
                                />
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/admin/sponsors/edit/${sponsor._id}`);
                                        }}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                        title="Edit"
                                    >
                                        <PencilSquareIcon className="h-5 w-5 text-white" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(sponsor._id, sponsor.name);
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
                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getLevelColor(sponsor.sponsorshipLevel)}`}>
                                    {sponsor.sponsorshipLevel}
                                </span>
                                <h3 
                                    onClick={() => router.push(`/admin/sponsors/view/${sponsor._id}`)}
                                    className="text-white font-semibold cursor-pointer hover:text-red-500 transition-colors truncate"
                                    title={sponsor.name}
                                >
                                    {sponsor.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, sponsorId: "", sponsorName: "" })}
                onConfirm={handleDeleteConfirm}
                title={deleteModal.sponsorName}
            />
        </div>
    )
} 