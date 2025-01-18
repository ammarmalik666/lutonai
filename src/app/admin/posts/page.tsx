"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Title, Grid, TextInput } from "@tremor/react"
import Image from "next/image"
import { 
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon 
} from "@heroicons/react/24/outline"
import { toast } from "sonner"
import DeleteModal from "@/components/DeleteModal"

interface Post {
    _id: string
    title: string
    category: string
    thumbnail: string
    createdAt: string
    content: string
}

export default function Posts() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        postId: "",
        postTitle: ""
    })

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(
                `/api/posts?page=${currentPage}&search=${searchQuery}&limit=12`
            )
            if (!response.ok) throw new Error("Failed to fetch posts")
            
            const data = await response.json()
            setPosts(data.data.posts)
            setTotalPages(data.data.totalPages)
        } catch (error) {
            toast.error("Error loading posts")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [currentPage, searchQuery])

    const handleDeleteClick = (postId: string, postTitle: string) => {
        setDeleteModal({
            isOpen: true,
            postId,
            postTitle
        })
    }

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/posts/${deleteModal.postId}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete post")

            toast.success("Post deleted successfully")
            fetchPosts() // Refresh the posts list
        } catch (error) {
            toast.error("Error deleting post")
            console.error(error)
        } finally {
            setDeleteModal({ isOpen: false, postId: "", postTitle: "" })
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col space-y-4 mb-8">
                <Title className="text-3xl font-bold text-white">Posts</Title>
                
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <style jsx global>{`
                            .tremor-TextInput-root input {
                                background-color: #000000 !important;
                                border-color: #222222 !important;
                            }
                            .tremor-TextInput-root input:focus {
                                border-color: #222222 !important;
                                ring-color: #222222 !important;
                                box-shadow: none !important;
                            }
                        `}</style>
                        <TextInput
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="bg-[#000000] border-[#222222] text-white placeholder-gray-400"
                            icon={MagnifyingGlassIcon}
                        />
                    </div>
                    <button 
                        onClick={() => router.push('/admin/posts/create')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Create New Post
                    </button>
                </div>
            </div>
            
            {posts.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    No posts found
                </div>
            ) : (
                <Grid numItemsLg={3} numItemsMd={2} numItemsSm={1} className="gap-6">
                    {posts.map((post) => (
                        <div 
                            key={post._id}
                            className="group bg-[#000000] rounded-lg overflow-hidden transition-all duration-200 relative"
                        >
                            {post.thumbnail && (
                                <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <Image
                                        src={post.thumbnail}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <span className="inline-block px-3 py-1 text-xs font-semibold text-red-500 border border-red-500 rounded-full mb-2">
                                    {post.category}
                                </span>
                                <h3 
                                    onClick={() => router.push(`/admin/posts/view/${post._id}`)}
                                    className="text-white text-lg font-semibold cursor-pointer hover:text-red-500 transition-colors truncate mb-2"
                                    title={post.title}
                                >
                                    {post.title.length > 40 
                                        ? post.title.substring(0, 40) + "..."
                                        : post.title
                                    }
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                    {post.content.replace(/<[^>]+>/g, '')}
                                </p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(post._id, post.title)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                currentPage === i + 1
                                    ? "bg-red-500 text-white"
                                    : "bg-[#000000] text-gray-400 border border-red-500 hover:text-white"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, postId: "", postTitle: "" })}
                onConfirm={handleDeleteConfirm}
                title={deleteModal.postTitle}
            />
        </div>
    )
} 