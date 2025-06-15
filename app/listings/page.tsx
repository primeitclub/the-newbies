"use client"

import { useState } from "react"
import { Search, Filter, MapPin, Star, Heart, Wifi, Car, Utensils, Bath } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { MOCK_PROPERTIES } from "@/lib/mock-data"
export default function ListingsPage() {
  const [priceRange, setPriceRange] = useState([5000, 20000])
  const [showFilters, setShowFilters] = useState(false)

  const listings = [
    {
      id: 1,
      title: "Spacious Single Room in Baneshwor",
      price: "Negotiable",
      location: "Baneshwor, Kathmandu",
      rating: 4.8,
      reviews: 24,
      image: "{MOCK_PROPERTIES.image}?height=200&width=300",
      amenities: ["WiFi", "Attached Bath", "24/7 Water", "Study Table"],
      type: "Single Room",
      available: true,
      landlord: "Ram Sharma",
      phone: "+977-9841234567",
    },
    {
      id: 2,
      title: "Affordable Shared Room Near TU",
      price: "Negotiable",
      location: "Kirtipur, Kathmandu",
      rating: 4.6,
      reviews: 18,
      image: "{MOCK_PROPERTIES.image}?height=200&width=300",
      amenities: ["WiFi", "Common Kitchen", "Wardrobe", "Study Area"],
      type: "Shared Room",
      available: true,
      landlord: "Sita Devi",
      phone: "+977-9851234567",
    },
    {
      id: 3,
      title: "Modern Apartment in New Baneshwor",
      price: "Negotiable",
      location: "New Baneshwor, Kathmandu",
      rating: 4.9,
      reviews: 31,
      image: "",
      amenities: ["Furnished", "Balcony", "Parking", "WiFi"],
      type: "Apartment",
      available: true,
      landlord: "Krishna Bahadur",
      phone: "+977-9861234567",
    },
    {
      id: 4,
      title: "Budget Room in Koteshwor",
      price: "Negotiable",
      location: "Koteshwor, Kathmandu",
      rating: 4.4,
      reviews: 12,
      image: "{MOCK_PROPERTIES.image}height=200&width=300",
      amenities: ["WiFi", "Common Bath", "24/7 Water"],
      type: "Single Room",
      available: true,
      landlord: "Maya Gurung",
      phone: "+977-9871234567",
    },
    {
      id: 5,
      title: "Hostel Style Accommodation",
      price: "Negotiable",
      location: "Pulchowk, Lalitpur",
      rating: 4.2,
      reviews: 45,
      image: "{MOCK_PROPERTIES.image}height=200&width=300",
      amenities: ["Common Kitchen", "Study Hall", "WiFi", "Laundry"],
      type: "Hostel",
      available: true,
      landlord: "Binod Shrestha",
      phone: "+977-9881234567",
    },
    {
      id: 6,
      title: "Premium Room with AC",
      price: "Negotiable",
      location: "Dillibazar, Kathmandu",
      rating: 4.7,
      reviews: 19,
      image: "{MOCK_PROPERTIES.image}height=200&width=300",
      amenities: ["AC", "Attached Bath", "WiFi", "Furnished"],
      type: "Single Room",
      available: false,
      landlord: "Rajesh Maharjan",
      phone: "+977-9891234567",
    },
  ]

  const amenityIcons = {
    WiFi: <Wifi className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    "Common Kitchen": <Utensils className="w-4 h-4" />,
    "Attached Bath": <Bath className="w-4 h-4" />,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm"><img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" /></span>
            </div>
            <span className="text-xl font-bold text-gray-900">GharDera</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/listings" className="text-blue-600 font-medium">
              Browse Rooms
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600">
              How It Works
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
              Contact
            </Link>
            <Button variant="outline">Sign In</Button>
            <Button>List Your Property</Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search by area, college, or landmark..."
                  className="h-12 pl-10"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="h-12">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium mb-3">Room Type</h3>
                <div className="space-y-2">
                  {["Single Room", "Shared Room", "Apartment", "Hostel"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={25000}
                    min={3000}
                    step={500}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span> {priceRange[0]}</span>
                    <span> {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Amenities</h3>
                <div className="space-y-2">
                  {["WiFi", "Attached Bath", "Parking", "Kitchen"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={amenity} />
                      <label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <div className="space-y-2">
                  {["Baneshwor", "Koteshwor", "New Baneshwor", "Kirtipur"].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox id={location} />
                      <label htmlFor={location} className="text-sm">
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Available Rooms ({listings.length} found)</h1>
          <select className="px-4 py-2 border border-gray-300 rounded-md">
            <option>Sort by: Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className={`absolute top-2 left-2 ${listing.available ? "bg-green-600" : "bg-red-600"}`}>
                  {listing.available ? "Available" : "Occupied"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{listing.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {listing.amenities.slice(0, 3).map((amenity, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {listing.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{listing.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    Rs. {listing.price.toLocaleString()}
                    <span className="text-sm text-gray-500"></span>
                  </span>
                  <Badge variant="outline">{listing.type}</Badge>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p>Landlord: {listing.landlord}</p>
                  <p>{listing.phone}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/listings/${listing.id}`}>View Details</Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Rooms
          </Button>
        </div>
      </div>
    </div>
  )
}
