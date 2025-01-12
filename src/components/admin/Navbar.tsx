"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function AdminNavbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/admin/dashboard" className="text-xl font-bold text-white">
                            Admin Panel
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {session?.user && (
                            <>
                                <span className="text-gray-300">
                                    {session.user.email}
                                </span>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
} 