"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6 md:px-20 lg:px-40">
      <div className="flex justify-start gap-4 mb-8">
        <Link href="/">
          <Button size="lg" variant="outline" className="hover:text-blue-600">
            ← Back to Home
          </Button>
        </Link>
        
      </div>


      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
        <p className="mb-4 text-sm text-gray-500">Last updated: June 15, 2025</p>

        <section className="space-y-6 text-base leading-relaxed">
          <p>
            Welcome to our rental platform. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our services to rent or list properties including houses, hostels, rooms, and more.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Personal Data:</strong> Name, email, phone number, location, payment details.</li>
            <li><strong>Usage Data:</strong> Pages visited, interactions, and preferences.</li>
            <li><strong>Device Data:</strong> IP address, browser type, operating system.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To provide and manage property listings.</li>
            <li>To verify user identities and prevent fraud.</li>
            <li>To improve user experience and website functionality.</li>
            <li>To send transactional and promotional communications.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">3. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information. However, we may share data with:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Service providers (payment, analytics, hosting).</li>
            <li>Law enforcement or regulatory bodies when legally required.</li>
            <li>Other users (limited information when booking or hosting).</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">4. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to improve your experience, track performance, and for marketing. You can control your cookie settings in your browser.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access or update your personal data.</li>
            <li>Request deletion of your account.</li>
            <li>Opt out of marketing communications.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">6. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information. However, no online system is 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Children’s Privacy</h2>
          <p>
            Our platform is not intended for individuals under the age of 18. We do not knowingly collect data from minors.
          </p>

          <h2 className="text-xl font-semibold mt-6">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. All changes will be posted on this page with an updated date.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Contact Us</h2>
          <p>
            If you have questions or concerns about this policy, please contact us at <a href="mailto:support@rentnow.com" className="text-primary underline">support@rentnow.com</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
