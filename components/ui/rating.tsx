"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Rating({ value, onChange, readonly = false, size = "md", className }: RatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("transition-colors", !readonly && "hover:scale-110", readonly && "cursor-default")}
        >
          <Star
            className={cn(sizeClasses[size], star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
          />
        </button>
      ))}
    </div>
  )
}
