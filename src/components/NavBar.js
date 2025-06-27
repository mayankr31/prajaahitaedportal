// 'use client'
// import React, { useState } from 'react';
// import { Search, Menu, User } from 'lucide-react';

// const Navbar = () => {
//   const [searchQuery, setSearchQuery] = useState('');

//   return (
//     <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
//       <div className="flex items-center justify-between w-full px-6 mx-auto">
//         {/* Logo Section */}
//         <div className="flex items-center">
//           <img 
//             src="/logoprajaahita.jpg" 
//             alt="Logo" 
//             className="h-10 w-auto"
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center space-x-4">
//           {/* Search Bar */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-700" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="block w-64 pl-10 pr-3 py-1 border border-gray-600 rounded-lg leading-5 bg-white placeholder-gray-500 placeholder:text-sm focus:outline-none  focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
//             />
//           </div>

//           {/* User Avatar */}
//           <div className="relative">
//             <button className="flex items-center border border-gray-600 justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
//               <span className="text-lg font-medium  text-black">S</span>
//             </button>
//           </div>

//           {/* Hamburger Menu */}
//           <button className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, User, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({callbackUrl: '/login'});
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between w-full px-6 mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <img 
            src="/logoprajaahita.jpg" 
            alt="Logo" 
            className="h-10 w-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-700" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 pl-10 pr-3 py-1 border border-gray-600 rounded-lg leading-5 bg-white placeholder-gray-500 placeholder:text-sm focus:outline-none  focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
            />
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button className="flex items-center border border-gray-600 justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <span className="text-lg font-medium  text-black">S</span>
            </button>
          </div>

          {/* Hamburger Menu */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;