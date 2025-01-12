"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import TagInput from "@/components/TagInput"

const createOpportunitySchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(100, "Title cannot exceed 100 characters"),
    description: z.string()
        .min(1, "Description is required")
        .max(1000, "Description cannot exceed 1000 characters"),
    type: z.enum(["Job", "Internship", "Project", "Mentorship", "Research", "Volunteer", "Learning"], {
        required_error: "Type is required"
    }),
    category: z.enum(["AI Development", "Data Science", "Business", "Design", "Research", "Education", "Community"], {
        required_error: "Category is required"
    }),
    level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"], {
        required_error: "Level is required"
    }),
    commitment: z.enum(["Full Time", "Part Time", "Flexible"], {
        required_error: "Commitment is required"
    }),
    skills: z.array(z.string())
        .min(1, "At least one skill is required"),
    location: z.string()
        .min(1, "Location is required"),
    companyLogo: z.custom<FileList>()
        .refine((files) => files?.length === 1, "Company logo is required")
        .refine(
            (files) => files?.[0]?.size <= 2 * 1024 * 1024,
            "Logo must be less than 2MB"
        )
        .refine(
            (files) => ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png files are allowed"
        ),
    applicationUrl: z.string()
        .min(1, "Application URL is required")
        .url("Please enter a valid URL"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    applicationDeadline: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    remoteAvailable: z.boolean().optional()
})

type CreateOpportunityForm = z.infer<typeof createOpportunitySchema>

export default function CreateOpportunity() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [skills, setSkills] = useState<string[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CreateOpportunityForm>({
        resolver: zodResolver(createOpportunitySchema),
        defaultValues: {
            remoteAvailable: false
        }
    })

    const onSubmit = async (data: CreateOpportunityForm) => {
        try {
            setIsSubmitting(true)

            const formData = new FormData()
            Object.keys(data).forEach((key) => {
                if (key === "companyLogo") {
                    formData.append("companyLogo", data.companyLogo[0])
                } else if (key === "skills") {
                    formData.append("skills", JSON.stringify(skills))
                } else if (key === "remoteAvailable") {
                    formData.append("remoteAvailable", data.remoteAvailable ? "true" : "false")
                } else {
                    formData.append(key, data[key as keyof CreateOpportunityForm]?.toString() || "")
                }
            })

            const response = await fetch("/api/opportunities", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Failed to create opportunity")

            toast.success("Opportunity created successfully!")
            router.push("/admin/opportunities")
        } catch (error) {
            toast.error("Error creating opportunity")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkillsChange = (newSkills: string[]) => {
        setSkills(newSkills)
        setValue("skills", newSkills)
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Add New Opportunity</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                    
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="block text-white">Title</label>
                        <input
                            {...register("title")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            placeholder="Enter opportunity title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="block text-white">Description</label>
                        <textarea
                            {...register("description")}
                            rows={5}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            placeholder="Enter opportunity description"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Type, Category, Level Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Type */}
                        <div>
                            <label className="block text-white mb-2">Type</label>
                            <select
                                {...register("type")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            >
                                <option value="">Select type</option>
                                <option value="Job">Job</option>
                                <option value="Internship">Internship</option>
                                <option value="Project">Project</option>
                                <option value="Mentorship">Mentorship</option>
                                <option value="Research">Research</option>
                                <option value="Volunteer">Volunteer</option>
                                <option value="Learning">Learning</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-white mb-2">Category</label>
                            <select
                                {...register("category")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            >
                                <option value="">Select category</option>
                                <option value="AI Development">AI Development</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Business">Business</option>
                                <option value="Design">Design</option>
                                <option value="Research">Research</option>
                                <option value="Education">Education</option>
                                <option value="Community">Community</option>
                            </select>
                            {errors.category && (
                                <p className="text-red-500 mt-1">{errors.category.message}</p>
                            )}
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-white mb-2">Level</label>
                            <select
                                {...register("level")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            >
                                <option value="">Select level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="All Levels">All Levels</option>
                            </select>
                            {errors.level && (
                                <p className="text-red-500 mt-1">{errors.level.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Requirements */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Requirements</h2>

                    {/* Commitment and Remote Available */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-white mb-2">Commitment</label>
                            <select
                                {...register("commitment")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            >
                                <option value="">Select commitment</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                            {errors.commitment && (
                                <p className="text-red-500 mt-1">{errors.commitment.message}</p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                {...register("remoteAvailable")}
                                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <label className="ml-2 text-white">Remote Available</label>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-white mb-2">Skills Required</label>
                        <TagInput
                            tags={skills}
                            onChange={handleSkillsChange}
                            placeholder="Type a skill and press enter"
                        />
                        {errors.skills && (
                            <p className="text-red-500 mt-1">{errors.skills.message}</p>
                        )}
                    </div>
                </div>

                {/* Location and Company */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Location and Company</h2>

                    {/* Location */}
                    <div>
                        <label className="block text-white mb-2">Location</label>
                        <input
                            {...register("location")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            placeholder="Enter location"
                        />
                        {errors.location && (
                            <p className="text-red-500 mt-1">{errors.location.message}</p>
                        )}
                    </div>

                    {/* Company Logo */}
                    <div>
                        <label className="block text-white mb-2">Company Logo</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            {...register("companyLogo")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                        />
                        {errors.companyLogo && (
                            <p className="text-red-500 mt-1">{errors.companyLogo.message}</p>
                        )}
                    </div>
                </div>

                {/* Application Details */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Application Details</h2>

                    {/* Application URL */}
                    <div>
                        <label className="block text-white mb-2">Application URL</label>
                        <input
                            {...register("applicationUrl")}
                            className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            placeholder="Enter application URL"
                        />
                        {errors.applicationUrl && (
                            <p className="text-red-500 mt-1">{errors.applicationUrl.message}</p>
                        )}
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white mb-2">Start Date (Optional)</label>
                            <input
                                type="date"
                                {...register("startDate")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">End Date (Optional)</label>
                            <input
                                type="date"
                                {...register("endDate")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Application Deadline (Optional)</label>
                            <input
                                type="date"
                                {...register("applicationDeadline")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Contact Information (Optional)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-white mb-2">Contact Name</label>
                            <input
                                {...register("contactName")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact name"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-2">Contact Email</label>
                            <input
                                type="email"
                                {...register("contactEmail")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact email"
                            />
                            {errors.contactEmail && (
                                <p className="text-red-500 mt-1">{errors.contactEmail.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-white mb-2">Contact Phone</label>
                            <input
                                {...register("contactPhone")}
                                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
                                placeholder="Enter contact phone"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-[#000000] text-white border border-[#222222] rounded-lg hover:border-red-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Creating Opportunity..." : "Create Opportunity"}
                    </button>
                </div>
            </form>
        </div>
    )
} 