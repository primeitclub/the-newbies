"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { setupAppwriteDatabase } from "@/app/actions/setup-database"
import { AlertCircle, CheckCircle2, Database, ExternalLink, Terminal, Copy, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AppwriteSetupButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    storageWarning?: boolean
  } | null>(null)
  const [showCard, setShowCard] = useState(true)
  const { toast } = useToast()

  const handleSetup = async () => {
    setLoading(true)
    setResult(null)

    try {
      const setupResult = await setupAppwriteDatabase()
      setResult(setupResult)
    } catch (error: any) {
      setResult({
        success: false,
        message: `Setup failed: ${error.message || "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Command copied to clipboard",
    })
  }

  if (!showCard) return null

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Appwrite Database Setup
        </CardTitle>
        <CardDescription>Quickly set up your Appwrite database with collections and demo data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800 mb-4">
          This will create all necessary collections in your Appwrite database and populate them with demo data. Perfect
          for quick setup and testing.
        </p>

        {result && (
          <div
            className={`p-4 mb-4 rounded-md ${
              result.success
                ? result.storageWarning
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-start">
              {result.success ? (
                result.storageWarning ? (
                  <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                )
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">
                  {result.success ? (result.storageWarning ? "Partial Success" : "Success!") : "Error"}
                </p>
                <p className="text-sm">{result.message}</p>
                {result.storageWarning && (
                  <div className="mt-2 text-sm">
                    <p>
                      <strong>Note:</strong> Storage buckets could not be created due to Appwrite free plan limitations.
                      The application will still work with external image URLs.
                    </p>
                    <p className="mt-1">
                      Options:
                      <ul className="list-disc list-inside mt-1">
                        <li>Upgrade your Appwrite plan</li>
                        <li>Use external image hosting (e.g., Cloudinary, Imgur)</li>
                        <li>Use placeholder images for testing</li>
                      </ul>
                    </p>
                  </div>
                )}
                {!result.success && result.message?.includes("node-appwrite") && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800">
                    <div className="flex items-center justify-between">
                      <code className="text-xs">npm install node-appwrite</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("npm install node-appwrite")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">This will create:</p>
          <ul className="list-disc list-inside text-sm space-y-1 text-blue-800">
            <li>Properties collection with 3 demo listings</li>
            <li>Users collection with demo accounts</li>
            <li>Bookings, Reviews, Favorites collections</li>
            <li>Messages and Notifications collections</li>
            <li>Storage buckets (if allowed by your Appwrite plan)</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Prerequisites:</strong>
          </p>
          <div className="text-sm text-yellow-800 mt-1 space-y-2">
            <div className="flex items-center justify-between bg-yellow-100 p-2 rounded">
              <div className="flex items-center">
                <Terminal className="w-3 h-3 mr-1" />
                <code>npm install node-appwrite</code>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("npm install node-appwrite")}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <ul className="space-y-1">
              <li>
                • Set <code>APPWRITE_API_KEY</code> in your <code>.env.local</code> file
              </li>
              <li>• API key must have Database and Storage permissions</li>
              <li>
                • Get your API key from{" "}
                <a
                  href="https://cloud.appwrite.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center"
                >
                  Appwrite Console <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* New section about storage limitations */}
        <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 font-medium flex items-center">
            <Info className="w-4 h-4 mr-1" />
            About Storage Limitations
          </p>
          <p className="text-sm text-blue-800 mt-1">
            The free Appwrite plan has a limit on the number of storage buckets you can create. If bucket creation
            fails:
          </p>
          <ul className="list-disc list-inside text-sm mt-1 text-blue-800">
            <li>Database collections will still be created</li>
            <li>The app will work with external image URLs</li>
            <li>You can use placeholder images for testing</li>
            <li>Consider upgrading your Appwrite plan for production use</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant={result?.success ? "outline" : "default"}
          onClick={handleSetup}
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Setting up...
            </>
          ) : (
            "One-Click Setup"
          )}
        </Button>
        <Button variant="ghost" onClick={() => setShowCard(false)}>
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  )
}
