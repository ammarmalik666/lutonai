import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with us for any questions or inquiries",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 