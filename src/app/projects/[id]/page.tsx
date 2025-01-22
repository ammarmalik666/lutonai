"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { fadeIn, staggerContainer } from "@/lib/animations"

interface Project {
    _id: string
    title: string
    description: string
    status: string
    thumbnail: string
    partners: Array<{
        name: string
        logo: string
    }>
    createdAt: string
}

export default function ProjectPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/projects/${params.id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch project")
                }
                const data = await response.json()
                setProject(data.project)
            } catch (error) {
                console.error("Error fetching project:", error)
                setError("Failed to load project details")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProject()
    }, [params.id])

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-lg text-gray-600">Loading project details...</div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-lg text-red-500">{error || "Project not found"}</div>
            </div>
        )
    }

    return (
        <>
            {/* Hero Section with Project Image */}
            <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                </div>

                {/* Content */}
                <div className="relative h-full">
                    <div className="container flex h-full items-end pb-16">
                        <motion.div
                            className="max-w-3xl"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.h1
                                className="mb-4 text-4xl font-bold text-white sm:text-5xl"
                                variants={fadeIn}
                            >
                                {project.title}
                            </motion.h1>
                            <motion.div
                                className="flex flex-wrap gap-4"
                                variants={fadeIn}
                            >
                                <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                                    📅 {formatDate(project.createdAt)}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm text-white">
                                    {project.status}
                                </span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Project Details */}
            <section className="py-16">
                <div className="container">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h2 className="mb-4 text-2xl font-bold">About This Project</h2>
                            <div 
                                className="prose max-w-none
                                    prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3
                                    prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3
                                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                                    prose-ul:list-disc prose-ul:text-gray-600 prose-ul:mb-4 prose-ul:pl-4
                                    prose-ol:list-decimal prose-ol:text-gray-600 prose-ol:mb-4 prose-ol:pl-4
                                    prose-li:text-gray-600 prose-li:mb-1
                                    prose-strong:text-gray-900 prose-strong:font-semibold
                                    prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                                    prose-a:text-[#C8102E] prose-a:font-medium hover:prose-a:text-[#A00D25]"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8 lg:col-span-1">
                            {/* Project Details Card */}
                            <div className="rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-semibold">Project Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Date</div>
                                        <div>{formatDate(project.createdAt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Status</div>
                                        <div>{project.status}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Partners Information */}
                            {project.partners.length > 0 && (
                                <div className="rounded-lg border border-gray-200 p-6">
                                    <h3 className="mb-4 text-lg font-semibold">Project Partners</h3>
                                    <div className="space-y-4">
                                        {project.partners.map((partner, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="relative h-10 w-10">
                                                    <Image
                                                        src={partner.logo}
                                                        alt={partner.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium">{partner.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
} 