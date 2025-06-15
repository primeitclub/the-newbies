"use client"

import { useState } from "react"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
  initialFilters?: any
}

export function SearchFilters({ onFiltersChange, initialFilters = {} }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    roomType: "",
    priceRange: [3000, 25000],
    amenities: [],
    ...initialFilters,
  })

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const locations = [
    "Baneshwor",
    "Koteshwor",
    "New Baneshwor",
    "Kirtipur",
    "Pulchowk",
    "Dillibazar",
    "Maharajgunj",
    "Tinkune",
    "Sinamangal",
    "Chabahil",
  ]

  const amenities = [
    "WiFi",
    "Attached Bath",
    "Parking",
    "Kitchen",
    "Laundry",
    "Study Table",
    "Wardrobe",
    "Balcony",
    "AC",
    "Heater",
  ]

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by area, college, or landmark..."
              className="pl-10 h-12"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.roomType} onValueChange={(value) => handleFilterChange("roomType", value)}>
            <SelectTrigger className="w-full md:w-48 h-12">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="shared">Shared Room</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price Range (Rs.)</h3>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                  max={30000}
                  min={2000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span> {filters.priceRange[0].toLocaleString()}</span>
                  <span>{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="font-medium mb-3">Amenities</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const newAmenities = checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter((a: string) => a !== amenity)
                        handleFilterChange("amenities", newAmenities)
                      }}
                    />
                    <label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div>
              <h3 className="font-medium mb-3">Additional Filters</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" />
                  <label htmlFor="verified" className="text-sm">
                    Verified Landlords Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="photos" />
                  <label htmlFor="photos" className="text-sm">
                    With Photos
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="available" />
                  <label htmlFor="available" className="text-sm">
                    Available Now
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            Search Properties
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                search: "",
                location: "",
                roomType: "",
                priceRange: [3000, 25000],
                amenities: [],
              })
              onFiltersChange({})
            }}
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
