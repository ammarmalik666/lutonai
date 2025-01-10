import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Sponsorships",
    description: "Partner with us to shape the future of AI and make a lasting impact in the tech community",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function SponsorshipsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 