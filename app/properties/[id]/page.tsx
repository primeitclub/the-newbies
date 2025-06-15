"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Share2,
  Heart,
  Calendar,
  Shield,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Info,
  Wifi,
  Bath,
  Car,
  Users,
  Zap,
  Coffee,
  Tv,
  Thermometer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Rating } from "@/components/ui/rating"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { databaseService, type Property, type Review } from "@/lib/database"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PropertyMap } from "@/components/PropertyMap"
import type { JSX } from "react"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const imageSliderRef = useRef<HTMLDivElement>(null)
  const [showImageGallery, setShowImageGallery] = useState(false)

  const [bookingData, setBookingData] = useState({
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 1 week from now
    message: "",
    phone: "",
  })

  useEffect(() => {
    if (params.id) {
      loadProperty()
      loadReviews()
    } else {
      setError("No property ID provided")
      setLoading(false)
    }
  }, [params.id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      setError(null)

      const propertyId = params.id as string
      console.log("Loading property with ID:", propertyId)

      const response = await databaseService.getProperty(propertyId)
      console.log("Property loaded:", response)

      setProperty(response as Property)

      // Load similar properties
      loadSimilarProperties(response as Property)
    } catch (error: any) {
      console.error("Error loading property:", error)
      setError(error.message || "Failed to load property")
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }

  const loadSimilarProperties = async (currentProperty: Property) => {
    try {
      // Get properties with same room type or location
      const response = await databaseService.getProperties({
        roomType: currentProperty.roomType,
      })

      // Filter out current property and limit to 3
      const filtered = response.documents.filter((p) => p.$id !== currentProperty.$id).slice(0, 3)

      setSimilarProperties(filtered as Property[])
    } catch (error) {
      console.error("Error loading similar properties:", error)
    }
  }

  const loadReviews = async () => {
    try {
      const propertyId = params.id as string
      const response = await databaseService.getPropertyReviews(propertyId)
      setReviews(response.documents as Review[])
    } catch (error) {
      console.error("Error loading reviews:", error)
      setReviews([])
    }
  }

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to book this property",
      })
      router.push("/auth/login")
      return
    }

    if (!property) return

    // Validate booking data
    if (!bookingData.startDate || !bookingData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      await databaseService.createBooking({
        propertyId: property.$id!,
        studentId: user.$id,
        landlordId: property.landlordId,
        startDate: bookingData.startDate,
        status: "pending",
        totalAmount: property.price,
        paymentStatus: "pending",
      })

      toast({
        title: "Booking request sent successfully!",
        description: "The landlord will review your request and contact you within 24 hours.",
      })

      setShowBookingForm(false)

      // Reset form
      setBookingData({
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        message: "",
        phone: "",
      })
    } catch (error: any) {
      console.error("Booking error:", error)
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!user || !property) {
      router.push("/auth/login")
      return
    }

    try {
      setIsFavorite(!isFavorite)

      if (!isFavorite) {
        await databaseService.addToFavorites(user.$id, property.$id!)
        toast({
          title: "Added to favorites",
          description: "Property has been added to your favorites",
        })
      } else {
        await databaseService.removeFromFavorites(user.$id, property.$id!)
        toast({
          title: "Removed from favorites",
          description: "Property has been removed from your favorites",
        })
      }
    } catch (error) {
      setIsFavorite(!isFavorite) // Revert on error
      toast({
        title: "Action failed",
        description: "Could not update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || "GharDera",
          text: `Check out this property: ${property?.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Property link copied to clipboard",
      })
    }
  }

  const nextImage = () => {
    if (!property) return
    setCurrentImage((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    if (!property) return
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const amenityIcons: Record<string, JSX.Element> = {
    WiFi: <Wifi className="w-4 h-4" />,
    "Attached Bath": <Bath className="w-4 h-4" />,
    "Common Bath": <Bath className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    Kitchen: <Coffee className="w-4 h-4" />,
    "Common Kitchen": <Coffee className="w-4 h-4" />,
    Shared: <Users className="w-4 h-4" />,
    "24/7 Water": <Zap className="w-4 h-4" />,
    TV: <Tv className="w-4 h-4" />,
    AC: <Thermometer className="w-4 h-4" />,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/properties" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
            <p className="text-gray-600 mb-2">
              {error || "The property you're looking for doesn't exist or may have been removed."}
            </p>
            <p className="text-sm text-gray-500 mb-6">Property ID: {params.id}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/properties">
                <Button>Browse All Properties</Button>
              </Link>
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 4.8

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Properties</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={isFavorite ? "text-red-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Property Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </div>
            <Badge className={property.available ? "bg-green-600" : "bg-red-600"}>
              {property.available ? "Available" : "Occupied"}
            </Badge>
            <Badge variant="outline">{property.roomType}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImage] || "{MOCK_PROPERTIES.image}height=400&width=600"}
                  alt={property.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => setShowImageGallery(true)}
                />

                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        prevImage()
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        nextImage()
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImage + 1} / {property.images.length}
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImage(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index ? "bg-white w-4" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 p-4 overflow-x-auto" ref={imageSliderRef}>
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === index ? "border-blue-500 scale-105" : "border-gray-200"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Full-screen Image Gallery Dialog */}
            <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
              <DialogContent className="max-w-5xl w-full p-0 bg-black/95">
                <div className="relative h-[80vh] flex items-center justify-center">
                  <img
                    src={property.images[currentImage] || "/placeholder.svg?height=800&width=1200"}
                    alt={property.title}
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Navigation Buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 bg-black/30 text-white hover:bg-black/50 rounded-full"
                    onClick={() => setShowImageGallery(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {currentImage + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 p-4 overflow-x-auto bg-black/80">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === index ? "border-blue-500 scale-110" : "border-gray-700"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Property Details Tabs */}
            <Card>
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="pb-0">
                  <TabsList className="grid grid-cols-4 mb-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">About this property</h3>
                        <div className="text-2xl font-bold text-blue-600">
                          {property.price.toLocaleString()}
                          <span className="text-sm text-gray-500"></span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-green-600" />
                            House Rules
                          </h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {property.rules.map((rule, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>

<div>
  <h4 className="font-semibold mb-2 flex items-center">
    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
    Nearby Places
  </h4>
  <ul className="space-y-2 text-sm text-gray-600">
    {(Array.isArray(property.nearbyPlaces) ? property.nearbyPlaces : []).map((place, index) => (
      <li key={index} className="flex justify-between">
        <span>{place.name}</span>
        <span className="text-blue-600 font-medium">{place.distance}</span>
      </li>
    ))}
  </ul>
</div>

                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="amenities">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            {amenityIcons[amenity] || <Check className="w-4 h-4 text-blue-600" />}
                          </div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="location">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Location</h3>
                        <Badge variant="outline" className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location}
                        </Badge>
                      </div>

                      <div className="h-[300px] bg-gray-100 rounded-lg overflow-hidden">
                        <PropertyMap
                          location={property.location}
                          coordinates={property.coordinates}
                          title={property.title}
                        />
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Address</h4>
                        <p className="text-gray-700">{property.address}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Nearby Facilities</h4>
                        <div>
  <h4 className="font-semibold mb-2 flex items-center">
    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
    Nearby Places
  </h4>
  <ul className="space-y-2 text-sm text-gray-600">
    {(Array.isArray(property.nearbyPlaces) ? property.nearbyPlaces : []).map((place, index) => (
      <li key={index} className="flex justify-between">
        <span>{place.name}</span>
        <span className="text-blue-600 font-medium">{place.distance}</span>
      </li>
    ))}
  </ul>
</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                          <div className="flex items-center">
                            <Rating value={averageRating} readonly size="sm" />
                            <span className="ml-2 text-sm text-gray-600">{reviews.length} reviews</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() =>
                            toast({
                              title: "Feature coming soon",
                              description: "You'll be able to write reviews in the next update!",
                            })
                          }
                        >
                          Write a Review
                        </Button>
                      </div>

                      {/* Review List */}
                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.$id} className="border-b pb-4 last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback>{review.studentId.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">Student</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </div>
                                  </div>
                                </div>
                                <Rating value={review.rating} readonly size="sm" />
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Star className="w-8 h-8 text-gray-400" />
                            </div>
                            <p>No reviews yet. Be the first to review this property!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Properties</CardTitle>
                  <CardDescription>Other properties you might be interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {similarProperties.map((similarProperty) => (
                      <Link href={`/properties/${similarProperty.$id}`} key={similarProperty.$id} className="group">
                        <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-md">
                          <div className="relative h-36">
                            <img
                              src={similarProperty.images[0] || "{MOCK_PROPERTIES.image}height=200&width=300"}
                              alt={similarProperty.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge
                              className={`absolute top-2 left-2 ${similarProperty.available ? "bg-green-600" : "bg-red-600"}`}
                            >
                              {similarProperty.available ? "Available" : "Occupied"}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {similarProperty.title}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm text-gray-600">{similarProperty.location}</span>
                              <span className="font-bold text-blue-600">
                                {similarProperty.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Link href="/properties">
                    <Button variant="outline">View All Properties</Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="border-blue-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-blue-600">
                      {property.price.toLocaleString()}
                    </CardTitle>
                    <CardDescription>per month</CardDescription>
                  </div>
                  <Badge className={property.available ? "bg-green-600" : "bg-red-600"}>
                    {property.available ? "Available Now" : "Currently Occupied"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-col gap-3">
                  {property.available ? (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (!user) {
                            toast({
                              title: "Authentication required",
                              description: "Please sign in to book this property",
                            })
                            router.push("/auth/login")
                            return
                          }
                          setShowBookingForm(!showBookingForm)
                        }}
                        disabled={!property.available}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {property.available ? "Book Now" : "Not Available"}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Landlord
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full" variant="secondary">
                        <Calendar className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Landlord
                      </Button>
                    </>
                  )}

                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    className={`w-full ${isFavorite ? "bg-red-50 text-red-600 border-red-200" : ""}`}
                    onClick={handleFavoriteToggle}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                    {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 text-center w-full">
                  No booking fees • Direct contact with landlord
                </p>
              </CardFooter>
            </Card>

            {/* Booking Form */}
            {showBookingForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Book This Property</CardTitle>
                  <CardDescription>Fill out the form to request a booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleBooking()
                    }}
                  >
                    <div>
                      <Label htmlFor="startDate">Move-in Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone number"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message to Landlord</Label>
                      <Textarea
                        id="message"
                        placeholder="Hi, I'm interested in this room..."
                        rows={4}
                        value={bookingData.message}
                        onChange={(e) => setBookingData((prev) => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Sending...
                          </>
                        ) : (
                          "Send Request"
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Landlord Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {property.landlordId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      Landlord
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Shield className="w-4 h-4 text-green-600 ml-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified Landlord</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm text-gray-600">Verified • 5 properties</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Always visit the property in person
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Verify landlord identity and documents
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Read rental agreement carefully
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Don't pay full advance without agreement
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Keep all payment receipts safe
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start">
                  <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Report suspicious listings to our support team for immediate investigation.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
