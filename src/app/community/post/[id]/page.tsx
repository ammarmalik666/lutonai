"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/lib/animations"
import { format } from "date-fns"

interface Post {
    _id: string
    title: string
    content: string
    images: string[]
    videoUrl?: string | null
    author: string | null
    category: string | null
    tags: string[]
    createdAt: string
    updatedAt: string
    thumbnail: string | null
}

export default function PostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<Post | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(`/api/posts/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch post')
                }
                const { data } = await response.json()
                setPost(data)
            } catch (error) {
                console.error('Error fetching post:', error)
                setError('Failed to load post')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPost()
    }, [params.id])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600">Loading post...</div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-red-500">{error || "Post not found"}</div>
            </div>
        )
    }

    const images = post.images || []
    const tags = post.tags || []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#C8102E] to-[#8B0000] py-24 text-white">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-3xl text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <Link
                            href="/community"
                            className="group mb-8 inline-flex items-center text-sm text-white/80 transition-colors hover:text-white"
                        >
                            <svg
                                className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to Community
                        </Link>
                        {post.category && (
                            <motion.div
                                className="mb-4"
                                variants={fadeIn}
                            >
                                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                    {post.category}
                                </span>
                            </motion.div>
                        )}
                        <motion.h1
                            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                            variants={fadeIn}
                        >
                            {post.title}
                        </motion.h1>
                        <motion.div
                            className="flex items-center justify-center gap-x-4 text-sm"
                            variants={fadeIn}
                        >
                            <div className="font-medium">
                                {post.author || 'Anonymous'}
                            </div>
                            <div className="text-white/60">
                                <time dateTime={post.createdAt}>
                                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                                </time>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        {/* Thumbnail Image */}
                        {post.thumbnail && (
                            <motion.div
                                className="mb-12 overflow-hidden rounded-xl shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="relative aspect-[16/9]">
                                    <Image
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="object-cover"
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 1024px"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Content with TinyMCE HTML */}
                        <motion.div
                            className="prose prose-lg mx-auto max-w-none prose-headings:text-[#C8102E] prose-a:text-[#C8102E] prose-strong:text-[#C8102E]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <motion.div
                                className="mt-16 flex flex-wrap gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-[#C8102E]/5 px-4 py-2 text-sm font-medium text-[#C8102E] transition-colors hover:bg-[#C8102E]/10"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
} 