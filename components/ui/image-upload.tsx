"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void
  maxImages?: number
  existingImages?: string[]
  className?: string
}

export function ImageUpload({ onImagesChange, maxImages = 5, existingImages = [], className }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>(existingImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = maxImages - images.length - existingImages.length
    const newFiles = files.slice(0, remainingSlots)

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...newFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
    onImagesChange([...images, ...newFiles])
  }

  const removeImage = (index: number) => {
    const isExisting = index < existingImages.length

    if (isExisting) {
      // Remove from existing images
      const newExisting = existingImages.filter((_, i) => i !== index)
      setPreviews((prev) => prev.filter((_, i) => i !== index))
    } else {
      // Remove from new images
      const newIndex = index - existingImages.length
      const newImages = images.filter((_, i) => i !== newIndex)
      const newPreviews = previews.filter((_, i) => i !== index)

      setImages(newImages)
      setPreviews(newPreviews)
      onImagesChange(newImages)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {previews.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
          >
            <Upload className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Add Image</span>
          </button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />

      <p className="text-sm text-gray-500">
        {previews.length}/{maxImages} images uploaded
      </p>
    </div>
  )
}
