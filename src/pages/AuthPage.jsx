import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Globe } from "lucide-react";
import Select from "../components/Select";
import dummyData from "../data/dummyData.json";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // Start with login (sign in)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "ceo@gmail.com",
    password: "123456",
    country: "DE",
    language: "english",
    role: "ceo",
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
          <h1 className="text-20-bold text-gray-800 mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-16-regular text-gray-500">
            {isLogin
              ? "Access your tariff watchlist and get personalized alerts"
              : "Join Zolltor to monitor tariff changes and make informed trade decisions"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-16-regular text-gray-800 mb-2">
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
                className={`w-full pl-10 pr-3 py-2 ${
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
            <label className="block text-16-regular text-gray-800 mb-2">
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
                className={`w-full pl-10 pr-3 py-2 ${
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
            <>
              <div>
                <label className="block text-16-regular text-gray-800 mb-2">
                  Language Preference *
                </label>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <input
                      id="language-english"
                      name="language"
                      type="radio"
                      value="english"
                      checked={formData.language === "english"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="language-english"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      English
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="language-german"
                      name="language"
                      type="radio"
                      value="german"
                      checked={formData.language === "german"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="language-german"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      German
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-16-regular text-gray-800 mb-2">
                  Role *
                </label>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input
                      id="role-ceo"
                      name="role"
                      type="radio"
                      value="ceo"
                      checked={formData.role === "ceo"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="role-ceo"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      CEO
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-cfo"
                      name="role"
                      type="radio"
                      value="cfo"
                      checked={formData.role === "cfo"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="role-cfo"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      CFO
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-supply-chain"
                      name="role"
                      type="radio"
                      value="supply-chain"
                      checked={formData.role === "supply-chain"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="role-supply-chain"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      Supply Chain Manager
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-other"
                      name="role"
                      type="radio"
                      value="other"
                      checked={formData.role === "other"}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="role-other"
                      className="ml-2 text-16-regular text-gray-800"
                    >
                      Other
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-16-regular text-gray-800 mb-2">
                  Country of Operation *
                </label>
                <div className="relative">
                  <Select
                    value={formData.country}
                    onChange={(value) =>
                      handleInputChange({ target: { name: "country", value } })
                    }
                    options={dummyData.countries.map((country) => ({
                      value: country.code,
                      label: `${country.flag} ${country.name}`,
                    }))}
                    placeholder="Select your country"
                    className={`${errors.country ? "border-red-300" : ""}`}
                    required={!isLogin}
                  />
                </div>
                {errors.country && (
                  <p className="mt-1 text-14-regular text-red-600">
                    {errors.country}
                  </p>
                )}
                <p className="mt-1 text-14-regular text-gray-500">
                  This helps us personalize your trade data perspective
                </p>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary btn-md w-full ">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Password Recovery */}
        {isLogin && (
          <div className="mt-2 text-center">
            <button className="btn-link btn-sm">Forgot your password?</button>
          </div>
        )}

        {/* Switch Mode */}
        <div className="mt-6 text-center">
          <p className="text-16-regular text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                if (isLogin) {
                  // Switching to signup - set defaults for signup
                  setFormData({
                    email: "",
                    password: "",
                    country: "DE",
                    language: "english",
                    role: "ceo",
                  });
                } else {
                  // Switching to login - set defaults for login
                  setFormData({
                    email: "ceo@gmail.com",
                    password: "123456",
                  });
                }
              }}
              className="ml-1 btn-link btn-md"
            >
              {isLogin ? "Create Account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      {/* Information Box */}
      {/* <div className="mt-6 bg-blue-50 border border-blue-200 rounded-3px p-4">
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
      </div> */}
    </div>
  );
};

export default AuthPage;
