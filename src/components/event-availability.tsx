import { type EventAvailability as EventAvailabilityType } from "@/lib/event-utils"
import { cn } from "@/lib/utils"
import { formatEventDate } from "@/lib/event-utils"

interface EventAvailabilityProps extends React.HTMLAttributes<HTMLDivElement> {
    availability: EventAvailabilityType
    showDetails?: boolean
}

export function EventAvailability({
    availability,
    showDetails = false,
    className,
    ...props
}: EventAvailabilityProps) {
    const { totalSpots, spotsRemaining, isFull, registrationDeadline, isRegistrationOpen } = availability

    const getStatusColor = () => {
        if (isFull) return "text-red-600"
        if (!isRegistrationOpen) return "text-yellow-600"
        if (spotsRemaining <= 5) return "text-yellow-600"
        return "text-green-600"
    }

    const getStatusMessage = () => {
        if (isFull) return "Event is full"
        if (!isRegistrationOpen) return `Registration closed on ${formatEventDate(registrationDeadline)}`
        if (spotsRemaining === 1) return "1 spot remaining"
        return `${spotsRemaining} spots remaining`
    }

    return (
        <div
            className={cn("text-sm", className)}
            {...props}
        >
            <p className={cn("font-medium", getStatusColor())}>
                {getStatusMessage()}
            </p>
            {showDetails && (
                <div className="mt-2 space-y-1 text-muted-foreground">
                    <p>Total capacity: {totalSpots} attendees</p>
                    {isRegistrationOpen && (
                        <p>Registration closes on {formatEventDate(registrationDeadline)}</p>
                    )}
                </div>
            )}
        </div>
    )
} 