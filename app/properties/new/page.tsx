"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/ui/image-upload"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { databaseService } from "@/lib/database"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"

export default function NewPropertyPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [rules, setRules] = useState<string[]>([""])
  const [nearbyPlaces, setNearbyPlaces] = useState<Array<{ name: string; distance: string }>>([
    { name: "", distance: "" },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    address: "",
    roomType: "",
  })

  useEffect(() => {
    if (!authLoading && (!user || user.userType !== "landlord")) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const availableAmenities = [
    "WiFi",
    "Attached Bath",
    "Common Bath",
    "Kitchen",
    "Common Kitchen",
    "Parking",
    "Balcony",
    "Study Table",
    "Wardrobe",
    "AC",
    "Heater",
    "24/7 Water",
    "24/7 Electricity",
    "Security",
    "Laundry",
    "Furnished",
    "Semi-Furnished",
  ]

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
    "Bouddha",
    "Jorpati",
    "Budhanilkantha",
    "Balaju",
    "Kalanki",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...rules]
    newRules[index] = value
    setRules(newRules)
  }

  const addRule = () => {
    setRules([...rules, ""])
  }

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  const handleNearbyPlaceChange = (index: number, field: "name" | "distance", value: string) => {
    const newPlaces = [...nearbyPlaces]
    newPlaces[index][field] = value
    setNearbyPlaces(newPlaces)
  }

  const addNearbyPlace = () => {
    setNearbyPlaces([...nearbyPlaces, { name: "", distance: "" }])
  }

  const removeNearbyPlace = (index: number) => {
    setNearbyPlaces(nearbyPlaces.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a property listing.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your property.",
        variant: "destructive",
      })
      return
    }

    if (amenities.length === 0) {
      toast({
        title: "Amenities required",
        description: "Please select at least one amenity.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, you would upload images to storage first
      const imageUrls = images.map(
        (_, index) => `/placeholder.svg?height=300&width=400&text=Property+Image+${index + 1}`,
      )

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseInt(formData.price),
        location: formData.location,
        address: formData.address,
        roomType: formData.roomType as "single" | "shared" | "apartment" | "hostel",
        amenities,
        images: imageUrls,
        landlordId: user.$id,
        available: true,
        nearbyPlaces: nearbyPlaces.filter((place) => place.name && place.distance),
        rules: rules.filter((rule) => rule.trim()),
      }

      await databaseService.createProperty(propertyData)

      toast({
        title: "Property created successfully!",
        description: "Your property listing is now live and visible to students.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Failed to create property",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || user.userType !== "landlord") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Logged in as {user.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
            <p className="text-gray-600">Create a detailed listing to attract the right students for your property.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Cozy Single Room in Baneshwor"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, its features, and what makes it special for students..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="roomType">Room Type *</Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleInputChange("roomType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room</SelectItem>
                        <SelectItem value="shared">Shared Room</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="hostel">Hostel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Monthly Rent *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="8000"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="location">Area/Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., Baneshwor-10, Near TU Gate, Kathmandu"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Property Images *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onImagesChange={setImages} maxImages={8} />
                <p className="text-sm text-gray-500 mt-2">
                  Upload high-quality images of your property. The first image will be used as the main photo.
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* House Rules */}
            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="e.g., No smoking inside the room"
                      value={rule}
                      onChange={(e) => handleRuleChange(index, e.target.value)}
                    />
                    {rules.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeRule(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addRule}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Places</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nearbyPlaces.map((place, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="e.g., Tribhuvan University"
                      value={place.name}
                      onChange={(e) => handleNearbyPlaceChange(index, "name", e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="e.g., 2.5 km"
                        value={place.distance}
                        onChange={(e) => handleNearbyPlaceChange(index, "distance", e.target.value)}
                      />
                      {nearbyPlaces.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeNearbyPlace(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addNearbyPlace}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Place
                </Button>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Property...
                  </>
                ) : (
                  "Create Property Listing"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
