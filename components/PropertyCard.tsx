"use client"

import type React from "react"

import { useState } from "react"
import { Heart, MapPin, Star, Wifi, Bath, Car, Users, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/database"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PropertyCardProps {
  property: Property
  onFavoriteToggle?: (propertyId: string, isFavorite: boolean) => void
  isFavorite?: boolean
  featured?: boolean
}

export function PropertyCard({ property, onFavoriteToggle, isFavorite = false, featured = false }: PropertyCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(isFavorite)
  const [isHovered, setIsHovered] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save properties to favorites",
      })
      return
    }

    if (!property.$id) return

    setIsLiked(!isLiked)
    onFavoriteToggle?.(property.$id, !isLiked)
  }

  const amenityIcons = {
    WiFi: <Wifi className="w-3 h-3" />,
    Parking: <Car className="w-3 h-3" />,
    "Attached Bath": <Bath className="w-3 h-3" />,
    "Common Bath": <Bath className="w-3 h-3" />,
    Shared: <Users className="w-3 h-3" />,
  }

  // Don't render the card if there's no ID
  if (!property.$id) {
    console.warn("Property missing ID:", property.title)
    return null
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 group hover:shadow-lg ${
        featured ? "border-blue-200 shadow-md" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/properties/${property.$id}`}>
        <div className="relative">
          <img
            src={property.images[0] || "{MOCK_PROPERTIES.image}height=200&width=300"}
            alt={property.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {featured && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          )}

          {user && (
            <Button
              size="sm"
              variant="ghost"
              className={`absolute top-2 right-2 w-8 h-8 p-0 rounded-full transition-all ${
                isLiked ? "bg-red-100 text-red-600" : "bg-white/80 text-gray-600"
              } hover:bg-white ${isHovered ? "opacity-100" : "opacity-80"}`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          )}

          <Badge
            className={`absolute top-2 left-2 ${
              property.available ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {property.available ? "Available" : "Occupied"}
          </Badge>

          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs bg-white/90">
              {property.roomType}
            </Badge>
          </div>

          {featured && <Badge className="absolute top-2 right-12 bg-blue-600 hover:bg-blue-700">Featured</Badge>}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center ml-2 shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.8</span>
            </div>
          </div>

          <p className="text-gray-600 mb-3 flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" />
            <span className="line-clamp-1">{property.location}</span>
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1 bg-gray-50">
                {amenityIcons[amenity as keyof typeof amenityIcons] || <Check className="w-3 h-3" />}
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">{property.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500"></span>
            </div>
            <Button size="sm" className="shrink-0 group-hover:bg-blue-700 transition-colors">
              View Details
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
