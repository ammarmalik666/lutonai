"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Image from "next/image"

const editSponsorSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
    logo: z.custom<FileList>()
        .optional()
        .refine(
            (files) => !files?.[0] || files?.[0]?.size <= 2 * 1024 * 1024,
            "Logo must be less than 2MB"
        )
        .refine(
            (files) => !files?.[0] || ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
    email: z.string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    phone: z.string().optional(),
    website: z.string().optional(),
    sponsorshipLevel: z.enum(["Platinum", "Gold", "Silver", "Bronze", "Partner"], {
        required_error: "Sponsorship level is required"
    })
})

type EditSponsorForm = z.infer<typeof editSponsorSchema>

export default function EditSponsor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentLogo, setCurrentLogo] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EditSponsorForm>({
        resolver: zodResolver(editSponsorSchema)
    })

    useEffect(() => {
        const fetchSponsor = async () => {
            try {
                const response = await fetch(`/api/sponsors/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch sponsor")
                const sponsor = await response.json()

                setValue("name", sponsor.name)
                setValue("description", sponsor.description)
                setValue("email", sponsor.email)
                setValue("phone", sponsor.phone || "")
                setValue("website", sponsor.website || "")
                setValue("sponsorshipLevel", sponsor.sponsorshipLevel)
                setCurrentLogo(sponsor.logo)
            } catch (error) {
                toast.error("Error loading sponsor")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSponsor()
    }, [params.id, setValue])

    const onSubmit = async (data: EditSponsorForm) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key === "logo") {
                    if (data.logo?.[0]) {
                        formData.append("logo", data.logo[0])
                    }
                } else {
                    formData.append(key, data[key as keyof EditSponsorForm]?.toString() || "")
                }
            })

            const response = await fetch(`/api/sponsors/${params.id}`, {
                method: "PUT",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to update sponsor")

            toast.success("Sponsor updated successfully!")
            router.push("/admin/sponsors")
        } catch (error) {
            toast.error("Error updating sponsor")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Edit Sponsor</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <div>
                    <label className="block text-white mb-2">Name</label>
                    <input
                        {...register("name")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter sponsor name"
                    />
                    {errors.name && (
                        <p className="text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                        {...register("description")}
                        rows={5}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter sponsor description"
                    />
                    {errors.description && (
                        <p className="text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Logo */}
                <div>
                    <label className="block text-white mb-2">Logo</label>
                    {currentLogo && (
                        <div className="mb-2">
                            <Image
                                src={currentLogo}
                                alt="Current logo"
                                width={200}
                                height={150}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register("logo")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                        Leave empty to keep current logo
                    </p>
                    {errors.logo && (
                        <p className="text-red-500 mt-1">{errors.logo.message}</p>
                    )}
                </div>

                {/* Contact Details */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Contact Details</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact email"
                            />
                            {errors.email && (
                                <p className="text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Phone (Optional)</label>
                            <input
                                {...register("phone")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact phone"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Website (Optional)</label>
                            <input
                                {...register("website")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter website URL"
                            />
                        </div>
                    </div>
                </div>

                {/* Sponsorship Level */}
                <div>
                    <label className="block text-white mb-2">Sponsorship Level</label>
                    <select
                        {...register("sponsorshipLevel")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    >
                        <option value="">Select sponsorship level</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Partner">Partner</option>
                    </select>
                    {errors.sponsorshipLevel && (
                        <p className="text-red-500 mt-1">{errors.sponsorshipLevel.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Updating Sponsor..." : "Update Sponsor"}
                    </button>
                </div>
            </form>
        </div>
    )
} 