"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"

interface Post {
    _id: string
    title: string
    content: string
    category: string
    tags: string[]
    thumbnail: string
    createdAt: string
}

export default function PostDetail({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/posts/${params.id}`)
                if (!response.ok) throw new Error("Failed to fetch post")
                const data = await response.json()
                
                const postData = {
                    ...data.data,
                    tags: Array.isArray(data.data.tags) ? data.data.tags : [data.data.tags]
                }
                
                setPost(postData)
            } catch (error) {
                toast.error("Error loading post")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [params.id])

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMMM d, yyyy")
        } catch {
            return "Date unavailable"
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="text-center text-white py-12">
                Post not found
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
                Back to Posts
            </button>

            {/* Main Content */}
            <article className="bg-[#000000] rounded-lg overflow-hidden border border-[#222222]">
                {/* Thumbnail */}
                <div className="relative h-[400px] w-full">
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Post Info */}
                <div className="p-8">
                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                        <time dateTime={post.createdAt}>
                            {formatDate(post.createdAt)}
                        </time>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        <span className="text-red-500 font-medium">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-6">
                        {post.title}
                    </h1>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/20 shadow-sm hover:bg-red-500/30 transition-colors duration-200"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div 
                        className="prose prose-invert max-w-none text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <style jsx global>{`
                        .prose {
                            color: white;
                        }
                        .prose h1 {
                            color: white !important;
                            font-size: 2.25rem !important;
                            font-weight: 700 !important;
                            margin-top: 2rem !important;
                            margin-bottom: 1.5rem !important;
                            line-height: 1.2 !important;
                        }
                        .prose h2 {
                            color: white !important;
                            font-size: 1.875rem !important;
                            font-weight: 600 !important;
                            margin-top: 1.75rem !important;
                            margin-bottom: 1.25rem !important;
                            line-height: 1.3 !important;
                        }
                        .prose h3 {
                            color: white !important;
                            font-size: 1.5rem !important;
                            font-weight: 600 !important;
                            margin-top: 1.5rem !important;
                            margin-bottom: 1rem !important;
                            line-height: 1.4 !important;
                        }
                        .prose h4 {
                            color: white !important;
                            font-size: 1.25rem !important;
                            font-weight: 600 !important;
                            margin-top: 1.25rem !important;
                            margin-bottom: 0.75rem !important;
                            line-height: 1.5 !important;
                        }
                        .prose p, .prose ul, .prose ol, .prose li {
                            color: white !important;
                            font-size: 1.125rem !important;
                            line-height: 1.75 !important;
                            margin-bottom: 1rem !important;
                        }
                        .prose strong {
                            color: white !important;
                            font-weight: 600 !important;
                        }
                        .prose em {
                            color: white !important;
                        }
                        .prose blockquote {
                            color: #e5e7eb !important;
                            border-left: 4px solid #ef4444 !important;
                            font-style: italic !important;
                            margin: 1.5rem 0 !important;
                            padding-left: 1.25rem !important;
                        }
                        .prose a {
                            color: #ef4444 !important;
                            text-decoration: underline !important;
                            font-weight: 500 !important;
                        }
                        .prose a:hover {
                            color: #dc2626 !important;
                        }
                        .prose code {
                            color: white !important;
                            background: #222222 !important;
                            padding: 0.2em 0.4em !important;
                            border-radius: 0.25rem !important;
                            font-size: 0.875em !important;
                        }
                        .prose pre {
                            background: #222222 !important;
                            padding: 1.25rem !important;
                            border-radius: 0.5rem !important;
                            overflow-x: auto !important;
                        }
                        .prose pre code {
                            color: white !important;
                            background: transparent !important;
                            padding: 0 !important;
                        }
                        .prose ul, .prose ol {
                            padding-left: 1.5rem !important;
                        }
                        .prose ul li {
                            list-style-type: disc !important;
                        }
                        .prose ol li {
                            list-style-type: decimal !important;
                        }
                    `}</style>
                </div>
            </article>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button
                    onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                    className="px-4 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                >
                    Edit Post
                </button>
                <button
                    onClick={() => {
                        if (confirm("Are you sure you want to delete this post?")) {
                            // Add delete functionality
                        }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Delete Post
                </button>
            </div>
        </div>
    )
} 