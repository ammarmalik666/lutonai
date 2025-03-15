"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    HomeIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserGroupIcon,
    FolderIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline"
import { UserPlus } from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Posts", href: "/admin/posts", icon: DocumentTextIcon },
    { name: "Events", href: "/admin/events", icon: CalendarIcon },
    { name: "Sponsors", href: "/admin/sponsors", icon: UserGroupIcon },
    { name: "Projects", href: "/admin/projects", icon: FolderIcon },
    { name: "Opportunities", href: "/admin/opportunities", icon: BriefcaseIcon },
    { name: "Registrations", href: "/admin/registrations", icon: UserPlus },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-gray-900">
            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                    isActive
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                        isActive
                                            ? "text-white"
                                            : "text-gray-400 group-hover:text-white"
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
} 