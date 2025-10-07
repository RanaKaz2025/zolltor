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
                className={`flex items-center space-x-1 transition-colors pb-1 border-b-2 ${
                  location.pathname === "/"
                    ? "text-primary-700 font-semibold border-primary-700"
                    : "text-gray-700 hover:text-primary-600 border-transparent"
                }`}
              >
                <span>Tariff Lookup</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/watchlist"
                  className={`flex items-center space-x-1 transition-colors pb-1 border-b-2 ${
                    location.pathname === "/watchlist"
                      ? "text-primary-700 font-semibold  border-primary-700"
                      : "text-gray-700 hover:text-primary-600 border-transparent"
                  }`}
                >
                  <span>My Watchlist</span>
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
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors focus:outline-none"
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
              <Link
                to="/auth"
                className="bg-primary-600 text-white px-4 py-2 rounded-3px hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
