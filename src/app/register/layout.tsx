import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
    title: "Register",
    description: "Join our community and stay updated with the latest events and opportunities",
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 