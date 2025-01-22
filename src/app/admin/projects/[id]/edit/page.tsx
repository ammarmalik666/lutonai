"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Editor } from '@tinymce/tinymce-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Partner {
    name: string
    logo: File | null | string
    logoPreview?: string
}

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        thumbnail: null as File | null | string,
        thumbnailPreview: "",
        partners: [] as Partner[]
    })

    useEffect(() => {
        fetchProject()
    }, [])

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`)
            if (!response.ok) throw new Error('Failed to fetch project')
            const data = await response.json()
            
            setFormData({
                title: data.project.title,
                description: data.project.description,
                status: data.project.status,
                thumbnail: data.project.thumbnail,
                thumbnailPreview: data.project.thumbnail,
                partners: data.project.partners.map((p: any) => ({
                    name: p.name,
                    logo: p.logo,
                    logoPreview: p.logo
                }))
            })
        } catch (error) {
            setError('Failed to load project')
        }
    }

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
            const formDataToSend = new FormData()
            formDataToSend.append("title", formData.title)
            formDataToSend.append("description", formData.description)
            formDataToSend.append("status", formData.status)
            
            if (formData.thumbnail instanceof File) {
                formDataToSend.append("thumbnail", formData.thumbnail)
            } else if (typeof formData.thumbnail === 'string') {
                formDataToSend.append("thumbnailUrl", formData.thumbnail)
            }

            formData.partners.forEach((partner, index) => {
                formDataToSend.append(`partners[${index}][name]`, partner.name)
                
                if (partner.logo instanceof File) {
                    formDataToSend.append(`partners[${index}][logo]`, partner.logo)
                } else if (typeof partner.logo === 'string') {
                    formDataToSend.append(`partners[${index}][logoUrl]`, partner.logo)
                }
            })

            const response = await fetch(`/api/projects/${params.id}`, {
                method: "PUT",
                body: formDataToSend,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to update project")
            }
            // console.log("response")
            // console.log(response.json())
            router.push("/admin/projects")
            router.refresh()
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update project")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container max-w-3xl py-6 overflow-hidden">
            <Card className="bg-[#020817] text-white border-none">
                <CardHeader className="pb-4">
                    <CardTitle>Edit Project</CardTitle>
                    <CardDescription className="text-gray-400">
                        Update your project details and partners.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
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
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-[#0F1629] border-gray-800 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">
                                Description
                            </label>
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                value={formData.description}
                                onEditorChange={(content) => {
                                    setFormData({ ...formData, description: content })
                                }}
                                init={{
                                    height: 400,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
                                    skin: "oxide",
                                    toolbar_mode: 'sliding'
                                }}
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
                                {isSubmitting ? "Updating..." : "Update Project"}
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
            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
} 