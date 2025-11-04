import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  List,
  CircleUserRound,
  LogOut,
  Home,
  Settings,
  ChevronDown,
} from "lucide-react";

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/zolltor-logo.png"
                alt="Zolltor Logo"
                className="w-[128px] h-[128px] object-contain"
              />
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 transition-colors  relative ${
                  location.pathname === "/"
                    ? "text-16-semibold text-primary-700"
                    : "text-16-regular text-gray-800 hover:text-primary-600 active:text-primary-700"
                }`}
              >
                <span>Tariff Lookup</span>
                {location.pathname === "/" && (
                  <div className="absolute bottom-[-20px] left-[-20px] right-[-20px] h-[2px] bg-primary-700"></div>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  to="/watchlist"
                  className={`flex items-center space-x-1 transition-colors relative ${
                    location.pathname === "/watchlist"
                      ? "text-16-semibold text-primary-700"
                      : "text-16-regular text-gray-800 hover:text-primary-600 active:text-primary-700"
                  }`}
                >
                  <span>My Watchlist</span>
                  {location.pathname === "/watchlist" && (
                    <div className="absolute bottom-[-20px] left-[-20px] right-[-20px] h-[2px] bg-primary-700"></div>
                  )}
                </Link>
              )}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* <span className="text-sm text-gray-700">
                  Welcome, {user?.name || user?.email}
                </span> */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 text-teal-700 text-16-medium"
                  >
                    <CircleUserRound size={18} />
                    <span className="hidden sm:inline">CEO</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings size={16} />
                        <span>Profile Settings</span>
                      </button>
                      <hr className="border-gray-200 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              location.pathname !== "/auth" && (
                <Link
                  to="/auth"
                  className="bg-primary-600 text-white px-4 py-2 rounded-3px hover:bg-primary-700 transition-colors"
                >
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
