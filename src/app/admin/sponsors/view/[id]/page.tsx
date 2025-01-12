"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"

interface Sponsor {
    _id: string
    name: string
    description: string
    logo: string
    email: string
    phone?: string
    website?: string
    sponsorshipLevel: string
    createdAt: string
}

export default function SponsorDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [sponsor, setSponsor] = useState<Sponsor | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)

    useEffect(() => {
        const fetchSponsor = async () => {
            try {
                const response = await fetch(`/api/sponsors/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch sponsor")
                const data = await response.json()
                setSponsor(data)
            } catch (error) {
                toast.error("Error loading sponsor")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSponsor()
    }, [params.id])

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/sponsors/${params.id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete sponsor")

            toast.success("Sponsor deleted successfully")
            router.push("/admin/sponsors")
        } catch (error) {
            toast.error("Error deleting sponsor")
            console.error(error)
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

    if (!sponsor) {
        return (
            <div className="text-center text-white py-12">
                Sponsor not found
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white mb-8 flex items-center gap-2 transition-colors"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back to Sponsors
            </button>

            {/* Main Content */}
            <article className="bg-[#000000] rounded-lg overflow-hidden border border-[#222222]">
                {/* Logo */}
                <div className="relative h-[300px] w-full bg-[#111111] flex items-center justify-center p-8">
                    <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={300}
                        height={200}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-2 ${getLevelColor(sponsor.sponsorshipLevel)}`}>
                                {sponsor.sponsorshipLevel}
                            </span>
                            <h1 className="text-3xl font-bold text-white">
                                {sponsor.name}
                            </h1>
                        </div>
                        <div className="text-sm text-gray-400">
                            Added on {format(new Date(sponsor.createdAt), "MMMM d, yyyy")}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                        <p className="text-gray-300 whitespace-pre-wrap">
                            {sponsor.description}
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Contact Details</h2>
                        <div className="space-y-2 text-gray-300">
                            <p>
                                <strong className="text-white">Email:</strong>{" "}
                                <a href={`mailto:${sponsor.email}`} className="hover:text-red-500 transition-colors">
                                    {sponsor.email}
                                </a>
                            </p>
                            {sponsor.phone && (
                                <p>
                                    <strong className="text-white">Phone:</strong>{" "}
                                    <a href={`tel:${sponsor.phone}`} className="hover:text-red-500 transition-colors">
                                        {sponsor.phone}
                                    </a>
                                </p>
                            )}
                            {sponsor.website && (
                                <p>
                                    <strong className="text-white">Website:</strong>{" "}
                                    <a 
                                        href={sponsor.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        {sponsor.website}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => router.push(`/admin/sponsors/edit/${sponsor._id}`)}
                    className="px-4 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                >
                    Edit Sponsor
                </button>
                <button
                    onClick={() => setDeleteModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Delete Sponsor
                </button>
            </div>

            <DeleteModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title={sponsor.name}
            />
        </div>
    )
} 