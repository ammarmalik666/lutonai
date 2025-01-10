"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/animations"
import { toast } from "sonner"
import { IconMapPin, IconCalendarDue } from "@tabler/icons-react"

interface ValidationError {
    path: string
    message: string
}

interface OpportunityFormData {
    title: string
    description: string
    type: string
    category: string
    level: string
    commitment: string
    location: string
    remote: boolean
    company: string
    companyLogo?: string
    url?: string
    skills: string
    compensation?: string
    startDate?: string
    endDate?: string
    deadline?: string
    isActive: boolean
    featured: boolean
    contactName?: string
    contactEmail?: string
    contactPhone?: string
}

const OPPORTUNITY_TYPES = [
    { value: "JOB", label: "Job" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "PROJECT", label: "Project" },
    { value: "MENTORSHIP", label: "Mentorship" },
    { value: "RESEARCH", label: "Research" },
    { value: "VOLUNTEER", label: "Volunteer" },
    { value: "LEARNING", label: "Learning" }
]

const OPPORTUNITY_CATEGORIES = [
    { value: "AI_DEVELOPMENT", label: "AI Development" },
    { value: "DATA_SCIENCE", label: "Data Science" },
    { value: "BUSINESS", label: "Business" },
    { value: "DESIGN", label: "Design" },
    { value: "RESEARCH", label: "Research" },
    { value: "EDUCATION", label: "Education" },
    { value: "COMMUNITY", label: "Community" }
]

const OPPORTUNITY_LEVELS = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "ALL_LEVELS", label: "All Levels" }
]

const COMMITMENT_TYPES = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "FLEXIBLE", label: "Flexible" },
    { value: "ONE_TIME", label: "One Time" }
]

const defaultFormData: OpportunityFormData = {
    title: "",
    description: "",
    type: "JOB",
    category: "AI_DEVELOPMENT",
    level: "INTERMEDIATE",
    commitment: "FULL_TIME",
    location: "",
    remote: true,
    company: "",
    skills: "",
    isActive: true,
    featured: false
}

export default function NewOpportunityPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<OpportunityFormData>(defaultFormData)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            // Format the data
            const formattedData = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
            }

            const response = await fetch("/api/opportunities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.error?.code === "VALIDATION_ERROR" && data.error?.details) {
                    const validationErrors = data.error.details as ValidationError[]
                    const errorMap = validationErrors.reduce((acc, error) => ({
                        ...acc,
                        [error.path]: error.message
                    }), {})
                    setErrors(errorMap)
                    throw new Error("Please fix the validation errors")
                }
                throw new Error(data.error?.message || "Failed to create opportunity")
            }

            toast.success("Opportunity created successfully!")
            router.push("/admin/opportunities")
        } catch (error) {
            console.error("Error creating opportunity:", error)
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Failed to create opportunity")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    return (
        <motion.div
            className="min-h-screen bg-[#0B0F17] p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        <div className="flex items-center space-x-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            <p className="text-white">Creating opportunity...</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Create New Opportunity</h1>
                <p className="text-gray-400 mb-8">
                    Fill in the details below to create a new opportunity.
                </p>

                <div className="bg-gradient-to-r from-[#0B0F17] to-[#0B0F17] border-r-2 border-r-red-500/20 shadow-lg p-6 rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter opportunity title"
                                    required
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter opportunity description"
                                    required
                                    rows={4}
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Type *
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    >
                                        <option value="">Select type</option>
                                        {OPPORTUNITY_TYPES.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    >
                                        <option value="">Select category</option>
                                        {OPPORTUNITY_CATEGORIES.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Level *
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    >
                                        <option value="">Select level</option>
                                        {OPPORTUNITY_LEVELS.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Commitment *
                                    </label>
                                    <select
                                        name="commitment"
                                        value={formData.commitment}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    >
                                        <option value="">Select commitment</option>
                                        {COMMITMENT_TYPES.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.commitment && <p className="mt-1 text-sm text-red-500">{errors.commitment}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Skills *
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Enter required skills (comma-separated)"
                                    required
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                                {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    required
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Company *
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Enter company name"
                                    required
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                                {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Company Logo URL
                                    </label>
                                    <input
                                        type="text"
                                        name="companyLogo"
                                        value={formData.companyLogo || ""}
                                        onChange={handleChange}
                                        placeholder="Enter company logo URL"
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Application URL
                                    </label>
                                    <input
                                        type="text"
                                        name="url"
                                        value={formData.url || ""}
                                        onChange={handleChange}
                                        placeholder="Enter application URL"
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Compensation
                                </label>
                                <input
                                    type="text"
                                    name="compensation"
                                    value={formData.compensation || ""}
                                    onChange={handleChange}
                                    placeholder="Enter compensation details"
                                    className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline || ""}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact Name
                                    </label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        value={formData.contactName || ""}
                                        onChange={handleChange}
                                        placeholder="Enter contact name"
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail || ""}
                                        onChange={handleChange}
                                        placeholder="Enter contact email"
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Contact Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="contactPhone"
                                        value={formData.contactPhone || ""}
                                        onChange={handleChange}
                                        placeholder="Enter contact phone"
                                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-brand-200 focus:ring-brand-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="remote"
                                        checked={formData.remote}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                remote: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-brand-200"
                                    />
                                    <label className="text-sm font-medium text-gray-400">
                                        Remote Work Available
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                isActive: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-brand-200"
                                    />
                                    <label className="text-sm font-medium text-gray-400">
                                        Active
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                featured: e.target.checked,
                                            }))
                                        }
                                        className="rounded border-gray-700 bg-gray-800 text-brand-500 focus:ring-brand-200"
                                    />
                                    <label className="text-sm font-medium text-gray-400">
                                        Featured
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push("/admin/opportunities")}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#800029] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating..." : "Create Opportunity"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2 mb-4">Preview</h2>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{formData.title || "Opportunity Title"}</h3>
                                    <p className="text-gray-400">{formData.company || "Company Name"}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.type && (
                                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                                            {formData.type.replace("_", " ")}
                                        </span>
                                    )}
                                    {formData.category && (
                                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                                            {formData.category.replace("_", " ")}
                                        </span>
                                    )}
                                    {formData.level && (
                                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                                            {formData.level.replace("_", " ")}
                                        </span>
                                    )}
                                    {formData.commitment && (
                                        <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                                            {formData.commitment.replace("_", " ")}
                                        </span>
                                    )}
                                    {formData.remote && (
                                        <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                                            Remote
                                        </span>
                                    )}
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300">{formData.description || "Opportunity description will appear here..."}</p>
                                </div>

                                {formData.skills && (
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.split(",").map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {formData.location && (
                                        <div className="flex items-center gap-2">
                                            <IconMapPin className="text-gray-400" size={20} />
                                            <span className="text-gray-300">{formData.location}</span>
                                        </div>
                                    )}
                                    {formData.deadline && (
                                        <div className="flex items-center gap-2">
                                            <IconCalendarDue className="text-gray-400" size={20} />
                                            <span className="text-gray-300">
                                                Deadline: {new Date(formData.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {formData.companyLogo && (
                                <div className="ml-6">
                                    <div className="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={formData.companyLogo}
                                            alt={formData.company || "Company logo"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
} 