import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    MailIcon,
    LinkIcon,
} from "lucide-react"

interface EventShareProps {
    eventId: string
    eventTitle: string
    trigger?: React.ReactNode
}

export function EventShare({
    eventId,
    eventTitle,
    trigger,
}: EventShareProps) {
    const [isOpen, setIsOpen] = useState(false)
    const eventUrl = `${window.location.origin}/events/${eventId}`
    const encodedTitle = encodeURIComponent(eventTitle)
    const encodedUrl = encodeURIComponent(eventUrl)

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=Check out this event: ${encodedUrl}`,
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl)
            toast.success("Link copied to clipboard!")
        } catch (error) {
            console.error("Failed to copy link:", error)
            toast.error("Failed to copy link")
        }
    }

    const openShareWindow = (url: string) => {
        window.open(url, "_blank", "width=600,height=400")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Share</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share Event</DialogTitle>
                    <DialogDescription>
                        Share this event with your network
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => openShareWindow(shareLinks.facebook)}
                        >
                            <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                            <span className="sr-only">Share on Facebook</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => openShareWindow(shareLinks.twitter)}
                        >
                            <TwitterIcon className="h-5 w-5 text-[#1DA1F2]" />
                            <span className="sr-only">Share on Twitter</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => openShareWindow(shareLinks.linkedin)}
                        >
                            <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />
                            <span className="sr-only">Share on LinkedIn</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => window.location.href = shareLinks.email}
                        >
                            <MailIcon className="h-5 w-5 text-[#000000]" />
                            <span className="sr-only">Share via Email</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            readOnly
                            value={eventUrl}
                            className="bg-muted"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                        >
                            <LinkIcon className="h-4 w-4" />
                            <span className="sr-only">Copy link</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 