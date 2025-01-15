"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { X, Upload } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

interface Partner {
    name: string
    logo: File | null
    logoPreview?: string
}

export default function CreateProjectPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Ongoing",
        thumbnail: null as File | null,
        thumbnailPreview: "",
        partners: [{ name: "", logo: null, logoPreview: "" }]
    })

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    thumbnail: file,
                    thumbnailPreview: reader.result as string
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePartnerChange = (index: number, field: keyof Partner, value: string | File | null) => {
        const updatedPartners = [...formData.partners]
        if (field === 'logo' && value instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updatedPartners[index].logoPreview = reader.result as string
                setFormData({ ...formData, partners: updatedPartners })
            }
            reader.readAsDataURL(value)
        }
        updatedPartners[index][field] = value
        setFormData({ ...formData, partners: updatedPartners })
    }

    const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handlePartnerChange(index, "logo", file)
        }
    }

    const addPartner = () => {
        setFormData({
            ...formData,
            partners: [...formData.partners, { name: "", logo: null, logoPreview: "" }]
        })
    }

    const removePartner = (index: number) => {
        const updatedPartners = formData.partners.filter((_, i) => i !== index)
        setFormData({ ...formData, partners: updatedPartners })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            if (!formData.thumbnail) {
                setError("Project thumbnail is required")
                return
            }

            // Validate form
            if (!formData.title || !formData.description || !formData.status) {
                setError("Please fill in all required fields")
                return
            }

            if (formData.title.length > 200) {
                setError("Title must be less than 200 characters")
                return
            }

            if (formData.description.length > 2000) {
                setError("Description must be less than 2000 characters")
                return
            }

            // Check if all partners have name and logo
            const invalidPartner = formData.partners.find(p => !p.name || !p.logo)
            if (invalidPartner) {
                setError("All partners must have a name and logo")
                return
            }

            const formDataToSend = new FormData()
            formDataToSend.append("title", formData.title)
            formDataToSend.append("description", formData.description)
            formDataToSend.append("status", formData.status)
            formDataToSend.append("thumbnail", formData.thumbnail)
            
            formData.partners.forEach((partner, index) => {
                formDataToSend.append(`partners[${index}][name]`, partner.name)
                if (partner.logo) {
                    formDataToSend.append(`partners[${index}][logo]`, partner.logo)
                }
            })

            const response = await fetch("/api/projects", {
                method: "POST",
                body: formDataToSend,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create project")
            }

            router.push("/admin/projects")
            router.refresh()
        } catch (error) {
            console.error("Error:", error)
            setError(error instanceof Error ? error.message : "Failed to create project")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container max-w-3xl py-6">
            <Card className="bg-[#020817] text-white border-none">
                <CardHeader className="pb-4">
                    <CardTitle>Create New Project</CardTitle>
                    <CardDescription className="text-gray-400">
                        Add a new project to showcase your collaboration with partners.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Project Thumbnail
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label 
                                        htmlFor="thumbnail"
                                        className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 hover:border-gray-500"
                                    >
                                        {formData.thumbnailPreview ? (
                                            <div className="relative aspect-video w-full">
                                                <Image
                                                    src={formData.thumbnailPreview}
                                                    alt="Project thumbnail"
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                <span className="mt-2 block text-sm text-gray-400">
                                                    Upload Project Thumbnail
                                                </span>
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        id="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailUpload}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Title
                            </label>
                            <Input
                                required
                                maxLength={200}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter project title"
                                className="bg-[#0F1629] border-gray-800 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Description
                            </label>
                            <Textarea
                                required
                                maxLength={2000}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter project description"
                                className="min-h-[150px] bg-[#0F1629] border-gray-800 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Status
                            </label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="bg-[#0F1629] border-gray-800 text-white">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0F1629] border-gray-800 text-white">
                                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-200">
                                    Partners
                                </label>
                                <Button 
                                    type="button" 
                                    onClick={addPartner} 
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-700 text-gray-200 hover:bg-[#0F1629] hover:text-white"
                                >
                                    Add Partner
                                </Button>
                            </div>
                            
                            {formData.partners.map((partner, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative space-y-4 rounded-lg border border-gray-800 bg-[#0F1629] p-4"
                                >
                                    {formData.partners.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2 text-gray-400 hover:text-white"
                                            onClick={() => removePartner(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">
                                            Partner Name
                                        </label>
                                        <Input
                                            required
                                            value={partner.name}
                                            onChange={(e) => handlePartnerChange(index, "name", e.target.value)}
                                            placeholder="Enter partner name"
                                            className="bg-[#020817] border-gray-800 text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-200">
                                            Partner Logo
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label 
                                                    htmlFor={`logo-${index}`}
                                                    className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-700 p-4 hover:border-gray-500"
                                                >
                                                    {partner.logoPreview ? (
                                                        <div className="relative h-20 w-20">
                                                            <Image
                                                                src={partner.logoPreview}
                                                                alt={`${partner.name} logo`}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                                            <span className="mt-2 block text-sm text-gray-400">
                                                                Upload Logo
                                                            </span>
                                                        </div>
                                                    )}
                                                </label>
                                                <input
                                                    id={`logo-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(index, e)}
                                                    required={!partner.logo}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#C8102E] text-white hover:bg-[#A00D25]"
                            >
                                {isSubmitting ? "Creating..." : "Create Project"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/projects")}
                                className="border-gray-700 text-gray-200 hover:bg-[#0F1629] hover:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 