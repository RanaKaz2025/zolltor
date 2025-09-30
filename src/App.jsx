import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import ToastProvider from "./components/ToastProvider";
import TariffLookup from "./pages/TariffLookup";
import ProductWatchlist from "./pages/ProductWatchlist";
import HSCodeDetails from "./pages/HSCodeDetails";
import UserProfile from "./pages/UserProfile";
import AuthPage from "./pages/AuthPage";
import dummyData from "./data/dummyData.json";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check localStorage or session)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
          />

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<TariffLookup />} />
              <Route
                path="/auth"
                element={
                  isAuthenticated ? (
                    <Navigate to="/watchlist" replace />
                  ) : (
                    <AuthPage onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/watchlist"
                element={
                  isAuthenticated ? (
                    <ProductWatchlist user={user} />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route path="/hscode/:code" element={<HSCodeDetails />} />
              <Route
                path="/profile"
                element={
                  isAuthenticated ? (
                    <UserProfile user={user} setUser={setUser} />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
