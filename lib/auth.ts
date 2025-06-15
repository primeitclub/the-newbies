import { account } from "./appwrite"
import { ID } from "appwrite"

export interface User {
  $id: string
  name: string
  email: string
  phone?: string
  userType: "student" | "landlord" | "admin"
  verified: boolean
  avatar?: string
  college?: string
  preferences?: any
}

// Mock users for demo mode
const MOCK_USERS: User[] = [
  {
    $id: "demo-student-1",
    name: "Demo Tenant",
    email: "student@demo.com",
    userType: "student",
    verified: true,
    college: "Tribhuvan University",
  },
  {
    $id: "demo-landlord-1",
    name: "Demo Landlord",
    email: "landlord@demo.com",
    userType: "landlord",
    verified: true,
  },
]

// Check if we're in demo mode (when Appwrite is not configured)
let isDemoMode = false

export const authService = {
  async createAccount(email: string, password: string, name: string, userType: "student" | "landlord") {
    try {
      const userAccount = await account.create(ID.unique(), email, password, name)

      // Create user profile in database
      await this.createUserProfile(userAccount.$id, {
        name,
        email,
        userType,
        verified: false,
      })

      return userAccount
    } catch (error: any) {
      console.warn("Appwrite auth not configured, using demo mode:", error)
      isDemoMode = true

      // Create a mock user for demo purposes
      const mockUser = {
        $id: `demo-${userType}-${Date.now()}`,
        name,
        email,
        userType,
        verified: false,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      }

      // Store in localStorage for demo persistence
      localStorage.setItem("demoUser", JSON.stringify(mockUser))
      return mockUser
    }
  },

  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password)
    } catch (error: any) {
      console.warn("Appwrite auth not configured, using demo mode:", error)
      isDemoMode = true

      // Check for demo credentials
      if (email === "student@demo.com" && password === "demo123") {
        const demoUser = MOCK_USERS[0]
        localStorage.setItem("demoUser", JSON.stringify(demoUser))
        return { userId: demoUser.$id }
      } else if (email === "landlord@demo.com" && password === "demo123") {
        const demoUser = MOCK_USERS[1]
        localStorage.setItem("demoUser", JSON.stringify(demoUser))
        return { userId: demoUser.$id }
      } else {
        // For any other email/password in demo mode, create a temporary user
        const demoUser = {
          $id: `demo-user-${Date.now()}`,
          name: email.split("@")[0],
          email,
          userType: "student" as const,
          verified: false,
        }
        localStorage.setItem("demoUser", JSON.stringify(demoUser))
        return { userId: demoUser.$id }
      }
    }
  },

  async logout() {
    try {
      return await account.deleteSession("current")
    } catch (error) {
      console.warn("Appwrite auth not configured:", error)
      // Clear demo user from localStorage
      localStorage.removeItem("demoUser")
      return null
    }
  },

  async getCurrentUser() {
    try {
      return await account.get()
    } catch (error) {
      console.warn("Appwrite auth not configured, checking demo mode:", error)
      // Check for demo user in localStorage
      const demoUser = localStorage.getItem("demoUser")
      if (demoUser) {
        return JSON.parse(demoUser)
      }
      return null
    }
  },

  async createUserProfile(userId: string, userData: any) {
    // This would create a user profile in the database
    console.warn("User profile creation not implemented yet")
  },

  // Helper method to check if we're in demo mode
  isDemoMode() {
    return isDemoMode || localStorage.getItem("demoUser") !== null
  },
}
