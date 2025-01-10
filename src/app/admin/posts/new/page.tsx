"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, Title, Text, TextInput, Textarea, Button, Select, SelectItem } from "@tremor/react"
import { toast } from "sonner"
import { fadeIn } from "@/lib/animations"

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

export default function CreatePostPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<PostFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.join(","),
                    images: formData.images.join(","),
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to create post")
            }

            toast.success("Post created successfully")
            router.push("/admin/posts")
        } catch (error) {
            console.error("Error creating post:", error)
            toast.error(error instanceof Error ? error.message : "Failed to create post")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
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
            className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="max-w-4xl mx-auto">
                <Title className="text-4xl font-bold text-white mb-4">Create New Post</Title>
                <Text className="text-xl text-gray-400 mb-8">
                    Share your thoughts and ideas with the community.
                </Text>

                <Card className="bg-gradient-to-br from-gray-900 to-black border border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Basic Information</Title>

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                                    Title *
                                </label>
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter post title"
                                    required
                                    error={!!errors.title}
                                    errorMessage={errors.title}
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                                    Content *
                                </label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your post content here..."
                                    required
                                    rows={12}
                                    error={!!errors.content}
                                    errorMessage={errors.content}
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-2">
                                    Category *
                                </label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onValueChange={(value) => handleChange({ target: { name: 'category', value } } as any)}
                                    required
                                >
                                    <SelectItem value="">Select a category</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">
                                    Tags
                                </label>
                                <TextInput
                                    id="tags"
                                    name="tags"
                                    placeholder="Enter tags separated by commas"
                                    value={formData.tags.join(", ")}
                                    onChange={handleTagsChange}
                                    error={!!errors.tags}
                                    errorMessage={errors.tags}
                                />
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Media</Title>

                            {/* Images Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-400">
                                    Images (Optional)
                                </label>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <TextInput
                                            placeholder="Enter image URL"
                                            value={previewImage || ""}
                                            onChange={(e) => setPreviewImage(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleImageAdd}
                                        disabled={!previewImage}
                                        className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                                    >
                                        Add Image
                                    </Button>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        {formData.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative group rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageRemove(index)}
                                                    className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video URL */}
                            <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-2">
                                    Video URL (Optional)
                                </label>
                                <TextInput
                                    id="videoUrl"
                                    name="videoUrl"
                                    placeholder="Enter video URL"
                                    value={formData.videoUrl || ""}
                                    onChange={handleChange}
                                    error={!!errors.videoUrl}
                                    errorMessage={errors.videoUrl}
                                />
                            </div>
                        </div>

                        {/* Publishing Options */}
                        <div className="space-y-4">
                            <Title className="text-xl text-white">Publishing Options</Title>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formData.published}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            published: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-brand-600 focus:ring-brand-500"
                                />
                                <label htmlFor="published" className="text-sm font-medium text-gray-300">
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/admin/posts")}
                                disabled={isLoading}
                                className="bg-gray-700 text-gray-100 hover:bg-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={isLoading}
                                className="bg-brand-600 text-gray-100 hover:bg-brand-700"
                            >
                                Create Post
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </motion.div>
    )
} 