"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, Title, TextInput, Textarea, Button } from "@tremor/react"
import { toast } from "sonner"
import { IconPhoto, IconX } from "@tabler/icons-react"
import { fadeIn, staggerContainer } from "@/lib/animations"

interface PostFormData {
    title: string
    content: string
    category: string
    tags: string[]
    images: string[]
    videoUrl?: string
    published: boolean
}

const defaultFormData: PostFormData = {
    title: "",
    content: "",
    category: "",
    tags: [],
    images: [],
    videoUrl: "",
    published: false,
}

const categories = [
    "Technology",
    "Events",
    "Community",
    "Education",
    "Research",
    "Innovation",
    "Other",
]

async function getPost(id: string) {
    const res = await fetch(`/api/posts/${id}`)
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || "Failed to fetch post")
    }
    const data = await res.json()
    return data.data
}

async function savePost(data: PostFormData, id?: string) {
    const res = await fetch(`/api/posts${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error?.message || "Failed to save post")
    }
    const responseData = await res.json()
    return responseData.data
}

export default function PostEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [formData, setFormData] = useState<PostFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const isEditing = params.id !== "new"

    useEffect(() => {
        if (isEditing) {
            getPost(params.id)
                .then((data) => {
                    setFormData(data)
                })
                .catch((error) => {
                    console.error("Error fetching post:", error)
                    toast.error("Failed to fetch post")
                })
        }
    }, [isEditing, params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await savePost(formData, isEditing ? params.id : undefined)
            toast.success(isEditing ? "Post updated successfully" : "Post created successfully")
            router.push("/admin/posts")
        } catch (error) {
            console.error("Error saving post:", error)
            toast.error(error instanceof Error ? error.message : "Failed to save post")
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
        setFormData((prev) => ({ ...prev, tags }))
    }

    const handleImageAdd = () => {
        if (previewImage && !formData.images.includes(previewImage)) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, previewImage],
            }))
            setPreviewImage(null)
        }
    }

    const handleImageRemove = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    return (
        <motion.div
            className="min-h-screen bg-[#0B0F17] p-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">
                    {isEditing ? "Edit Post" : "Create New Post"}
                </h1>
                <p className="text-gray-400 mb-8">
                    {isEditing
                        ? "Update your blog post content and settings."
                        : "Create a new blog post to share with your community."}
                </p>

                <Card className="bg-gradient-to-r from-[#0B0F17] to-[#0B0F17] border-r-2 border-r-red-500/20 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Title *
                                </label>
                                <TextInput
                                    name="title"
                                    placeholder="Enter a compelling title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Content *
                                </label>
                                <Textarea
                                    name="content"
                                    placeholder="Write your post content here..."
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows={12}
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white text-gray-900 rounded-md px-3 py-2 border border-gray-300"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Additional Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Tags
                                </label>
                                <TextInput
                                    name="tags"
                                    placeholder="Enter tags separated by commas"
                                    value={formData.tags.join(", ")}
                                    onChange={handleTagsChange}
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                                <p className="mt-1 text-sm text-gray-400">
                                    Separate tags with commas (e.g., "technology, ai, machine learning")
                                </p>
                            </div>

                            {/* Images Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-white mb-1">
                                    Images
                                </label>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <TextInput
                                            placeholder="Enter image URL"
                                            value={previewImage || ""}
                                            onChange={(e) => setPreviewImage(e.target.value)}
                                            className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleImageAdd}
                                        disabled={!previewImage}
                                        className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                                    >
                                        Add Image
                                    </Button>
                                </div>

                                {/* Image Previews */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {formData.images.map((url, index) => (
                                        <div
                                            key={index}
                                            className="relative group rounded-lg overflow-hidden border border-gray-700 bg-gray-800 transition-transform hover:scale-105"
                                        >
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleImageRemove(index)}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <IconX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Video URL (Optional)
                                </label>
                                <TextInput
                                    name="videoUrl"
                                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                    value={formData.videoUrl || ""}
                                    onChange={handleChange}
                                    className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            published: e.target.checked,
                                        }))
                                    }
                                    className="rounded border-gray-300 text-blue-500"
                                />
                                <label className="text-sm font-medium text-white">
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                {isLoading
                                    ? "Saving..."
                                    : isEditing
                                        ? "Update Post"
                                        : "Create Post"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 