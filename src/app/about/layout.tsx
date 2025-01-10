import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about our mission and team",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 