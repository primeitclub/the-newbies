import React from "react";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-0 shadow-sm">
      {/* Logo / Brand */}
      <img className="h-12 w-16 m-0 p-0" src="./photos/logo.svg" alt="" />
      {/* <div className="text-xl font-bold text-black">GharDera</div> */}

      {/* Nav Links */}
      <div className="space-x-6 text-gray-600">
        <a href="#" className="hover:text-black">
          Browse Properties
        </a>
        <Button className="h-14 text-lg" onClick={handleSearch}>
        <Search className="w-5 h-5 mr-2" />Search Rooms
                            
        </Button>
        <a href="#" className="hover:text-black">
          Contact
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="space-x-3">
        <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
          Login
        </button>
        <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
          Register
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
