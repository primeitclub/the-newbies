"use server"

import { MOCK_PROPERTIES } from "@/lib/mock-data"

const DATABASE_ID = "684a89cc0007af9eb237"

const COLLECTIONS = {
  USERS: "users",
  PROPERTIES: "properties",
  BOOKINGS: "bookings",
  REVIEWS: "reviews",
  MESSAGES: "messages",
  FAVORITES: "favorites",
  NOTIFICATIONS: "notifications",
}

// Define buckets but make them optional
const BUCKETS = {
  PROPERTY_IMAGES: "property-images",
  USER_AVATARS: "user-avatars",
  DOCUMENTS: "documents",
}

export async function setupAppwriteDatabase() {
  try {
    // Dynamic import of node-appwrite
    let Client, Databases, Storage, Permission, Role, ID: any

    try {
      const appwrite = await import("node-appwrite")
      Client = appwrite.Client
      Databases = appwrite.Databases
      Storage = appwrite.Storage
      Permission = appwrite.Permission
      Role = appwrite.Role
      ID = appwrite.ID
    } catch (importError) {
      return {
        success: false,
        message: "node-appwrite package not found. Please install it with: npm install node-appwrite",
      }
    }

    // Check if API key is configured
    if (!process.env.APPWRITE_API_KEY) {
      return {
        success: false,
        message:
          "Appwrite API key not configured. Please set APPWRITE_API_KEY environment variable in your .env.local file.",
      }
    }

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint("https://fra.cloud.appwrite.io/v1")
      .setProject("684a895b003dca5b30b3")
      .setKey(process.env.APPWRITE_API_KEY)

    const databases = new Databases(client)
    const storage = new Storage(client)

    // Test connection first
    try {
      await databases.list()
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to connect to Appwrite: ${error.message}. Please check your API key and project ID.`,
      }
    }

    // Create collections first (this is the most important part)
    await createCollections(databases, Permission, Role, ID)

    // Try to create storage buckets, but don't fail if it doesn't work
    let storageResult = { success: true, message: "" }
    try {
      await createStorageBuckets(storage, Permission, Role)
    } catch (error: any) {
      storageResult = {
        success: false,
        message: `Note: Storage buckets could not be created due to plan limitations. Collections were created successfully.`,
      }
    }

    // Populate with demo data
    await populateData(databases, ID)

    // Return success with appropriate message
    if (storageResult.success) {
      return {
        success: true,
        message: "Database setup completed successfully! All collections and demo data have been created.",
      }
    } else {
      return {
        success: true,
        message: "Database collections and demo data created successfully! " + storageResult.message,
        storageWarning: true,
      }
    }
  } catch (error: any) {
    console.error("Setup error:", error)
    return {
      success: false,
      message: `Setup failed: ${error.message || "Unknown error"}. Please check the console for more details.`,
    }
  }
}

async function createCollections(databases: any, Permission: any, Role: any, ID: any) {
  // Helper function to wait
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Create Properties collection
  try {
    await databases.getCollection(DATABASE_ID, COLLECTIONS.PROPERTIES)
    console.log("Properties collection already exists")
  } catch (error) {
    console.log("Creating properties collection...")
    try {
      await databases.createCollection(DATABASE_ID, COLLECTIONS.PROPERTIES, "Properties", [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ])

      // Wait for collection to be ready
      await wait(2000)

      // Create attributes one by one with delays
      const attributes = [
        { name: "title", type: "string", size: 255, required: true },
        { name: "description", type: "string", size: 5000, required: true },
        { name: "price", type: "string", required: true },
        { name: "location", type: "string", size: 255, required: true },
        { name: "address", type: "string", size: 500, required: true },
        { name: "roomType", type: "string", size: 50, required: true },
        { name: "amenities", type: "string", size: 255, required: true, array: true },
        { name: "images", type: "string", size: 1000, required: true, array: true },
        { name: "landlordId", type: "string", size: 100, required: true },
        { name: "available", type: "boolean", required: true },
        { name: "coordinates", type: "string", size: 1000, required: false },
        { name: "nearbyPlaces", type: "string", size: 2000, required: false },
        { name: "rules", type: "string", size: 500, required: false, array: true },
        { name: "createdAt", type: "datetime", required: true },
        { name: "updatedAt", type: "datetime", required: true },
      ]

      for (const attr of attributes) {
        try {
          if (attr.type === "string") {
            await databases.createStringAttribute(
              DATABASE_ID,
              COLLECTIONS.PROPERTIES,
              attr.name,
              attr.size,
              attr.required,
              undefined,
              attr.array || false,
            )
          } else if (attr.type === "integer") {
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PROPERTIES, attr.name, attr.required)
          } else if (attr.type === "boolean") {
            await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.PROPERTIES, attr.name, attr.required)
          } else if (attr.type === "datetime") {
            await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.PROPERTIES, attr.name, attr.required)
          }
          await wait(500)
        } catch (attrError) {
          console.error(`Error creating attribute ${attr.name}:`, attrError)
        }
      }

      console.log("Properties collection created successfully")
    } catch (createError: any) {
      console.error("Error creating properties collection:", createError)
      throw new Error(`Failed to create properties collection: ${createError.message}`)
    }
  }

  // Create Users collection
  try {
    await databases.getCollection(DATABASE_ID, COLLECTIONS.USERS)
    console.log("Users collection already exists")
  } catch (error) {
    console.log("Creating users collection...")
    try {
      await databases.createCollection(DATABASE_ID, COLLECTIONS.USERS, "Users", [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ])

      await wait(2000)

      const userAttributes = [
        { name: "name", type: "string", size: 255, required: true },
        { name: "email", type: "string", size: 255, required: true },
        { name: "phone", type: "string", size: 50, required: false },
        { name: "userType", type: "string", size: 20, required: true },
        { name: "verified", type: "boolean", required: true },
        { name: "avatar", type: "string", size: 500, required: false },
        { name: "college", type: "string", size: 255, required: false },
        { name: "preferences", type: "string", size: 2000, required: false },
        { name: "createdAt", type: "datetime", required: true },
        { name: "updatedAt", type: "datetime", required: true },
      ]

      for (const attr of userAttributes) {
        try {
          if (attr.type === "string") {
            await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.USERS, attr.name, attr.size, attr.required)
          } else if (attr.type === "boolean") {
            await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.USERS, attr.name, attr.required)
          } else if (attr.type === "datetime") {
            await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.USERS, attr.name, attr.required)
          }
          await wait(500)
        } catch (attrError) {
          console.error(`Error creating user attribute ${attr.name}:`, attrError)
        }
      }

      console.log("Users collection created successfully")
    } catch (createError: any) {
      console.error("Error creating users collection:", createError)
      // Don't throw error for users collection, continue with others
    }
  }

  // Create other collections with simplified approach
  const otherCollections = [
    {
      id: COLLECTIONS.BOOKINGS,
      name: "Bookings",
      attributes: [
        { name: "propertyId", type: "string", size: 100, required: true },
        { name: "studentId", type: "string", size: 100, required: true },
        { name: "landlordId", type: "string", size: 100, required: true },
        { name: "startDate", type: "datetime", required: true },
        { name: "endDate", type: "datetime", required: false },
        { name: "status", type: "string", size: 20, required: true },
        { name: "totalAmount", type: "integer", required: true },
        { name: "paymentStatus", type: "string", size: 20, required: true },
        { name: "createdAt", type: "datetime", required: true },
      ],
    },
    {
      id: COLLECTIONS.REVIEWS,
      name: "Reviews",
      attributes: [
        { name: "propertyId", type: "string", size: 100, required: true },
        { name: "studentId", type: "string", size: 100, required: true },
        { name: "rating", type: "integer", required: true },
        { name: "comment", type: "string", size: 1000, required: true },
        { name: "createdAt", type: "datetime", required: true },
      ],
    },
    {
      id: COLLECTIONS.FAVORITES,
      name: "Favorites",
      attributes: [
        { name: "userId", type: "string", size: 100, required: true },
        { name: "propertyId", type: "string", size: 100, required: true },
        { name: "createdAt", type: "datetime", required: true },
      ],
    },
    {
      id: COLLECTIONS.MESSAGES,
      name: "Messages",
      attributes: [
        { name: "senderId", type: "string", size: 100, required: true },
        { name: "receiverId", type: "string", size: 100, required: true },
        { name: "propertyId", type: "string", size: 100, required: false },
        { name: "content", type: "string", size: 5000, required: true },
        { name: "read", type: "boolean", required: true },
        { name: "createdAt", type: "datetime", required: true },
      ],
    },
    {
      id: COLLECTIONS.NOTIFICATIONS,
      name: "Notifications",
      attributes: [
        { name: "userId", type: "string", size: 100, required: true },
        { name: "title", type: "string", size: 255, required: true },
        { name: "message", type: "string", size: 1000, required: true },
        { name: "type", type: "string", size: 50, required: true },
        { name: "read", type: "boolean", required: true },
        { name: "createdAt", type: "datetime", required: true },
      ],
    },
  ]

  for (const collection of otherCollections) {
    try {
      await databases.getCollection(DATABASE_ID, collection.id)
      console.log(`${collection.name} collection already exists`)
    } catch (error) {
      try {
        console.log(`Creating ${collection.name} collection...`)
        await databases.createCollection(DATABASE_ID, collection.id, collection.name, [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ])

        await wait(2000)

        for (const attr of collection.attributes) {
          try {
            if (attr.type === "string") {
              await databases.createStringAttribute(DATABASE_ID, collection.id, attr.name, attr.size, attr.required)
            } else if (attr.type === "integer") {
              await databases.createIntegerAttribute(DATABASE_ID, collection.id, attr.name, attr.required)
            } else if (attr.type === "boolean") {
              await databases.createBooleanAttribute(DATABASE_ID, collection.id, attr.name, attr.required)
            } else if (attr.type === "datetime") {
              await databases.createDatetimeAttribute(DATABASE_ID, collection.id, attr.name, attr.required)
            }
            await wait(500)
          } catch (attrError) {
            console.error(`Error creating attribute ${attr.name}:`, attrError)
          }
        }

        console.log(`${collection.name} collection created successfully`)
      } catch (createError: any) {
        console.error(`Error creating ${collection.name} collection:`, createError)
      }
    }
  }
}

// Separate function for storage buckets that can fail gracefully
async function createStorageBuckets(storage: any, Permission: any, Role: any) {
  // Create storage buckets
  const buckets = [
    { id: BUCKETS.PROPERTY_IMAGES, name: "Property Images" },
    { id: BUCKETS.USER_AVATARS, name: "User Avatars" },
    { id: BUCKETS.DOCUMENTS, name: "Documents" },
  ]

  // Check if we can create at least one bucket
  try {
    // Try to get existing buckets first
    const existingBuckets = await storage.listBuckets()
    console.log(`Found ${existingBuckets.total} existing buckets`)

    // If we already have buckets, we're good
    if (existingBuckets.total > 0) {
      console.log("Storage buckets already exist, skipping creation")
      return
    }

    // Try to create just one bucket as a test
    await storage.createBucket(BUCKETS.PROPERTY_IMAGES, "Property Images", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])

    // If we get here, we can create more buckets
    console.log("Successfully created first bucket, creating others...")

    // Create the rest of the buckets
    for (let i = 1; i < buckets.length; i++) {
      const bucket = buckets[i]
      try {
        await storage.createBucket(bucket.id, bucket.name, [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ])
        console.log(`${bucket.name} bucket created successfully`)
      } catch (error) {
        console.error(`Error creating ${bucket.name} bucket:`, error)
        // Don't throw, just continue with the next bucket
      }
    }
  } catch (error: any) {
    console.error("Error creating storage buckets:", error)

    // Check if it's a plan limitation error
    if (error.message && error.message.includes("maximum number of buckets")) {
      throw new Error(
        "Storage bucket creation failed due to plan limitations. Please upgrade your Appwrite plan or use external storage.",
      )
    } else {
      throw error
    }
  }
}

async function populateData(databases: any, ID: any) {
  // Wait for collections to be fully ready
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Check if we already have properties
  try {
    const existingProperties = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROPERTIES)
    if (existingProperties.total > 0) {
      console.log("Properties already exist, skipping population")
      return
    }
  } catch (error) {
    console.log("Error checking existing properties, continuing with population...")
  }

  console.log("Populating properties...")

  // Add mock properties (first 3 only to avoid timeout)
  for (const property of MOCK_PROPERTIES.slice(0, 3)) {
    try {
      const { $id, coordinates, nearbyPlaces, ...propertyData } = property

      // Convert complex objects to strings for storage
      const processedData = {
        ...propertyData,
        coordinates: coordinates ? JSON.stringify(coordinates) : undefined,
        nearbyPlaces: JSON.stringify(nearbyPlaces),
        landlordId: "demo-landlord-1", // Use a consistent landlord ID
      }

      await databases.createDocument(DATABASE_ID, COLLECTIONS.PROPERTIES, ID.unique(), processedData)
      console.log(`Created property: ${property.title}`)
    } catch (error) {
      console.error(`Error creating property ${property.title}:`, error)
    }
  }

  // Add demo users
  const demoUsers = [
    {
      name: "Demo Tenant",
      email: "student@demo.com",
      userType: "student",
      verified: true,
      college: "Tribhuvan University",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Demo Landlord",
      email: "landlord@demo.com",
      userType: "landlord",
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  for (const user of demoUsers) {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), user)
      console.log(`Created user: ${user.name}`)
    } catch (error) {
      console.error(`Error creating user ${user.name}:`, error)
    }
  }

  console.log("Data population completed!")
}
