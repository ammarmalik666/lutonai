import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import dbConnect from "@/lib/mongodb"
import Project from "@/models/Project"

async function getProjects() {
    await dbConnect()
    const projects = await Project.find().sort({ createdAt: -1 })
    return JSON.parse(JSON.stringify(projects))
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    return (
        <div className="bg-white">
            <section className="relative bg-[#C8102E]">
                <div className="relative z-10">
                    <div className="container flex h-[40vh] items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Our Projects
                            </h1>
                            <p className="mx-auto mt-4 max-w-[700px] text-white/80 md:text-xl">
                                Discover our innovative collaborations and successful partnerships
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16 lg:py-20">
                <div className="container">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project: any) => (
                            <Link
                                key={project._id}
                                href={`/projects/${project._id}`}
                                className="group relative overflow-hidden rounded-lg bg-white border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        width={600}
                                        height={338}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(project.createdAt)}
                                        </p>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            project.status === 'Ongoing' 
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-[#C8102E]">
                                        {project.title}
                                    </h2>
                                    <p className="mt-2 line-clamp-2 text-gray-600">
                                        {project.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
} 