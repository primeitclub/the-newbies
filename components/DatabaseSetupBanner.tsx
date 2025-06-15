// "use client"

// import { useState } from "react"
// import { AlertTriangle, X, ExternalLink } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// export function DatabaseSetupBanner() {
//   const [isVisible, setIsVisible] = useState(true)

//   if (!isVisible) return null

//   return (
//     <Card className="border-orange-200 bg-orange-50 mb-6">
//       <CardContent className="p-4">
//         <div className="flex items-start space-x-3">
//           <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
//           <div className="flex-1">
//             <h3 className="font-medium text-orange-900 mb-1">Database Setup Required</h3>
//             <p className="text-sm text-orange-800 mb-3">
//               The app is currently using mock data. To enable full functionality, please set up your Appwrite database
//               collections:
//             </p>
//             <div className="space-y-2 text-sm text-orange-800">
//               <div>
//                 <strong>Required Collections:</strong>
//                 <ul className="list-disc list-inside ml-4 mt-1">
//                   <li>properties</li>
//                   <li>users</li>
//                   <li>bookings</li>
//                   <li>reviews</li>
//                   <li>favorites</li>
//                   <li>messages</li>
//                   <li>notifications</li>
//                 </ul>
//               </div>
//               <div>
//                 <strong>Required Storage Buckets:</strong>
//                 <ul className="list-disc list-inside ml-4 mt-1">
//                   <li>property-images</li>
//                   <li>user-avatars</li>
//                   <li>documents</li>
//                 </ul>
//               </div>
//             </div>
//             <div className="flex space-x-2 mt-3">
//               <Button size="sm" variant="outline" asChild>
//                 <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer">
//                   <ExternalLink className="w-4 h-4 mr-1" />
//                   Open Appwrite Console
//                 </a>
//               </Button>
//               <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
//                 Dismiss
//               </Button>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsVisible(false)}
//             className="text-orange-600 hover:text-orange-700"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
