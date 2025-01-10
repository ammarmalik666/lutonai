import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Events",
    description: "Stay updated with our latest news and events",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 