import { Client, Account, Databases, Storage, Functions, Messaging } from "appwrite"

const client = new Client().setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("684a895b003dca5b30b3")

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)
export const messaging = new Messaging(client)

export const DATABASE_ID = "684a89cc0007af9eb237"

// Collection IDs
export const COLLECTIONS = {
  USERS: "users",
  PROPERTIES: "properties",
  BOOKINGS: "bookings",
  REVIEWS: "reviews",
  MESSAGES: "messages",
  FAVORITES: "favorites",
  NOTIFICATIONS: "notifications",
}

// Storage bucket IDs
export const BUCKETS = {
  PROPERTY_IMAGES: "property-images",
  USER_AVATARS: "user-avatars",
  DOCUMENTS: "documents",
}

export { client }
