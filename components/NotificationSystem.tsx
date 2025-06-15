"use client"

import { useState, useEffect } from "react"
import { Bell, X, AlertCircle, Info, Heart, Calendar, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "booking" | "message" | "favorite" | "system" | "payment"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

export function NotificationSystem() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
      // Set up real-time notifications polling
      const interval = setInterval(loadNotifications, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotifications = async () => {
    // Mock notifications - in real app, fetch from API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "booking",
        title: "Booking Confirmed",
        message: "Your booking for Modern Room in Baneshwor has been confirmed by the landlord.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: "/dashboard",
        priority: "high",
      },
      {
        id: "2",
        type: "message",
        title: "New Message",
        message: "You have a new message from the landlord about your booking inquiry.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        actionUrl: "/messages",
        priority: "medium",
      },
      {
        id: "3",
        type: "favorite",
        title: "Price Drop Alert",
        message: "The price for Cozy Student Room in Koteshwor has dropped by Rs. 1,000!",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: "/properties/property-2",
        priority: "medium",
      },
      {
        id: "4",
        type: "system",
        title: "Welcome to GharDera",
        message: "Complete your profile to get better property recommendations.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        actionUrl: "/profile",
        priority: "low",
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4 text-blue-600" />
      case "message":
        return <MessageSquare className="w-4 h-4 text-green-600" />
      case "favorite":
        return <Heart className="w-4 h-4 text-red-600" />
      case "payment":
        return <AlertCircle className="w-4 h-4 text-orange-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      default:
        return "border-l-blue-500"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  if (!user) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? "bg-blue-50" : "bg-white"
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                      onClick={() => {
                        markAsRead(notification.id)
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                              >
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 ml-2">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
