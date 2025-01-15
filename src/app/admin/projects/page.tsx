"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Pencil, Eye, Trash2, Plus } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Project {
    _id: string
    title: string
    thumbnail: string
    description: string
    partners: { name: string; logo: string }[]
    status: string
    createdAt: string
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects')
            if (!response.ok) throw new Error('Failed to fetch projects')
            const data = await response.json()
            console.log('Projects data:', data.projects)
            setProjects(data.projects)
        } catch (error) {
            setError('Failed to load projects')
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/projects/${deleteId}`, {
                method: 'DELETE',
            })
            
            if (!response.ok) throw new Error('Failed to delete project')
            
            await fetchProjects()
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to delete project')
        } finally {
            setDeleteId(null)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="container py-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Link href="/admin/projects/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="overflow-hidden bg-[#020817] text-white border-none h-full">
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={project.thumbnail}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority
                                />
                            </div>
                            <CardHeader className="p-4">
                                <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                                <CardDescription className="text-gray-400 line-clamp-2">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        project.status === 'Ongoing' 
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {project.status}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {formatDate(project.createdAt)}
                                    </span>
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Link href={`/admin/projects/${project._id}/view`}>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/projects/${project._id}/edit`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => setDeleteId(project._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="bg-[#020817] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            This action cannot be undone. This will permanently delete the project.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-700 text-gray-200 hover:bg-[#0F1629] hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 