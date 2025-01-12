"use client"

import { SessionProvider } from "next-auth/react"
import AdminNavbar from "@/components/admin/Navbar"
import Sidebar from "@/components/admin/Sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <div className="min-h-screen bg-black">
                <AdminNavbar />
                <div className="flex h-[calc(100vh-64px)]">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto p-8">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    )
} 