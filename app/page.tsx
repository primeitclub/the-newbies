"use client"

import React from "react"
import { useEffect, useState } from "react"
import { Search, MapPin, Users, Shield, Phone, Mail, TrendingUp, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyCard } from "@/components/PropertyCard"
import { databaseService, type Property } from "@/lib/database"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Header } from "@/components/Header"
// import { DatabaseSetupBanner } from "@/components/DatabaseSetupBanner"
// import { DemoModeBanner } from "@/components/DemoModeBanner"
import ChatBot from "@/components/ui/chatbot"
export default function Home() {
  const { user } = useAuth()
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true)
      const response = await databaseService.getProperties({ available: true })
      setFeaturedProperties(response.documents.slice(0, 6) as Property[])
    } catch (error) {
      console.error("Error loading properties:", error)
      // Don't show error to user, just use empty array
      setFeaturedProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
    } else {
      window.location.href = "/properties"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ChatBot/>
      {/* <DatabaseSetupBanner /> */}
      {/* <DemoModeBanner /> */}
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
<section className="relative w-full h-screen overflow-hidden">
  <img src="../2.webp" alt="" className="absolute w-full h-full object-cover z-0" />

  {/* Glassy dark radial overlay */}
  <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/50 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0.9)_100%)]"></div>

  <div className="container relative z-20 flex flex-col justify-center items-center h-full mx-auto text-center">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
        Find Your Perfect Room in{" "}
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Kathmandu
        </span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        Direct connection between tenants and landlords. No broker fees, no hidden costs. Find affordable,
        safe, and comfortable accommodation near your college with our advanced platform.
      </p>
    </div>
  </div>
</section>


        {/* semi section */}
        <section  className="m-0 py-20 bg-gray-50 ">
{/* Enhanced Search Bar */}
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Search by area, college, or landmark..."
                      className="h-14 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div>
                    <select className="w-full h-14 px-4 border border-gray-300 rounded-md text-lg">
                      <option>Room Type</option>
                      <option>Single Room</option>
                      <option>Shared Room</option>
                      <option>Apartment</option>
                      <option>Hostel</option>
                    </select>
                  </div>
                  <Button className="h-14 text-lg" onClick={handleSearch}>
                    <Search className="w-5 h-5 mr-2" />
                    Search Rooms
                  </Button>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Available Rooms</div>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">2000+</div>
                  <div className="text-gray-600 font-medium">Happy Tenants</div>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="text-4xl font-bold text-purple-600 mb-2">2.5%</div>
                  <div className="text-gray-600 font-medium">Broker Fees</div>
                </div>
                <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                  <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600 font-medium">Support</div>
                </div>
              </div>
        </section>
        {/* Featured Listings */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
              <p className="text-xl text-gray-600">Handpicked accommodations perfect for tenants</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.$id} property={property} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/properties">
                <Button size="lg" className="px-8">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose GharDera?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We understand the challenges tenants face when moving to Kathmandu. Our platform is designed
                specifically for your needs with cutting-edge features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4">Low Broker Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Connect directly with verified landlords. Save thousands of rupees that you would otherwise pay to
                    brokers. Our platform is completely free for landlords.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4">Prime Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Find rooms near your destinations. Easy access to public transport, markets,
                    hospitals, and all essential amenities you need as a Tenant.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4"> Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with fellow , share experiences, get recommendations from verified reviews, and
                    build lasting friendships in your new city.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4">Smart Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Our  system matches you with the properties based on your preferences, budget,
                    and college location for the perfect fit.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4">Instant Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Secure your room immediately and effortlessly get in touch with landlords. 
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow border-0 bg-white">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-4">Quality Assurance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    All properties are verified by our team. We ensure quality standards, safety measures, and authentic
                    listings for your peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        
        {/* How It Works */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Simple steps to find your perfect room</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Search & Filter",
                  description: "Use our advanced search to find rooms by location, price, amenities, and more",
                  icon: <Search className="w-8 h-8" />,
                },
                {
                  step: "2",
                  title: "Connect Directly",
                  description: "Contact verified landlords directly through our secure messaging system",
                  icon: <Users className="w-8 h-8" />,
                },
                {
                  step: "3",
                  title: "Visit & Verify",
                  description: "Schedule visits, ask questions, and verify the property meets your needs",
                  icon: <MapPin className="w-8 h-8" />,
                },
                {
                  step: "4",
                  title: "Book Instantly",
                  description: "Complete digital agreements and secure payments to move into your new home",
                  icon: <Award className="w-8 h-8" />,
                },
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 mt-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Room?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of Tenants who have found their ideal accommodation through our platform. Start your
              journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="px-8 hover:bg-white hover:text-blue-600">
                  Browse Rooms Now
                </Button>
              </Link>
              <Link href="/properties/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-black border-white hover:bg-white hover:text-blue-600 px-8"
                >
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
      <img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" />
                  <span className="text-white font-bold text-lg"></span>
                </div>
                <span className="text-xl font-bold">GharDera</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Connecting Tenants with affordable accommodation in Kathmandu. No broker fees, direct contact, secure
                platform.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Facebook
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Instagram
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Twitter
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6">For Students</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/properties" className="hover:text-white transition-colors">
                    Browse Rooms
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">For Landlords</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/properties/new" className="hover:text-white transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link href="/landlord-guide" className="hover:text-white transition-colors">
                    Landlord Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white transition-colors">
                    Get Verified
                  </Link>
                </li>
                <li>
                  <Link href="/landlord-support" className="hover:text-white transition-colors">
                    Landlord Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Contact Us</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>+977-1-4444444</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>help@ghardera.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GharDera. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
