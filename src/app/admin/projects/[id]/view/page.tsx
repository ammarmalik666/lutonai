"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface Project {
    _id: string
    title: string
    thumbnail: string
    description: string
    partners: { name: string; logo: string }[]
    status: string
    createdAt: string
}

export default function ViewProjectPage() {
    const params = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProject()
    }, [])

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`)
            if (!response.ok) throw new Error('Failed to fetch project')
            const data = await response.json()
            setProject(data.project)
        } catch (error) {
            setError('Failed to load project')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!project) return <div>Project not found</div>

    return (
        <div className="container max-w-4xl py-6">
            <div className="mb-6">
                <Link href="/admin/projects">
                    <Button variant="outline" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </Link>
            </div>

            <Card className="bg-[#020817] text-white border-none">
                <div className="relative h-[400px] w-full">
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover rounded-t-lg"
                        priority
                    />
                </div>
                <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">{project.title}</CardTitle>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            project.status === 'Ongoing' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {project.status}
                        </span>
                    </div>
                    <CardDescription className="text-gray-400">
                        Created on {formatDate(project.createdAt)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Description</h3>
                            <div 
                                className="prose prose-invert max-w-none
                                    prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
                                    prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5
                                    prose-h3:text-lg prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-4
                                    prose-p:text-gray-400 prose-p:mb-4
                                    prose-ul:text-gray-400 prose-ul:mb-4 prose-ul:list-disc
                                    prose-ol:text-gray-400 prose-ol:mb-4 prose-ol:list-decimal
                                    prose-li:mb-1
                                    prose-strong:text-white
                                    prose-blockquote:border-l-4 prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
                                    prose-a:text-blue-400 prose-a:hover:text-blue-300"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Partners</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {project.partners.map((partner, index) => (
                                    <div 
                                        key={index}
                                        className="rounded-lg border border-gray-800 p-4"
                                    >
                                        <div className="relative h-20 w-full mb-2">
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <p className="text-center text-sm font-medium">
                                            {partner.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 