"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, MapPin, SlidersHorizontal, Grid, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyCard } from "@/components/PropertyCard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { databaseService, type Property } from "@/lib/database"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function PropertiesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    roomType: searchParams.get("roomType") || "",
    priceRange: [
      Number.parseInt(searchParams.get("minPrice") || "3000"),
      Number.parseInt(searchParams.get("maxPrice") || "25000"),
    ],
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
    available: true,
    sortBy: "newest",
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  })

  useEffect(() => {
    loadProperties()
    if (user) {
      loadFavorites()
    }
  }, [filters, pagination.page])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await databaseService.getProperties({
        ...filters,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        page: pagination.page,
        limit: pagination.limit,
      })

      setProperties(response.documents as Property[])
      setPagination((prev) => ({ ...prev, total: response.total }))
    } catch (error) {
      console.error("Error loading properties:", error)
      toast({
        title: "Error loading properties",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    if (!user) return

    try {
      const response = await databaseService.getUserFavorites(user.$id)
      setFavorites(response.documents.map((fav: any) => fav.propertyId))
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const handleFavoriteToggle = async (propertyId: string, isFavorite: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save properties",
      })
      router.push("/auth/login")
      return
    }

    try {
      if (isFavorite) {
        await databaseService.addToFavorites(user.$id, propertyId)
        setFavorites((prev) => [...prev, propertyId])
        toast({
          title: "Added to favorites",
          description: "Property saved to your favorites",
        })
      } else {
        await databaseService.removeFromFavorites(user.$id, propertyId)
        setFavorites((prev) => prev.filter((id) => id !== propertyId))
        toast({
          title: "Removed from favorites",
          description: "Property removed from favorites",
        })
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Could not update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      roomType: "",
      priceRange: [3000, 25000],
      amenities: [],
      available: true,
      sortBy: "newest",
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
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
  ]

  const roomTypes = [
    { value: "single", label: "Single Room" },
    { value: "shared", label: "Shared Room" },
    { value: "apartment", label: "Apartment" },
    { value: "hostel", label: "Hostel" },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm"><img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" /></span>
              </div>
              <span className="text-xl font-bold text-gray-900">GharDera</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              {user?.userType === "landlord" && (
                <Link href="/properties/new">
                  <Button>Add Property</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by area, college, landmark..."
                className="pl-10 h-12"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
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
                <SelectTrigger className="w-48">
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

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Advanced Filters
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range (Rs.)</label>
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
                        <span>{filters.priceRange[0].toLocaleString()}</span>
                        <span>{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amenities</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={filters.amenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              const newAmenities = checked
                                ? [...filters.amenities, amenity]
                                : filters.amenities.filter((a) => a !== amenity)
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

                  {/* Sort Options */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.search ? `Search results for "${filters.search}"` : "All Properties"}
              </h1>
              <p className="text-gray-600">{loading ? "Loading..." : `${pagination.total} properties found`}</p>
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="map">
                    <Map className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <Tabs value={viewMode}>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.$id}
                    property={property}
                    isFavorite={favorites.includes(property.$id!)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-64 h-48 flex-shrink-0">
                        <img
                          src={property.images[0] || "{MOCK_PROPERTIES.image}height=200&width=300"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold">{property.title}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {property.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">per month</div>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.location}
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {property.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {property.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{property.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>

                          <Link href={`/properties/${property.$id}`}>
                            <Button>View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View Coming Soon</h3>
                  <p className="text-gray-600">Interactive map with property locations will be available soon.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Pagination */}
        {!loading && properties.length > 0 && (
          <div className="flex items-center justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }, (_, i) => i + 1)
                  .slice(Math.max(0, pagination.page - 3), pagination.page + 2)
                  .map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page }))}
                    >
                      {page}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}
