import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"

interface ApplicationFormProps {
    opportunityId: string
    trigger?: React.ReactNode
}

interface ApplicationFormData {
    name: string
    email: string
    phone: string
    coverLetter: string
    cv: File | null
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error"

export function ApplicationForm({ opportunityId, trigger }: ApplicationFormProps) {
    const [status, setStatus] = useState<SubmissionStatus>("idle")
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStatus("submitting")

        try {
            const formData = new FormData(event.currentTarget)
            formData.append("opportunityId", opportunityId)

            const response = await fetch("/api/applications", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to submit application")
            }

            setStatus("success")
            toast.success("Application Submitted Successfully!", {
                description: "We have received your application and will review it shortly. You will receive a confirmation email with more details.",
                duration: 5000,
            })

            setIsOpen(false)
            event.currentTarget.reset()
        } catch (error) {
            setStatus("error")
            console.error("Error submitting application:", error)
            toast.error("Failed to Submit Application", {
                description: error instanceof Error ? error.message : "Please try again or contact support if the problem persists.",
                duration: 5000,
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        className="mt-6 w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-700"
                        aria-label="Open application form"
                    >
                        Apply Now
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit Application</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    aria-label="Application submission form"
                >
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            aria-required="true"
                            className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            aria-describedby="name-description"
                        />
                        <span id="name-description" className="sr-only">Enter your full name</span>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            aria-required="true"
                            className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            aria-describedby="email-description"
                        />
                        <span id="email-description" className="sr-only">Enter your email address</span>
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            aria-required="true"
                            className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            aria-describedby="phone-description"
                        />
                        <span id="phone-description" className="sr-only">Enter your phone number</span>
                    </div>
                    <div>
                        <Label htmlFor="coverLetter">Cover Letter</Label>
                        <textarea
                            id="coverLetter"
                            name="coverLetter"
                            required
                            aria-required="true"
                            rows={4}
                            placeholder="Tell us why you're interested in this opportunity..."
                            className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            aria-describedby="cover-letter-description"
                        />
                        <span id="cover-letter-description" className="sr-only">Write your cover letter</span>
                    </div>
                    <div>
                        <Label htmlFor="cv">CV/Resume (PDF, DOC, DOCX)</Label>
                        <input
                            id="cv"
                            name="cv"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            required
                            aria-required="true"
                            className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            aria-describedby="cv-description"
                        />
                        <p id="cv-description" className="mt-1 text-sm text-gray-500">
                            Maximum file size: 5MB
                        </p>
                    </div>
                    <Button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={status === "submitting" ? "Submitting application..." : "Submit application"}
                    >
                        {status === "submitting" ? (
                            <div className="flex items-center justify-center gap-2">
                                <IconLoader2 className="h-4 w-4 animate-spin" />
                                <span>Submitting...</span>
                            </div>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
} 