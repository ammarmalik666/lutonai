"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Community", href: "/community" },
  { name: "Sponsorships", href: "/sponsorships" },
  { name: "Projects", href: "/projects" },
  { name: "Opportunities", href: "/opportunities" },
  { name: "AI Courses", href: "https://www.beds.ac.uk/courses/artificial-intelligence/" },
  { name: "AI Driving Licence course", href: "/ai-driving-licence-course" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Don't render header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#000000]/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-[#C8102E]/10 dark:bg-[#000000]/95">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Luton AI Logo"
              width={130}
              height={35}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`text-sm font-medium transition-colors hover:text-[#C8102E] ${
                pathname === item.href
                  ? "text-[#C8102E]"
                  : "text-[#000000]/60 dark:text-white/60"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === item.href
                    ? "text-[#C8102E] bg-[#C8102E]/5"
                    : "text-[#000000]/60 dark:text-white/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
} 