"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"

interface AdvancedSearchProps {
  onFiltersChange?: (filters: any) => void
  initialFilters?: any
  className?: string
  variant?: "full" | "compact" | "minimal"
}

export function AdvancedSearch({
  onFiltersChange,
  initialFilters = {},
  className = "",
  variant = "full",
}: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    roomType: "",
    priceRange: [3000, 25000],
    amenities: [] as string[],
    ...initialFilters,
  })

  // Initialize filters from URL params if available
  useEffect(() => {
    const search = searchParams.get("search") || ""
    const location = searchParams.get("location") || ""
    const roomType = searchParams.get("roomType") || ""
    const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : 3000
    const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : 25000
    const amenities = searchParams.get("amenities") ? searchParams.get("amenities")!.split(",") : []

    setFilters({
      search,
      location,
      roomType,
      priceRange: [minPrice, maxPrice],
      amenities,
    })

    // Calculate active filters
    calculateActiveFilters({
      search,
      location,
      roomType,
      priceRange: [minPrice, maxPrice],
      amenities,
    })
  }, [searchParams])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    calculateActiveFilters(newFilters)

    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const calculateActiveFilters = (currentFilters: any) => {
    const active: string[] = []

    if (currentFilters.search) active.push("search")
    if (currentFilters.location) active.push("location")
    if (currentFilters.roomType) active.push("roomType")
    if (currentFilters.amenities.length > 0) active.push("amenities")
    if (currentFilters.priceRange[0] > 3000 || currentFilters.priceRange[1] < 25000) active.push("price")

    setActiveFilters(active)
  }

  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams()

    if (filters.search) params.set("search", filters.search)
    if (filters.location) params.set("location", filters.location)
    if (filters.roomType) params.set("roomType", filters.roomType)
    if (filters.priceRange[0] > 3000) params.set("minPrice", filters.priceRange[0].toString())
    if (filters.priceRange[1] < 25000) params.set("maxPrice", filters.priceRange[1].toString())
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","))

    // Navigate to properties page with filters
    router.push(`/properties?${params.toString()}`)
  }

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      location: "",
      roomType: "",
      priceRange: [3000, 25000],
      amenities: [],
    }

    setFilters(defaultFilters)
    calculateActiveFilters(defaultFilters)

    if (onFiltersChange) {
      onFiltersChange({})
    }

    // Clear URL params
    router.push("/properties")
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
    "Common Bath",
    "Parking",
    "Kitchen",
    "Common Kitchen",
    "Laundry",
    "Study Table",
    "Wardrobe",
    "Balcony",
    "AC",
    "Heater",
  ]

  const roomTypes = [
    { value: "single", label: "Single Room" },
    { value: "shared", label: "Shared Room" },
    { value: "apartment", label: "Apartment" },
    { value: "hostel", label: "Hostel" },
  ]

  // Minimal variant - just a search box with button
  if (variant === "minimal") {
    return (
      <div className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by area, college, or landmark..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    )
  }

  // Compact variant - search box with dropdown filters
  if (variant === "compact") {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by area, college, or landmark..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFilters.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Tabs defaultValue="location">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="price">Price</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                </TabsList>

                <TabsContent value="location">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Location</label>
                      <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                        <SelectTrigger>
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
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Room Type</label>
                      <Select value={filters.roomType} onValueChange={(value) => handleFilterChange("roomType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          {roomTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="price">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price Range </label>
                    <div className="space-y-4 px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange("priceRange", value)}
                        max={30000}
                        min={2000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{filters.priceRange[0].toLocaleString()}</span>
                        <span>{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Amenities</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={filters.amenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              const newAmenities = checked
                                ? [...filters.amenities, amenity]
                                : filters.amenities.filter((a: string) => a !== amenity)
                              handleFilterChange("amenities", newAmenities)
                            }}
                          />
                          <label htmlFor={`amenity-${amenity}`} className="text-sm">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button size="sm" onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.includes("location") && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                <MapPin className="w-3 h-3" />
                {filters.location}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("location", "")} />
              </Badge>
            )}
            {activeFilters.includes("roomType") && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                {roomTypes.find((t) => t.value === filters.roomType)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("roomType", "")} />
              </Badge>
            )}
            {activeFilters.includes("price") && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                 {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("priceRange", [3000, 25000])} />
              </Badge>
            )}
            {activeFilters.includes("amenities") && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                {filters.amenities.length} Amenities
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("amenities", [])} />
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full variant - complete search interface
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by area, college, or landmark..."
            className="pl-10 h-12"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Location Filter */}
        <div className="min-w-[200px]">
          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger className="h-12">
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
        </div>

        {/* Room Type Filter */}
        <div className="min-w-[180px]">
          <Select value={filters.roomType} onValueChange={(value) => handleFilterChange("roomType", value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {roomTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Button */}
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More Filters
          {activeFilters.length > 2 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilters.length - 2}
            </Badge>
          )}
        </Button>

        {/* Search Button */}
        <Button onClick={handleSearch} className="h-12 px-8">
          Search
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">Price Range (Rs.)</label>
              <div className="space-y-4 px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                  max={30000}
                  min={2000}
                  step={500}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.priceRange[0].toLocaleString()}</span>
                  <span>{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="text-sm font-medium mb-3 block">Amenities</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`full-amenity-${amenity}`}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const newAmenities = checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter((a: string) => a !== amenity)
                        handleFilterChange("amenities", newAmenities)
                      }}
                    />
                    <label htmlFor={`full-amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary">
                    {filter === "search" && "Search"}
                    {filter === "location" && filters.location}
                    {filter === "roomType" && roomTypes.find((t) => t.value === filters.roomType)?.label}
                    {filter === "price" &&
                      ` ${filters.priceRange[0].toLocaleString()} - Rs. ${filters.priceRange[1].toLocaleString()}`}
                    {filter === "amenities" && `${filters.amenities.length} Amenities`}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
