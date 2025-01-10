"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Button, Badge } from "@tremor/react"
import { fadeIn, staggerContainer, slideIn } from "@/lib/animations"
import { toast } from "sonner"
import { format } from "date-fns"

interface Post {
    id: string
    title: string
    content: string
    category: string | null
    tags: string | null
    image: string | null
    videoUrl: string | null
    author: {
        name: string | null
    }
    published: boolean
    createdAt: string
    updatedAt: string
}

export default function PostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch("/api/posts")
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to fetch posts")
            }
            const data = await response.json()
            setPosts(data.data.posts || [])
        } catch (error) {
            console.error("Error fetching posts:", error)
            setError(error instanceof Error ? error.message : "Failed to load posts")
            toast.error(error instanceof Error ? error.message : "Failed to load posts")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || "Failed to delete post")
            }

            toast.success("Post deleted successfully")
            fetchPosts()
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete post")
        }
    }

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            <motion.div variants={fadeIn} className="relative mb-8">
                <div className="max-w-4xl">
                    <Title className="text-5xl font-bold text-white mb-4">Posts</Title>
                    <Text className="text-xl text-gray-400">
                        Create and manage blog posts, share updates with your community.
                    </Text>
                </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-8">
                <Button
                    onClick={() => router.push("/admin/posts/new")}
                    size="lg"
                    className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                >
                    Create Post
                </Button>
            </motion.div>

            {isLoading ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-lg text-gray-400">Loading posts...</div>
                </motion.div>
            ) : error ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-red-500 mb-4">{error}</div>
                        <Button
                            onClick={fetchPosts}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Try Again
                        </Button>
                    </div>
                </motion.div>
            ) : posts.length === 0 ? (
                <motion.div
                    variants={fadeIn}
                    className="flex justify-center items-center min-h-[400px]"
                >
                    <div className="text-center">
                        <div className="text-lg text-gray-400 mb-4">No posts found</div>
                        <Button
                            onClick={() => router.push("/admin/posts/new")}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white transition-colors"
                        >
                            Create Your First Post
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <motion.div variants={slideIn}>
                    <Card className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell className="text-gray-400">Post Details</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Author</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Category</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Status</TableHeaderCell>
                                    <TableHeaderCell className="text-gray-400">Created</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow
                                        key={post.id}
                                        className="group hover:bg-gray-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <Text className="font-medium text-white">
                                                        {post.title}
                                                    </Text>
                                                    <Text className="text-sm text-gray-400 line-clamp-2">
                                                        {post.content}
                                                    </Text>
                                                    {post.tags && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {post.tags.split(',').map((tag, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    size="sm"
                                                                    color="blue"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="xs"
                                                            variant="secondary"
                                                            className="opacity-0 group-hover:opacity-100 transition-all hover:bg-[#C8102E] hover:text-white"
                                                            onClick={() => router.push(`/admin/posts/${post.id}`)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="secondary"
                                                            className="opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                                {post.image && (
                                                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={post.image}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Text className="text-gray-400">
                                                {post.author?.name || 'Unknown'}
                                            </Text>
                                        </TableCell>
                                        <TableCell>
                                            <Badge size="sm" color="cyan">
                                                {post.category || 'Uncategorized'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                size="sm"
                                                color={post.published ? "green" : "gray"}
                                            >
                                                {post.published ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Text className="text-gray-400">
                                                {format(new Date(post.createdAt), "PPP")}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
} 