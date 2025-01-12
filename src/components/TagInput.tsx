"use client"

import { useState, KeyboardEvent } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
}

export default function TagInput({ tags, onChange, placeholder }: TagInputProps) {
    const [input, setInput] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Only process tab and comma
        if (e.key !== 'Tab' && e.key !== ',') return
        
        e.preventDefault()
        const value = input.trim()
        if (!value) return

        // Don't add duplicate tags
        if (tags.includes(value)) {
            setInput("")
            return
        }

        onChange([...tags, value])
        setInput("")
    }

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove))
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-[#222222] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition-colors"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-[#000000] border border-[#222222] text-white rounded-lg p-3 focus:outline-none focus:border-[#222222]"
            />
            <p className="text-gray-400 text-sm mt-1">
                Press Tab or comma to add a tag
            </p>
        </div>
    )
} 