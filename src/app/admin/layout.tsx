"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/animations"

const navigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Posts", href: "/admin/posts" },
    { name: "Events", href: "/admin/events" },
    { name: "Sponsors", href: "/admin/sponsors" },
    { name: "Opportunities", href: "/admin/opportunities" },
    { name: "Users", href: "/admin/users" },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { data: session, status } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        } else if (session?.user?.role !== "ADMIN") {
            router.push("/")
        }
    }, [session, status, router])

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-[#000000]">
                <div className="text-lg text-white">Loading...</div>
            </div>
        )
    }

    if (session?.user?.role !== "ADMIN") {
        return null
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <motion.div
                className="w-64 bg-[#000000] text-white shadow-lg"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-6 border-b border-[#C8102E]/20">
                    <h2 className="text-2xl font-bold text-[#C8102E]">Admin Dashboard</h2>
                    <p className="mt-2 text-sm text-white/60">Manage your content and users</p>
                </div>
                <nav className="mt-6 px-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <motion.div
                                className={`my-1 flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${pathname === item.href
                                    ? "bg-[#C8102E] text-white"
                                    : "text-white/60 hover:bg-[#C8102E]/20 hover:text-white"
                                    }`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {item.name}
                            </motion.div>
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-64 border-t border-[#C8102E]/20 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-[#C8102E]" />
                        <div>
                            <p className="text-sm font-medium text-white">{session.user.name}</p>
                            <p className="text-xs text-white/60">{session.user.email}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main content */}
            <motion.div
                className="flex-1 bg-[#000000] overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="min-h-screen p-8">
                    {children}
                </div>
            </motion.div>
        </div>
    )
} 