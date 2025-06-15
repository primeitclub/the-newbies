import { storage, BUCKETS } from "./appwrite"
import { ID } from "appwrite"

export const storageService = {
  async uploadPropertyImage(file: File) {
    try {
      const response = await storage.createFile(BUCKETS.PROPERTY_IMAGES, ID.unique(), file)
      return response
    } catch (error: any) {
      // Check if the error is due to bucket not existing
      if (
        error.message &&
        (error.message.includes("Bucket not found") || error.message.includes("maximum number of buckets"))
      ) {
        console.warn("Storage bucket not available. Using placeholder image instead.")
        // Return a mock response with a placeholder image URL
        return {
          $id: `mock-${Date.now()}`,
          bucketId: BUCKETS.PROPERTY_IMAGES,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          name: file.name,
          mimeType: file.type,
          sizeOriginal: file.size,
          // Use a placeholder image URL
          url: `{MOCK_PROPERTIES.image}height=400&width=600&text=${encodeURIComponent(file.name)}`,
        }
      }
      throw error
    }
  },

  async uploadUserAvatar(file: File) {
    try {
      const response = await storage.createFile(BUCKETS.USER_AVATARS, ID.unique(), file)
      return response
    } catch (error: any) {
      // Check if the error is due to bucket not existing
      if (
        error.message &&
        (error.message.includes("Bucket not found") || error.message.includes("maximum number of buckets"))
      ) {
        console.warn("Storage bucket not available. Using placeholder avatar instead.")
        // Return a mock response with a placeholder avatar URL
        return {
          $id: `mock-${Date.now()}`,
          bucketId: BUCKETS.USER_AVATARS,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
          name: file.name,
          mimeType: file.type,
          sizeOriginal: file.size,
          // Use a placeholder avatar URL
          url: `/placeholder.svg?height=200&width=200&text=Avatar`,
        }
      }
      throw error
    }
  },

  getFilePreview(bucketId: string, fileId: string, width = 400, height = 300) {
    // Check if it's a mock URL (placeholder)
    if (fileId.startsWith("mock-")) {
      return `/placeholder.svg?height=${height}&width=${width}`
    }

    try {
      return storage.getFilePreview(bucketId, fileId, width, height)
    } catch (error) {
      console.warn("Error getting file preview, using placeholder:", error)
      return `/placeholder.svg?height=${height}&width=${width}`
    }
  },

  getFileView(bucketId: string, fileId: string) {
    // Check if it's a mock URL (placeholder)
    if (fileId.startsWith("mock-")) {
      return `{MOCK_PROPERTIES.image}height=400&width=600`
    }

    try {
      return storage.getFileView(bucketId, fileId)
    } catch (error) {
      console.warn("Error getting file view, using placeholder:", error)
      return `{MOCK_PROPERTIES.image}height=400&width=600`
    }
  },

  async deleteFile(bucketId: string, fileId: string) {
    // If it's a mock file, just return success
    if (fileId.startsWith("mock-")) {
      return true
    }

    try {
      return await storage.deleteFile(bucketId, fileId)
    } catch (error) {
      throw error
    }
  },
}
