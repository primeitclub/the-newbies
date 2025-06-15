// "use client"

// import { useState } from "react"
// import { Info, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// export function DemoModeBanner() {
//   const [isVisible, setIsVisible] = useState(true)

//   if (!isVisible) return null

//   return (
//     <Card className="border-blue-200 bg-blue-50 mb-6">
//       <CardContent className="p-4">
//         <div className="flex items-start space-x-3">
//           <Info className="w-5 h-5 text-blue-600 mt-0.5" />
//           <div className="flex-1">
//             <h3 className="font-medium text-blue-900 mb-1">Demo Mode Active</h3>
//             <p className="text-sm text-blue-800 mb-3">
//               You're currently using the demo version. All features are functional with sample data. To enable full
//               functionality with real data, configure your Appwrite backend.
//             </p>
//             <div className="space-y-2 text-sm text-blue-800">
//               <div>
//                 <strong>Demo Credentials:</strong>
//                 <ul className="list-disc list-inside ml-4 mt-1">
//                   <li>Student: student@demo.com / demo123</li>
//                   <li>Landlord: landlord@demo.com / demo123</li>
//                   <li>Or register with any email/password</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsVisible(false)}
//             className="text-blue-600 hover:text-blue-700"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
