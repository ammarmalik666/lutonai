import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const contactMetadata: Metadata = {
  title: "Contact",
  description: "Get in touch with us",
}

export const registerMetadata: Metadata = {
  title: "Register",
  description: "Join our community of AI innovators",
} 