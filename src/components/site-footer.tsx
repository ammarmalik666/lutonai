"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteFooter() {
  const pathname = usePathname()

  // Don't render footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="/"
              className="font-medium underline underline-offset-4 hover:text-brand-600"
            >
              Luton AI
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
} 