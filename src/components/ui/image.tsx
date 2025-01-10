import React from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface Props extends Omit<ImageProps, "alt"> {
  alt: string
  fallback?: string
}

export function SafeImage({ className, alt, fallback, ...props }: Props) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  return (
    <div className={cn("relative", className)}>
      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100"
        )}
        onLoadingComplete={() => setLoading(false)}
        onError={() => setError(true)}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      {error && fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          {fallback}
        </div>
      )}
    </div>
  )
} 