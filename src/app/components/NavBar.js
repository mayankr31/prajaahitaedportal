//navbar
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Menu, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar"; 
import { userAPI } from "@/lib/api";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState(null); // State to store user image URL
  const menuRef = useRef(null);
  const params = useParams();
  const role = params.role; // Get the role from the URL parameters

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data including the image when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const userData = await userAPI.getById(session.user.id);
          if (userData && userData.data && userData.data.image) {
            setUserImage(userData.data.image);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]); // Re-run when session changes

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleProfileClick = () => {
    router.push(`/${role}/profile`);
    setIsMenuOpen(false);
  };

  // Get user's first letter for avatar
  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between w-full px-6 mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <img src="/logoprajaahita.jpg" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar (commented out as per original code) */}
          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-700" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 pl-10 pr-3 py-1 border border-gray-600 rounded-lg leading-5 bg-white placeholder-gray-500 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
            />
          </div> */}

          {/* User Avatar */}
          <div className="relative">
            <button className="flex items-center border border-gray-600 justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              {userImage ? (
                <Avatar
                  alt={session?.user?.name || "User"}
                  src={userImage}
                  sx={{ width: 40, height: 40 }} // Set size for MUI Avatar
                />
              ) : (
                <span className="text-lg font-medium text-black">
                  {getUserInitial()}
                </span>
              )}
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
                  {/* User info in mobile */}
                  {session?.user && (
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 md:hidden">
                      <div className="font-medium">{session.user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {session.user.role}
                      </div>
                    </div>
                  )}

                  {/* Profile Button */}
                  {(role === "student" ||
                    role === "volunteer" ||
                    role === "expert") && (
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </button>
                  )}

                  {/* Sign Out Button */}
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