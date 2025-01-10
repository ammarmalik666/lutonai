import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { eventRegistrationSchema } from "@/lib/validations"
import { type z } from "zod"
import { toast } from "sonner"
import { EventAvailability } from "./event-availability"
import { type EventAvailability as EventAvailabilityType } from "@/lib/event-utils"
import { cn } from "@/lib/utils"
import { Spinner } from "./ui/spinner"

type FormData = z.infer<typeof eventRegistrationSchema>

interface EventRegistrationFormProps {
    eventId: string
    initialAvailability: EventAvailabilityType
    onSuccess?: () => void
    className?: string
}

export function EventRegistrationForm({
    eventId,
    initialAvailability,
    onSuccess,
    className,
}: EventRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availability, setAvailability] = useState(initialAvailability)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(eventRegistrationSchema),
        defaultValues: {
            eventId,
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            const response = await fetch("/api/event-registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Failed to register for event")
            }

            toast.success("Successfully registered for event! You will receive a confirmation email shortly.")
            setAvailability(result.availability)
            reset()
            onSuccess?.()
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to register for event"
            setError(message)
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!availability) {
        return (
            <div className="flex min-h-[200px] items-center justify-center">
                <div className="text-lg text-gray-600">Loading availability...</div>
            </div>
        )
    }

    if (availability.isFull) {
        return (
            <div
                className="rounded-lg border p-4 text-center"
                role="alert"
                aria-live="polite"
            >
                <EventAvailability availability={availability} showDetails />
                <p className="mt-2 text-sm text-muted-foreground">
                    This event is currently full. Please check back later or contact us for more information.
                </p>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("space-y-4", className)}
            noValidate
            aria-label="Event registration form"
        >
            <EventAvailability
                availability={availability}
                className="mb-6"
                aria-live="polite"
            />

            {error && (
                <div
                    className="p-4 rounded-md bg-red-50 text-red-900 mb-4"
                    role="alert"
                    aria-live="assertive"
                >
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.name && "border-red-500"
                    )}
                    {...register("name")}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <p id="name-error" className="text-sm text-red-500" role="alert">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.email && "border-red-500"
                    )}
                    {...register("email")}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    disabled={isSubmitting}
                />
                {errors.email && (
                    <p id="email-error" className="text-sm text-red-500" role="alert">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Phone Number <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                    id="phone"
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("phone")}
                    aria-describedby="phone-hint"
                    disabled={isSubmitting}
                />
                <p id="phone-hint" className="text-sm text-muted-foreground">
                    We'll only use this to contact you about the event if necessary
                </p>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="organization"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Organization <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                    id="organization"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("organization")}
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="dietaryRequirements"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Dietary Requirements <span className="text-muted-foreground">(Optional)</span>
                </label>
                <textarea
                    id="dietaryRequirements"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("dietaryRequirements")}
                    aria-describedby="dietary-hint"
                    disabled={isSubmitting}
                />
                <p id="dietary-hint" className="text-sm text-muted-foreground">
                    Please let us know about any dietary requirements or allergies
                </p>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="specialRequirements"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Special Requirements <span className="text-muted-foreground">(Optional)</span>
                </label>
                <textarea
                    id="specialRequirements"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("specialRequirements")}
                    aria-describedby="special-hint"
                    disabled={isSubmitting}
                />
                <p id="special-hint" className="text-sm text-muted-foreground">
                    Please let us know about any accessibility requirements or other special needs
                </p>
            </div>

            <button
                type="submit"
                className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                )}
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Spinner className="mr-2 h-4 w-4" />
                        <span>Registering...</span>
                    </>
                ) : (
                    "Register for Event"
                )}
            </button>
        </form>
    )
} 