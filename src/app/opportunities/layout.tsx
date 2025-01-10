import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Opportunities",
    description: "Explore opportunities to work with us and make a difference in the world of AI",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function OpportunitiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 