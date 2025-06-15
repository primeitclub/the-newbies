"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Heart,
  MessageSquare,
  Calendar,
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  Eye,
  Search,
  BarChart3,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { NotificationSystem } from "@/components/NotificationSystem"
import { MessagingSystem } from "@/components/MessagingSystem"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, isDemoMode } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isStudent = user.userType === "student"
  const isLandlord = user.userType === "landlord"

  // Mock data for analytics
  const analyticsData = {
    totalViews: 1247,
    totalInquiries: 89,
    conversionRate: 7.1,
    averageRating: 4.8,
    monthlyRevenue: 45000,
    occupancyRate: 85,
  }

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: "New booking request from Sita Poudel",
      timestamp: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "message",
      message: "Message from Ram Sharma about property inquiry",
      timestamp: "4 hours ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review for Baneshwor property",
      timestamp: "1 day ago",
      priority: "low",
    },
    {
      id: 4,
      type: "favorite",
      message: "Your property was saved by 3 new users",
      timestamp: "2 days ago",
      priority: "low",
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      task: "Property inspection scheduled",
      dueDate: "Tomorrow, 2:00 PM",
      priority: "high",
    },
    {
      id: 2,
      task: "Respond to booking inquiry",
      dueDate: "Today, 6:00 PM",
      priority: "medium",
    },
    {
      id: 3,
      task: "Update property photos",
      dueDate: "This week",
      priority: "low",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm"><img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" /></span>
              </div>
              <span className="text-xl font-bold text-gray-900">GharDera</span>
            </Link>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search properties, messages..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Notifications */}
              <NotificationSystem />

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                {isDemoMode && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Demo Mode
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600 capitalize flex items-center">
                      {user.userType}
                      {isLandlord && <Badge className="ml-2 text-xs">Verified</Badge>}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "overview" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Overview</span>
                  </button>

                  {isStudent && (
                    <>
                      <button
                        onClick={() => setActiveTab("favorites")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === "favorites" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Favorites</span>
                        <Badge className="ml-auto">5</Badge>
                      </button>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === "bookings" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>My Bookings</span>
                        <Badge className="ml-auto">2</Badge>
                      </button>
                    </>
                  )}

                  {isLandlord && (
                    <>
                      <button
                        onClick={() => setActiveTab("properties")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === "properties" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>My Properties</span>
                        <Badge className="ml-auto">3</Badge>
                      </button>
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === "analytics" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === "bookings" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Booking Requests</span>
                        <Badge className="ml-auto bg-red-100 text-red-800">7</Badge>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "messages" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                    <Badge className="ml-auto bg-green-100 text-green-800">3</Badge>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === "settings" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Link href="/properties">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Search className="w-4 h-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                    {isLandlord && (
                      <Link href="/properties/new">
                        <Button size="sm" className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                      <p className="text-gray-600">Welcome back, {user.name}!</p>
                    </div>
                    {isLandlord && (
                      <Link href="/properties/new">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Enhanced Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isStudent && (
                      <>
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Saved Properties</p>
                                <p className="text-2xl font-bold">5</p>
                                <p className="text-xs text-green-600">+2 this week</p>
                              </div>
                              <Heart className="w-8 h-8 text-red-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Active Bookings</p>
                                <p className="text-2xl font-bold">2</p>
                                <p className="text-xs text-blue-600">1 pending</p>
                              </div>
                              <Calendar className="w-8 h-8 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Messages</p>
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-xs text-orange-600">3 unread</p>
                              </div>
                              <MessageSquare className="w-8 h-8 text-green-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-yellow-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Profile Views</p>
                                <p className="text-2xl font-bold">24</p>
                                <p className="text-xs text-green-600">+12% this month</p>
                              </div>
                              <Eye className="w-8 h-8 text-purple-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {isLandlord && (
                      <>
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Total Properties</p>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-xs text-green-600">All active</p>
                              </div>
                              <Home className="w-8 h-8 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-orange-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Booking Requests</p>
                                <p className="text-2xl font-bold">7</p>
                                <p className="text-xs text-red-600">3 pending</p>
                              </div>
                              <Calendar className="w-8 h-8 text-orange-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-bold">Rs. 45,000</p>
                                <p className="text-xs text-green-600">+8% from last month</p>
                              </div>
                              <DollarSign className="w-8 h-8 text-green-500" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Occupancy Rate</p>
                                <p className="text-2xl font-bold">85%</p>
                                <p className="text-xs text-blue-600">Above average</p>
                              </div>
                              <TrendingUp className="w-8 h-8 text-purple-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>

                  {/* Recent Activity & Tasks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Activity className="w-5 h-5 mr-2" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${
                                  activity.priority === "high"
                                    ? "bg-red-500"
                                    : activity.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{activity.message}</p>
                                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Upcoming Tasks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium">{task.task}</p>
                                <p className="text-xs text-gray-500">{task.dueDate}</p>
                              </div>
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Communicate with Landlords and Tenants. </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessagingSystem />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add other tab contents here... */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
