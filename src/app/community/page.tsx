"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"

interface Post {
    _id: string
    title: string
    content: string
    images: string | null
    thumbnail: string | null
    videoUrl?: string | null
    author: string | null
    category: string | null
    tags: string | null
    createdAt: string
    updatedAt: string
}

const categories = [
    "All",
    "AI Research",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "Ethics in AI",
]

// Helper function to strip HTML tags
const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
}

export default function CommunityPage() {
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch('/api/posts')
                if (!response.ok) {
                    throw new Error('Failed to fetch posts')
                }
                const { data } = await response.json()
                setPosts(data.posts)
            } catch (error) {
                console.error('Error fetching posts:', error)
                setError('Failed to load posts')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading posts...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        )
    }

    const filteredPosts = posts.filter(post =>
        selectedCategory === "All" || post.category === selectedCategory
    )

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#C8102E] py-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#BD0029] mix-blend-overlay opacity-50" />
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.h1
                            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl"
                            variants={fadeIn}
                        >
                            Community Hub
                        </motion.h1>
                        <motion.p
                            className="text-lg leading-8 text-white/80"
                            variants={fadeIn}
                        >
                            Share your insights, discoveries, and experiences with our growing AI community.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="border-b py-4">
                <div className="container">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="whitespace-nowrap"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20">
                <div className="container">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center">
                            <p className="text-lg text-gray-600">No posts found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <motion.article
                                    key={post._id}
                                    className="group relative flex flex-col overflow-hidden rounded-lg border bg-card"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={slideIn}
                                >
                                    {/* Post Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={post.thumbnail || post.images?.split(',')[0] || '/posts/default.svg'}
                                            alt={post.title}
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="flex items-center gap-x-4 text-xs">
                                            <time
                                                dateTime={post.createdAt}
                                                className="text-[#000000]/60"
                                            >
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </time>
                                            {post.category && (
                                                <span className="relative z-10 rounded-full bg-[#C8102E]/10 px-3 py-1.5 font-medium text-[#C8102E]">
                                                    {post.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="group relative mt-3">
                                            <h3 className="text-xl font-semibold text-[#C8102E]">
                                                <Link href={`/community/post/${post._id}`}>
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#000000]/60">
                                                {stripHtmlTags(post.content)}
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-x-4">
                                            <div className="text-sm leading-6">
                                                <p className="font-semibold text-[#000000]">
                                                    {post.author || 'Anonymous'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
} 