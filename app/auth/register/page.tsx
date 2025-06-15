"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/contexts/AuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
// import { DemoModeBanner } from "@/components/DemoModeBanner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student" as "student" | "landlord",
  })
  const [loading, setLoading] = useState(false)
  const { register, isDemoMode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await register(formData.email, formData.password, formData.name, formData.userType)
      toast({
        title: "Account created successfully!",
        description: isDemoMode
          ? "Welcome to the demo version of GharDera!"
          : "Welcome to GharDera. You can now start exploring properties.",
      })
      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const fillDemoData = (userType: "student" | "landlord") => {
    const demoData = {
      student: {
        name: "Demo Tenant",
        email: "demo.student@example.com",
        userType: "student" as const,
      },
      landlord: {
        name: "Demo Landlord",
        email: "demo.landlord@example.com",
        userType: "landlord" as const,
      },
    }

    setFormData((prev) => ({
      ...prev,
      ...demoData[userType],
      password: "demo123",
      confirmPassword: "demo123",
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl"><img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" /></span>
            </div>
            <span className="text-2xl font-bold text-gray-900">GharDera</span>
          </Link>
        </div>

        {/* <DemoModeBanner /> */}

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <p className="text-gray-600">Join thousands of students and landlords</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label>I am a</Label>
                <RadioGroup
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Tenant looking for accommodation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landlord" id="landlord" />
                    <Label htmlFor="landlord">Landlord with properties to rent</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password (min 6 characters)"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Demo Fill Buttons */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Quick demo setup</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => fillDemoData("student")} disabled={loading}>
                  Fill Tenant Data
                </Button>
                <Button type="button" variant="outline" onClick={() => fillDemoData("landlord")} disabled={loading}>
                  Fill Landlord Data
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
