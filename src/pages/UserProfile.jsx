import React, { useState } from "react";
import { Save, Mail, Globe, Bell, Key, Eye, EyeOff } from "lucide-react";
import dummyData from "../data/dummyData.json";

const UserProfile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    country: user?.country || "US",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAddress: user?.email || "",
    frequency: "immediate",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saveMessage, setSaveMessage] = useState("");

  const handleProfileSave = () => {
    // Update user data
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleNotificationSave = () => {
    setSaveMessage("Notification settings updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage("New passwords do not match!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveMessage("Password must be at least 6 characters long!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    // Reset password form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setSaveMessage("Password updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Information", icon: Globe },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "password", label: "Change Password", icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-3px p-4">
          <p className="text-green-800">{saveMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-3px shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country of Operation
                    </label>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <select
                        value={profileData.country}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            country: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {dummyData.countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      This determines your import/export perspective
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleProfileSave}
                    className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Email Notifications
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address for Notifications
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        value={notificationSettings.emailAddress}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailAddress: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="notifications@example.com"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Leave blank to use your account email address
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notification Frequency
                    </label>
                    <select
                      value={notificationSettings.frequency}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          frequency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="immediate">
                        Immediate (Real-time alerts)
                      </option>
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Currently, only immediate notifications are available
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-3px border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    What you'll receive notifications about:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Rate changes affecting your tracked products</li>
                    <li>• New trade agreement implementations</li>
                    <li>• Market analysis updates</li>
                    <li>• Important policy changes</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleNotificationSave}
                    className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Save Notification Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Key
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Key
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Key
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-3px focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handlePasswordSave}
                    className="bg-primary-600 text-white px-6 py-2 rounded-3px hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
