import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Globe } from "lucide-react";
import dummyData from "../data/dummyData.json";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "ceo@gmail.com",
    password: "123456",
    country: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.country) {
        newErrors.country = "Country is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simulate authentication
    if (isLogin) {
      // Mock login - in real app, this would call an API
      const userData = {
        name: formData.name || "User",
        email: formData.email,
        country: formData.country || "US",
      };
      onLogin(userData);
    } else {
      // Mock registration - in real app, this would call an API
      const userData = {
        name: formData.name,
        email: formData.email,
        country: formData.country,
      };
      onLogin(userData);
    }
  };

  const handleSocialLogin = (provider) => {
    // Mock social login
    const userData = {
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      country: "US",
    };
    onLogin(userData);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3px shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Access your tariff watchlist and get personalized alerts"
              : "Join Zolltor to monitor tariff changes and make informed trade decisions"}
          </p>
        </div>

        {/* Social Login Buttons */}
        {/* <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-3px hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin("LinkedIn")}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-3px hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>Continue with LinkedIn</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => handleSocialLogin("Twitter")}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-3px hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              <span>Twitter</span>
            </button>

            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-3px hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div> */}

        {/* Divider */}
        {/* <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (Optional)
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-3 border rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="you@example.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Operation *
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.country ? "border-red-300" : "border-gray-300"
                  }`}
                  required={!isLogin}
                >
                  <option value="">Select your country</option>
                  {dummyData.countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This helps us personalize your trade data perspective
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-3px hover:bg-primary-700 transition-colors font-medium"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setFormData({ name: "", email: "", password: "", country: "" });
              }}
              className="ml-1 text-primary-600 hover:text-primary-800 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Password Recovery */}
        {isLogin && (
          <div className="mt-4 text-center">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Forgot your password?
            </button>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-3px p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Why create an account?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Monitor unlimited products in your watchlist</li>
          <li>• Receive real-time email alerts for tariff changes</li>
          <li>• Access detailed historical trend analysis</li>
          <li>• Export your watchlist data as CSV</li>
          <li>• Get personalized AI-powered recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthPage;
