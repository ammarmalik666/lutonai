"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#C8102E] hover:bg-[#BD0029] text-white shadow-lg hover:shadow-[#00000020] hover:scale-105 active:scale-95",
        destructive:
          "bg-[#C8102E] text-white shadow-lg hover:bg-[#BD0029] hover:scale-105 active:scale-95",
        outline:
          "border-2 border-[#C8102E] text-[#C8102E] bg-transparent shadow-lg hover:bg-[#C8102E]/10 hover:scale-105 active:scale-95",
        secondary:
          "bg-[#000000] text-white shadow-lg hover:bg-[#BD0029] hover:scale-105 active:scale-95",
        ghost:
          "hover:bg-[#C8102E]/10 hover:text-[#C8102E] hover:scale-105",
        link:
          "text-[#C8102E] underline-offset-4 hover:underline hover:text-[#BD0029]",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-md px-4 text-xs",
        lg: "h-14 rounded-lg px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonVariants = NonNullable<Parameters<typeof buttonVariants>[0]>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  loading?: boolean
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "opacity-50 cursor-not-allowed"
        )}
        disabled={loading}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 