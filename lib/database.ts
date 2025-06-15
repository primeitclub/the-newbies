import { databases, DATABASE_ID, COLLECTIONS } from "./appwrite"
import { ID, Query } from "appwrite"
import { MOCK_PROPERTIES } from "./mock-data"

export interface Property {
  $id?: string
  title: string
  description: string
  price: number
  location: string
  address: string
  roomType: "single" | "shared" | "apartment" | "hostel"
  amenities: string[]
  images: string[]
  landlordId: string
  available: boolean
  coordinates?: { lat: number; lng: number }
  nearbyPlaces: Array<{ name: string; distance: string }>
  rules: string[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  $id?: string
  propertyId: string
  studentId: string
  landlordId: string
  startDate: string
  endDate?: string
  status: "pending" | "confirmed" | "rejected" | "completed"
  totalAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  createdAt: string
}

export interface Review {
  $id?: string
  propertyId: string
  studentId: string
  rating: number
  comment: string
  createdAt: string
}

export const databaseService = {
  // Properties
  async createProperty(propertyData: Omit<Property, "$id" | "createdAt" | "updatedAt">) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, ID.unique(), {
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.warn("Database not configured, property creation simulated:", error)
      // In demo mode, simulate successful creation
      const mockProperty = {
        $id: `demo-property-${Date.now()}`,
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add to mock data for immediate display
      MOCK_PROPERTIES.unshift(mockProperty)

      return mockProperty
    }
  },

  async getProperties(filters?: any) {
    try {
      const queries = [Query.orderDesc("createdAt")]

      if (filters?.location) {
        queries.push(Query.search("location", filters.location))
      }
      if (filters?.roomType) {
        queries.push(Query.equal("roomType", filters.roomType))
      }
      if (filters?.minPrice) {
        queries.push(Query.greaterThanEqual("price", filters.minPrice))
      }
      if (filters?.maxPrice) {
        queries.push(Query.lessThanEqual("price", filters.maxPrice))
      }
      if (filters?.available !== undefined) {
        queries.push(Query.equal("available", filters.available))
      }

      return await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROPERTIES, queries)
    } catch (error) {
      console.warn("Database not configured, using mock data:", error)
      // Return mock data in the same format as Appwrite
      let filteredProperties = [...MOCK_PROPERTIES]

      // Apply filters to mock data
      if (filters?.location) {
        filteredProperties = filteredProperties.filter((p) =>
          p.location.toLowerCase().includes(filters.location.toLowerCase()),
        )
      }
      if (filters?.roomType && filters.roomType !== "all") {
        filteredProperties = filteredProperties.filter((p) => p.roomType === filters.roomType)
      }
      if (filters?.minPrice) {
        filteredProperties = filteredProperties.filter((p) => p.price >= filters.minPrice)
      }
      if (filters?.maxPrice) {
        filteredProperties = filteredProperties.filter((p) => p.price <= filters.maxPrice)
      }

      return {
        documents: filteredProperties,
        total: filteredProperties.length,
      }
    }
  },

  async getProperty(propertyId: string) {
    // Validate propertyId
    if (!propertyId || propertyId === "undefined" || propertyId === "null") {
      throw new Error("Invalid property ID")
    }

    try {
      return await databases.getDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, propertyId)
    } catch (error) {
      console.warn("Database not configured, using mock data:", error)

      // Find property in mock data
      const mockProperty = MOCK_PROPERTIES.find((p) => p.$id === propertyId)

      if (mockProperty) {
        return mockProperty
      }

      // If not found in mock data, throw a more descriptive error
      console.error(`Property not found with ID: ${propertyId}`)
      console.log(
        "Available mock property IDs:",
        MOCK_PROPERTIES.map((p) => p.$id),
      )

      throw new Error(`Property with ID "${propertyId}" not found`)
    }
  },

  async updateProperty(propertyId: string, updates: Partial<Property>) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, propertyId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      throw error
    }
  },

  // Bookings
  async createBooking(bookingData: Omit<Booking, "$id" | "createdAt">) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.BOOKINGS, ID.unique(), {
        ...bookingData,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.warn("Database not configured, booking creation simulated:", error)
      // Simulate successful booking creation
      return {
        $id: `demo-booking-${Date.now()}`,
        ...bookingData,
        createdAt: new Date().toISOString(),
      }
    }
  },

  async getBookings(userId: string, userType: "student" | "landlord") {
    try {
      const field = userType === "student" ? "studentId" : "landlordId"
      return await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOOKINGS, [
        Query.equal(field, userId),
        Query.orderDesc("createdAt"),
      ])
    } catch (error) {
      throw error
    }
  },

  async updateBookingStatus(bookingId: string, status: Booking["status"]) {
    try {
      return await databases.updateDocument(DATABASE_ID, COLLECTIONS.BOOKINGS, bookingId, { status })
    } catch (error) {
      throw error
    }
  },

  // Reviews
  async createReview(reviewData: Omit<Review, "$id" | "createdAt">) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.REVIEWS, ID.unique(), {
        ...reviewData,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      throw error
    }
  },

  async getPropertyReviews(propertyId: string) {
    try {
      return await databases.listDocuments(DATABASE_ID, COLLECTIONS.REVIEWS, [
        Query.equal("propertyId", propertyId),
        Query.orderDesc("createdAt"),
      ])
    } catch (error) {
      console.warn("Database not configured, using mock reviews:", error)
      return {
        documents: [
          {
            $id: "1",
            propertyId,
            studentId: "student1",
            rating: 5,
            comment:
              "Excellent room with all amenities. The landlord is very helpful and the location is perfect for students.",
            createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          },
          {
            $id: "2",
            propertyId,
            studentId: "student2",
            rating: 4,
            comment: "Good room, clean and well-maintained. WiFi speed is excellent. Highly recommended.",
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          },
        ],
        total: 2,
      }
    }
  },

  // Favorites
  async addToFavorites(userId: string, propertyId: string) {
    try {
      return await databases.createDocument(DATABASE_ID, COLLECTIONS.FAVORITES, ID.unique(), {
        userId,
        propertyId,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.warn("Database not configured, favorites disabled:", error)
      throw new Error("Database not configured")
    }
  },

  async removeFromFavorites(userId: string, propertyId: string) {
    try {
      const favorites = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FAVORITES, [
        Query.equal("userId", userId),
        Query.equal("propertyId", propertyId),
      ])

      if (favorites.documents.length > 0) {
        return await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FAVORITES, favorites.documents[0].$id)
      }
    } catch (error) {
      console.warn("Database not configured, favorites disabled:", error)
      throw new Error("Database not configured")
    }
  },

  async getUserFavorites(userId: string) {
    try {
      return await databases.listDocuments(DATABASE_ID, COLLECTIONS.FAVORITES, [Query.equal("userId", userId)])
    } catch (error) {
      console.warn("Database not configured, favorites disabled:", error)
      return { documents: [], total: 0 }
    }
  },
}
