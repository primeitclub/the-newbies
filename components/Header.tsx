"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { NotificationSystem } from "@/components/NotificationSystem"

export function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary">
      <img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" />
          
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/properties"
            className={`text-sm ${pathname === "/properties" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
          >
            Browse Properties
          </Link>
          <Link
            href="/aboutus"
            className={`text-sm ${pathname === "/aboutus" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
          >
            About Us
          </Link>
          <Link
          
            href="#contact"
            className={`text-sm ${pathname === "/contact" ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <NotificationSystem />
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
              <div className="md:hidden">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
