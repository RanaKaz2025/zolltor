import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, List, CircleUserRound, LogOut, Home } from "lucide-react";

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/src/assets/zolltor-logo.png"
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
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <CircleUserRound size={18} />
                  <span className="hidden sm:inline">Ceo</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
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
