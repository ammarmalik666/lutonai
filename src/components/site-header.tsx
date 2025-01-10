"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Community", href: "/community" },
  { name: "Sponsorships", href: "/sponsorships" },
  { name: "Opportunities", href: "/opportunities" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#000000]/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-[#C8102E]/10 dark:bg-[#000000]/95">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#C8102E]">Luton AI</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-[#C8102E] ${pathname === item.href
                ? "text-[#C8102E]"
                : "text-[#000000]/60 dark:text-white/60"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn()}
              className="bg-[#C8102E] hover:bg-[#BD0029] text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 