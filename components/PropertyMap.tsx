"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  location: string
  coordinates?: { lat: number; lng: number }
  title: string
  className?: string
}

export function PropertyMap({ location, coordinates, title, className = "" }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would integrate with Google Maps, Mapbox, or OpenStreetMap
    // For now, we'll show a placeholder with location info
  }, [coordinates, location])

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Map Placeholder */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{location}</p>
          {coordinates?.lat != null && coordinates?.lng != null && (
  <p className="text-xs text-gray-500 mt-1">
    {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
  </p>
)}

        </div>
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
          +
        </button>
        <button className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
          −
        </button>
      </div>

      {/* Location Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
      </div>
    </div>
  )
}
