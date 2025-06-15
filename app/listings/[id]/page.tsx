"use client"

import { useState } from "react"
import { ArrowLeft, Star, MapPin, Phone, Mail, Share2, Heart, Wifi, Bath, Bed, Home, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ListingDetailPage() {
  const [currentImage, setCurrentImage] = useState(0)

  const listing = {
    id: 1,
    title: "Spacious Single Room in Baneshwor",
    price: "Negotiable",
    location: "Baneshwor, Kathmandu",
    rating: 4.8,
    reviews: 24,
    images: [
      "{MOCK_PROPERTIES.image}height=400&width=600",
      "{MOCK_PROPERTIES.image}height=400&width=600",
      "{MOCK_PROPERTIES.image}height=400&width=600",
      "{MOCK_PROPERTIES.image}height=400&width=600",
    ],
    amenities: [
      { name: "WiFi", icon: <Wifi className="w-4 h-4" /> },
      { name: "Attached Bathroom", icon: <Bath className="w-4 h-4" /> },
      { name: "24/7 Water Supply", icon: <Home className="w-4 h-4" /> },
      { name: "Study Table", icon: <Bed className="w-4 h-4" /> },
      { name: "Wardrobe", icon: <Home className="w-4 h-4" /> },
      { name: "Balcony", icon: <Home className="w-4 h-4" /> },
    ],
    type: "Single Room",
    available: true,
    landlord: {
      name: "Ram Sharma",
      phone: "+977-9841234567",
      email: "ram.sharma@email.com",
      verified: true,
      rating: 4.9,
      properties: 5,
    },
    description:
      "This spacious single room is perfect for students looking for comfortable accommodation in Baneshwor. The room comes with all basic amenities and is located in a safe neighborhood with easy access to public transportation. The building has 24/7 security and the landlord is very cooperative.",
    rules: [
      "No smoking inside the room",
      "No loud music after 10 PM",
      "Visitors allowed until 9 PM",
      "Monthly rent to be paid by 5th of each month",
    ],
    nearbyPlaces: [
      { name: "Tribhuvan University", distance: "2.5 km" },
      { name: "Baneshwor Bus Stop", distance: "200 m" },
      { name: "Local Market", distance: "300 m" },
      { name: "Hospital", distance: "1 km" },
    ],
  }

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent room with all amenities. The landlord is very helpful and the location is perfect for students.",
    },
    {
      id: 2,
      name: "Rajesh Thapa",
      rating: 4,
      date: "1 month ago",
      comment: "Good room, clean and well-maintained. WiFi speed is excellent. Highly recommended.",
    },
    {
      id: 3,
      name: "Sita Gurung",
      rating: 5,
      date: "2 months ago",
      comment: "Perfect for students! Safe area and very convenient location. The room is exactly as shown in photos.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/listings" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Listings</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={listing.images[currentImage] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {listing.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-3 h-3 rounded-full ${currentImage === index ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 p-4">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        {listing.rating} ({listing.reviews} reviews)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600"> {listing.price.toLocaleString()}</div>
                    <div className="text-gray-500">per month</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {amenity.icon}
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{listing.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">House Rules</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {listing.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Nearby Places</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {listing.nearbyPlaces.map((place, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{place.name}</span>
                          <span className="text-blue-600">{place.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{review.name}</div>
                            <div className="text-xs text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Landlord */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarFallback>{listing.landlord.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {listing.landlord.name}
                      {listing.landlord.verified && <Shield className="w-4 h-4 text-green-600 ml-1" />}
                    </div>
                    <div className="text-sm text-gray-600">
                      {listing.landlord.rating} ★ • {listing.landlord.properties} properties
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {listing.landlord.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Your phone number" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Hi, I'm interested in this room. When can I visit?" rows={4} />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Always visit the property in person</li>
                  <li>• Verify landlord identity</li>
                  <li>• Read agreement carefully</li>
                  <li>• Don't pay full advance without agreement</li>
                  <li>• Keep all payment receipts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
