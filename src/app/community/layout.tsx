import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Community Hub",
    description: "Share your insights, discoveries, and experiences with our growing AI community",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 