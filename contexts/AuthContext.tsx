"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isDemoMode: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, userType: "student" | "landlord") => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser as User)
      setIsDemoMode(authService.isDemoMode())
    } catch (error) {
      console.warn("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password)
      await checkAuth()
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, userType: "student" | "landlord") => {
    try {
      await authService.createAccount(email, password, name, userType)
      await login(email, password)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setIsDemoMode(false)
    } catch (error) {
      console.error("Logout error:", error)
      // Still set user to null even if logout fails
      setUser(null)
      setIsDemoMode(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isDemoMode, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
