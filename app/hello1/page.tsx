'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar = () => {
  const handleSearch = () => {
    console.log('Search clicked');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Logo */}
      <Link href="/">
        <img className="h-12 w-16 cursor-pointer" src="/photos/logo.svg" alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <div className="space-x-6 text-gray-600 flex items-center">
        <Link href="/browse" className="hover:text-black">
          Browse Properties
        </Link>
        <Button className="h-14 text-lg" onClick={handleSearch}>
          <Search className="w-5 h-5 mr-2" />
          Search Rooms
        </Button>
        <Link href="/aboutus" className="hover:text-black">
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
  );
};

export default NavBar;
