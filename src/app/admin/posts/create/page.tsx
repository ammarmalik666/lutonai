"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Editor } from "@tinymce/tinymce-react"
import { toast } from "sonner"
import slugify from "slugify"

// Validation schema
const createPostSchema = z.object({
    title: z.string()
        .min(12, "Title must be at least 12 characters")
        .max(200, "Title cannot exceed 200 characters"),
    content: z.string()
        .min(400, "Content must be at least 400 characters")
        .max(10000, "Content cannot exceed 10000 characters"),
    category: z.enum(["Science", "Technology", "General", "Artificial Intelligence", "Other"]),
    tags: z.array(z.string()).optional(),
    thumbnail: z
        .custom<FileList>()
        .refine((files) => files?.length === 1, "Thumbnail is required")
        .refine(
            (files) => files?.[0]?.size <= 2 * 1024 * 1024,
            "Thumbnail must be less than 2MB"
        )
        .refine(
            (files) => 
                ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
});

type CreatePostForm = z.infer<typeof createPostSchema>

export default function CreatePost() {
    const router = useRouter()
    const [tags, setTags] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm<CreatePostForm>({
        resolver: zodResolver(createPostSchema),
    })

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
    // const generateSlug = (title: string) => {
    //     return title
    //         .toLowerCase()
    //         .trim()
    //         .replace(/[^\w\s-]/g, '')  // Remove special characters
    //         .replace(/\s+/g, '-')      // Replace spaces with hyphens
    //         .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    // }
    const onSubmit = async (data: CreatePostForm) => {
        try {
            setIsSubmitting(true);
    
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("category", data.category);
            formData.append("tags", JSON.stringify(tags));
            formData.append("thumbnail", data.thumbnail[0]); // Ensure this is a file
    
            const response = await fetch("/api/posts", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error("Failed to create post");
            }
    
            const result = await response.json();
            // console.log(result)
            toast.success("Post created successfully!");
            router.push("/admin/posts");
        } catch (error) {
            toast.error("Error creating post");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Post</h1>

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
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        {...register("thumbnail")}
                        className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                    />
                    {errors.thumbnail && (
                        <p className="text-red-500 mt-1">{errors.thumbnail.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? "Creating Post..." : "Create Post"}
                </button>
            </form>
        </div>
    )
} 