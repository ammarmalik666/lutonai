"use client"

import { UploadButton as UTUploadButton } from "@uploadthing/react"
import { toast } from "sonner"

export function UploadButton({ onUploadComplete }: { 
  onUploadComplete: (url: string) => void 
}) {
  return (
    <UTUploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onUploadComplete(res[0].url)
          toast.success("Upload completed")
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`Upload failed: ${error.message}`)
      }}
    />
  )
} 