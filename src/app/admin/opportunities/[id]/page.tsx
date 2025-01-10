"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, Title, TextInput, Textarea, Button, Select, SelectItem, Switch } from "@tremor/react"
import { toast } from "sonner"

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

const opportunityTypes = [
    { value: "JOB", label: "Job" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "PROJECT", label: "Project" },
    { value: "MENTORSHIP", label: "Mentorship" },
    { value: "RESEARCH", label: "Research" },
    { value: "VOLUNTEER", label: "Volunteer" },
    { value: "LEARNING", label: "Learning" }
] as const

const categories = [
    { value: "AI_DEVELOPMENT", label: "AI Development" },
    { value: "DATA_SCIENCE", label: "Data Science" },
    { value: "BUSINESS", label: "Business" },
    { value: "DESIGN", label: "Design" },
    { value: "RESEARCH", label: "Research" },
    { value: "EDUCATION", label: "Education" },
    { value: "COMMUNITY", label: "Community" }
] as const

const levels = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "ALL_LEVELS", label: "All Levels" }
] as const

const commitmentTypes = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "FLEXIBLE", label: "Flexible" },
    { value: "ONE_TIME", label: "One Time" }
] as const

async function getOpportunity(id: string) {
    const res = await fetch(`/api/opportunities/${id}`)
    if (!res.ok) {
        throw new Error("Failed to fetch opportunity")
    }
    return res.json()
}

async function saveOpportunity(data: OpportunityFormData, id?: string) {
    const res = await fetch(`/api/opportunities${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error?.message || "Failed to save opportunity")
    }
    return res.json()
}

export default function OpportunityEditor({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [formData, setFormData] = useState<OpportunityFormData>(defaultFormData)
    const [isLoading, setIsLoading] = useState(false)
    const isEditing = params.id !== "new"

    useEffect(() => {
        if (isEditing) {
            getOpportunity(params.id)
                .then((data) => {
                    if (data.opportunity) {
                        setFormData({
                            ...data.opportunity,
                            startDate: data.opportunity.startDate ? new Date(data.opportunity.startDate).toISOString().split("T")[0] : undefined,
                            endDate: data.opportunity.endDate ? new Date(data.opportunity.endDate).toISOString().split("T")[0] : undefined,
                            deadline: data.opportunity.deadline ? new Date(data.opportunity.deadline).toISOString().split("T")[0] : undefined,
                        })
                    }
                })
                .catch((error) => {
                    console.error("Error fetching opportunity:", error)
                    toast.error("Failed to fetch opportunity")
                })
        }
    }, [isEditing, params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await saveOpportunity(formData, isEditing ? params.id : undefined)
            toast.success(isEditing ? "Opportunity updated successfully" : "Opportunity created successfully")
            router.push("/admin/opportunities")
        } catch (error) {
            console.error("Error saving opportunity:", error)
            toast.error("Failed to save opportunity")
            setIsLoading(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen bg-[#0B0F17] p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    {isEditing ? "Edit Opportunity" : "Create New Opportunity"}
                </h1>
                <p className="text-gray-400 text-lg">
                    {isEditing
                        ? "Update the opportunity details below."
                        : "Fill in the details to create a new opportunity."}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="bg-gradient-to-r from-[#0B0F17] to-[#0B0F17] border-r-2 border-r-red-500/20 shadow-lg space-y-8 p-6">
                    <div className="border-b border-gray-800 pb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Title *
                                </label>
                                <TextInput
                                    id="title"
                                    name="title"
                                    placeholder="Enter opportunity title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                                    Company *
                                </label>
                                <TextInput
                                    id="company"
                                    name="company"
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className="bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description *
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Write opportunity description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-800 pb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Classification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                                    Type *
                                </label>
                                <Select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onValueChange={(value: string) =>
                                        setFormData((prev) => ({ ...prev, type: value }))
                                    }
                                    required
                                >
                                    {opportunityTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                                    Category *
                                </label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onValueChange={(value: string) =>
                                        setFormData((prev) => ({ ...prev, category: value }))
                                    }
                                    required
                                >
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-2">
                                    Experience Level *
                                </label>
                                <Select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onValueChange={(value: string) =>
                                        setFormData((prev) => ({ ...prev, level: value }))
                                    }
                                    required
                                >
                                    {levels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label htmlFor="commitment" className="block text-sm font-medium text-gray-300 mb-2">
                                    Commitment Type *
                                </label>
                                <Select
                                    id="commitment"
                                    name="commitment"
                                    value={formData.commitment}
                                    onValueChange={(value: string) =>
                                        setFormData((prev) => ({ ...prev, commitment: value }))
                                    }
                                    required
                                >
                                    {commitmentTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-800 pb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Location & Skills</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                    Location *
                                </label>
                                <TextInput
                                    id="location"
                                    name="location"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="bg-white"
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <label htmlFor="remote" className="text-sm font-medium text-gray-300">
                                    Remote Work
                                </label>
                                <Switch
                                    id="remote"
                                    name="remote"
                                    checked={formData.remote}
                                    onChange={(checked: boolean) =>
                                        setFormData((prev) => ({ ...prev, remote: checked }))
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-2">
                                    Required Skills *
                                </label>
                                <TextInput
                                    id="skills"
                                    name="skills"
                                    placeholder="Enter required skills (comma-separated)"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-800 pb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Additional Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="compensation" className="block text-sm font-medium text-gray-300 mb-2">
                                    Compensation
                                </label>
                                <TextInput
                                    id="compensation"
                                    name="compensation"
                                    placeholder="Enter compensation details"
                                    value={formData.compensation || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                                    Application URL
                                </label>
                                <TextInput
                                    id="url"
                                    name="url"
                                    placeholder="Enter application URL"
                                    value={formData.url || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Logo URL
                                </label>
                                <TextInput
                                    id="companyLogo"
                                    name="companyLogo"
                                    placeholder="Enter company logo URL"
                                    value={formData.companyLogo || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
                                    Application Deadline
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 focus:border-brand-600 focus:ring-brand-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 focus:border-brand-600 focus:ring-brand-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 bg-white px-4 py-2 focus:border-brand-600 focus:ring-brand-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-800 pb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact Name
                                </label>
                                <TextInput
                                    id="contactName"
                                    name="contactName"
                                    placeholder="Enter contact person's name"
                                    value={formData.contactName || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact Email
                                </label>
                                <TextInput
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    placeholder="Enter contact email"
                                    value={formData.contactEmail || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact Phone
                                </label>
                                <TextInput
                                    id="contactPhone"
                                    name="contactPhone"
                                    placeholder="Enter contact phone number"
                                    value={formData.contactPhone || ""}
                                    onChange={handleChange}
                                    className="bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white mb-4">Status</h2>
                        <div className="flex space-x-6">
                            <div className="flex items-center space-x-4">
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                                    Active
                                </label>
                                <Switch
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(checked: boolean) =>
                                        setFormData((prev) => ({ ...prev, isActive: checked }))
                                    }
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                                    Featured
                                </label>
                                <Switch
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={(checked: boolean) =>
                                        setFormData((prev) => ({ ...prev, featured: checked }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/admin/opportunities")}
                            className="bg-gray-800 text-white hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={isLoading}
                            className="bg-[#C8102E] hover:bg-[#800029] text-white"
                        >
                            {isEditing ? "Update Opportunity" : "Create Opportunity"}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    )
} 