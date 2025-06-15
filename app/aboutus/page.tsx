    'use client';

import React from "react";
import Link from 'next/link';
import { Mail, Phone, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';


const AboutUs = () => {
  return (
    <>
    <div className="nav-bar">
    <nav className="flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Logo */}
      <Link href="/">
        <img className="h-12 w-16 cursor-pointer" src="../placeholder-logo.svg" alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <div className="space-x-6 text-gray-600 flex items-center">
        <Link href="../properties" className="hover:text-black">
          Browse Properties
        </Link>
        <Link href="../aboutus" className="hover:text-black">
          About Us
        </Link>
        <Link href="#contact" scroll={false} className="hover:text-black">
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="space-x-3">
        <Link href="/login">
          <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
            Register
          </button>
        </Link>
      </div>
    </nav>
</div>
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          We are committed to bridging the gap between landlords and tenants by
          providing a user-friendly, transparent, and reliable housing solution.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To revolutionize the rental housing experience through technology
            and trust—empowering users to find and list properties with
            confidence.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1681505526188-b05e68c77582?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Mission"
          className="rounded-xl shadow-lg w-full h-64 object-cover"
        />
      </section>

      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center flex-col-reverse md:flex-row">
        <img
          src="https://plus.unsplash.com/premium_photo-1661315492902-528b6230a937?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Vision"
          className="rounded-xl shadow-lg w-full h-64 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where finding a home is simple, seamless, and
            stress-free, for both landlords and tenants alike.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-8">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Team Member */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <img
              src="https://avatars.githubusercontent.com/u/171141895?u=285747b5eecb28f5e3413bd1fe122596f54d38bc&v=4&size=64"
              alt="Aman Sapkota"
              className="mx-auto mb-4 rounded-full w-24 h-24 object-cover"
            />
            <h3 className="text-xl font-bold">Aman Sapkota</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <img
              src="https://avatars.githubusercontent.com/u/175528989?v=4"
              alt="Pratik Maharjan"
              className="mx-auto mb-4 rounded-full w-24 h-24 object-cover"
            />
            <h3 className="text-xl font-bold">Pratik Maharjan</h3>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <img
              src="https://media.discordapp.net/attachments/1383051174873137185/1383590369178157106/IMG_20250615_051859.jpg?ex=684f5871&is=684e06f1&hm=b48e1f365570d1b3d902d7c61f29ec22ecc5251d4a83634f24d8b6052e63fde6&=&format=webp&width=626&height=829"
              alt="Sajal Maharjan"
              className="mx-auto mb-4 rounded-full w-24 h-24 object-cover"
            />
            <h3 className="text-xl font-bold">Sajal Maharjan</h3>
          </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
            <img
              src="https://scontent.fktm9-2.fna.fbcdn.net/v/t39.30808-6/488579537_1167824598165127_5280000675100375524_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=hYAs8tm3cvgQ7kNvwF-UDzf&_nc_oc=AdnZOyrVBeliVeymM78b1lCIbFIcPCuDj4x_7hj0Vzlp9g0kQEG5uEy8fxbM8o0v1TQ&_nc_zt=23&_nc_ht=scontent.fktm9-2.fna&_nc_gid=0KZv9d2l_kAzQtGdwE53QQ&oh=00_AfPDm_IWYWLDwPBUkP8be46uPgAMGiKdanX6QNko9eWziw&oe=6853E62C"
              alt="Sarad Aryal"
              className="mx-auto mb-4 rounded-full w-24 h-24 object-cover"
            />
            <h3 className="text-xl font-bold">Sarad Aryal</h3>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 md:px-20 text-center bg-yellow-100">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Want to partner with us?
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          We're always looking to collaborate with like-minded individuals and
          organizations who share our vision.
        </p>
        <button className="bg-yellow-500 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition">
          Contact Us
        </button>
      </section>
    </div>
    {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
      <img className="h-12 w-16 m-0 p-0" src="./placeholder-logo.svg" alt="" />
                  <span className="text-white font-bold text-lg"></span>
                </div>
                <span className="text-xl font-bold">GharDera</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Connecting Tenants with affordable accommodation in Kathmandu. No broker fees, direct contact, secure
                platform.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Facebook
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Instagram
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  Twitter
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6">For Students</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/properties" className="hover:text-white transition-colors">
                    Browse Rooms
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Student Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">For Landlords</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/properties/new" className="hover:text-white transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link href="/landlord-guide" className="hover:text-white transition-colors">
                    Landlord Guide
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-white transition-colors">
                    Get Verified
                  </Link>
                </li>
                <li>
                  <Link href="/landlord-support" className="hover:text-white transition-colors">
                    Landlord Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Contact Us</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>+977-1-4444444</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>help@ghardera.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GharDera. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
     </>
  );
 
};


export default AboutUs;