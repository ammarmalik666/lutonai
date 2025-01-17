"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Editor } from "@tinymce/tinymce-react"
import { toast } from "sonner"

// Validation schema
const editPostSchema = z.object({
    title: z.string()
        .min(12, "Title must be at least 12 characters")
        .max(200, "Title cannot exceed 200 characters"),
    content: z.string()
        .min(400, "Content must be at least 400 characters")
        .max(10000, "Content cannot exceed 10000 characters"),
    category: z.enum(["Science", "Technology", "General", "Artificial Intelligence", "Other"]),
    tags: z.array(z.string()).optional(),
    thumbnail: z.custom<FileList>()
        .optional()
        .refine(
            (files) => !files?.[0] || files?.[0]?.size <= 2 * 1024 * 1024,
            "Thumbnail must be less than 2MB"
        )
        .refine(
            (files) => !files?.[0] || ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
})

type EditPostForm = z.infer<typeof editPostSchema>

export default function EditPost({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentThumbnail, setCurrentThumbnail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<EditPostForm>({
        resolver: zodResolver(editPostSchema),
    })

    // Fetch post data
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch post")
                const post = await response.json()
                
                // Handle tags without JSON.parse
                const tags = Array.isArray(post.data.tags) ? post.data.tags : [post.data.tags]
                
                // Set form values
                setValue("title", post.data.title || "")
                setValue("content", post.data.content || "")
                setValue("category", post.data.category || "")
                setTags(tags)
                setValue("tags", tags)
                setCurrentThumbnail(post.data.thumbnail || "")
            } catch (error) {
                toast.error("Error loading post")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [params.id, setValue])

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "," || e.key === "Tab") {
            e.preventDefault()
            const value = e.currentTarget.value.trim()
            if (value && !tags.includes(value)) {
                setTags([...tags, value])
                e.currentTarget.value = ""
                setValue("tags", [...tags, value])
            }
        }
    }

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove)
        setTags(newTags)
        setValue("tags", newTags)
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    const onSubmit = async (data: EditPostForm) => {
        try {
            setIsSubmitting(true)
            const slug = generateSlug(data.title)

            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("content", data.content)
            formData.append("category", data.category)
            formData.append("tags", JSON.stringify(tags))
            formData.append("slug", slug)
            
            if (data.thumbnail?.[0]) {
                formData.append("thumbnail", data.thumbnail[0])
            }

            const response = await fetch(`/api/posts/${params.id}`, {
                method: "PUT",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to update post")

            toast.success("Post updated successfully!")
            router.push("/admin/posts")
        } catch (error) {
            toast.error("Error updating post")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="text-white">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Edit Post</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label className="block text-white mb-2">Post Title</label>
                    <input
                        {...register("title")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        placeholder="Enter post title"
                    />
                    {errors.title && (
                        <p className="text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Content Editor */}
                <div>
                    <label className="block text-white mb-2">Content</label>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                        "searchreplace", "visualblocks", "code", "fullscreen",
                                        "insertdatetime", "media", "table", "code", "help", "wordcount"
                                    ],
                                    toolbar: "undo redo | blocks | " +
                                        "bold italic forecolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                                }}
                                onEditorChange={(content) => field.onChange(content)}
                                initialValue={field.value}
                            />
                        )}
                    />
                    {errors.content && (
                        <p className="text-red-500 mt-1">{errors.content.message}</p>
                    )}
                </div>

                {/* Category Select */}
                <div>
                    <label className="block text-white mb-2">Category</label>
                    <select
                        {...register("category")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    >
                        <option value="">Select a category</option>
                        <option value="Science">Science</option>
                        <option value="Technology">Technology</option>
                        <option value="General">General</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                        <p className="text-red-500 mt-1">{errors.category.message}</p>
                    )}
                </div>

                {/* Tags Input */}
                <div>
                    <label className="block text-white mb-2">Tags</label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            onKeyDown={handleTagInput}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            placeholder="Enter tags (press comma or tab to add)"
                        />
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-gray-200"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Thumbnail Input */}
                <div>
                    <label className="block text-white mb-2">Thumbnail</label>
                    {currentThumbnail && (
                        <div className="mb-2">
                            <img
                                src={currentThumbnail}
                                alt="Current thumbnail"
                                className="w-48 h-32 object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register("thumbnail")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                        Leave empty to keep current thumbnail
                    </p>
                    {errors.thumbnail && (
                        <p className="text-red-500 mt-1">{errors.thumbnail.message}</p>
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
                        {isSubmitting ? "Updating Post..." : "Update Post"}
                    </button>
                </div>
            </form>
        </div>
    )
} 